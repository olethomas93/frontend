import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import mitt from 'mitt'
import { reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAtviseStore } from '~/stores/atvise'

interface AuthState {
  loggedIn: boolean
  user: any
  strategy: string | null
}

interface RefreshResult {
  data?: {
    access_token?: string | null
    id_token?: string | null
  }
}

interface AuthStrategy {
  name: string
  token: TokenAccessor
  idToken: TokenAccessor
  initialize(): Promise<void>
  handleRedirect(url: URL): Promise<boolean>
  restoreSession(): Promise<any | null>
  login(options?: Record<string, any>): Promise<any>
  logout(): Promise<void>
  refreshTokens?(): Promise<RefreshResult | void>
}

class TokenAccessor {
  private value: string | null = null

  get() {
    return this.value
  }

  set(value: string | null) {
    this.value = value ?? null
  }

  clear() {
    this.value = null
  }

  status() {
    return {
      valid: () => Boolean(this.value)
    }
  }
}

async function loadScript(src: string) {
  if (document.querySelector(`script[data-auth-loader="${src}"]`)) {
    return
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.dataset.authLoader = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script ${src}`))
    document.head.appendChild(script)
  })
}

class Auth0Strategy implements AuthStrategy {
  public readonly token = new TokenAccessor()
  public readonly idToken = new TokenAccessor()
  private clientPromise: Promise<any> | null = null
  private readonly logoutRedirectUri: string
  private readonly options: any

  constructor(public readonly name: string, options: any) {
    const redirectUri = options.redirectUri || window.location.origin
    this.logoutRedirectUri = options.logoutRedirectUri || redirectUri
    this.options = options
  }

  async initialize() {
    await this.ensureClient()
  }

  async handleRedirect(url: URL) {
    if (!url.searchParams.has('code') || !url.searchParams.has('state')) {
      return false
    }
    const client = await this.ensureClient()
    await client.handleRedirectCallback()
    await this.populateTokens(client)
    return true
  }

  async restoreSession() {
    const client = await this.ensureClient()
    const authenticated = await client.isAuthenticated()
    if (!authenticated) { return null }
    await this.populateTokens(client)
    return await client.getUser()
  }

  async login(options?: Record<string, any>) {
    const client = await this.ensureClient()
    await client.loginWithRedirect({
      ...options,
      authorizationParams: {
        audience: this.options.audience,
        scope: this.options.scope || 'openid profile email',
        redirect_uri: this.options.redirectUri || window.location.origin,
        ...(options?.authorizationParams || {})
      }
    })
  }

  async logout() {
    const client = await this.ensureClient()
    await client.logout({ logoutParams: { returnTo: this.logoutRedirectUri } })
    this.token.clear()
    this.idToken.clear()
  }

  async refreshTokens() {
    const client = await this.ensureClient()
    const accessToken = await client.getTokenSilently({
      authorizationParams: {
        audience: this.options.audience,
        scope: this.options.scope || 'openid profile email',
        redirect_uri: this.options.redirectUri || window.location.origin
      },
      cacheMode: 'off'
    })
    const claims = await client.getIdTokenClaims()
    const idToken = claims?.__raw ?? null
    this.token.set(accessToken)
    this.idToken.set(idToken)
    return { data: { access_token: accessToken, id_token: idToken } }
  }

  private async ensureClient() {
    if (!this.clientPromise) {
      this.clientPromise = this.createClient()
    }
    return this.clientPromise
  }

  private async createClient() {
    if (!(window as any).createAuth0Client) {
      const sdkUrl = this.options.sdkUrl || 'https://cdn.auth0.com/js/auth0-spa-js/2.1/auth0-spa-js.production.js'
      await loadScript(sdkUrl)
    }
    const factory = (window as any).createAuth0Client
    if (typeof factory !== 'function') {
      throw new Error('Auth0 SDK failed to load')
    }
    return await factory({
      domain: this.options.domain,
      clientId: this.options.clientId,
      authorizationParams: {
        audience: this.options.audience,
        scope: this.options.scope || 'openid profile email',
        redirect_uri: this.options.redirectUri || window.location.origin
      },
      cacheLocation: this.options.useRefreshTokens ? 'localstorage' : 'memory',
      useRefreshTokens: Boolean(this.options.useRefreshTokens)
    })
  }

  private async populateTokens(client: any) {
    const accessToken = await client.getTokenSilently({
      authorizationParams: {
        audience: this.options.audience,
        scope: this.options.scope || 'openid profile email',
        redirect_uri: this.options.redirectUri || window.location.origin
      }
    })
    const claims = await client.getIdTokenClaims()
    this.token.set(accessToken)
    this.idToken.set(claims?.__raw ?? null)
  }
}

class AadStrategy implements AuthStrategy {
  public readonly token = new TokenAccessor()
  public readonly idToken = new TokenAccessor()
  private applicationPromise: Promise<any> | null = null
  private account: any = null
  private readonly options: any

  constructor(public readonly name: string, options: any) {
    this.options = options
  }

  async initialize() {
    const app = await this.ensureApplication()
    await app.initialize?.()
    this.account = app.getActiveAccount?.() || null
  }

  async handleRedirect(_url: URL) {
    const app = await this.ensureApplication()
    const result = await app.handleRedirectPromise?.()
    if (!result) { return false }
    this.account = result.account || null
    await this.populateFromResult(app, result)
    return true
  }

  async restoreSession() {
    const app = await this.ensureApplication()
    if (!this.account) {
      const accounts = app.getAllAccounts?.() || []
      this.account = accounts[0] || null
    }

    if (!this.account) { return null }

    try {
      const result = await app.acquireTokenSilent({
        account: this.account,
        scopes: this.getScopes()
      })
      await this.populateFromResult(app, result)
      return this.buildUser(result)
    } catch (error: any) {
      if (error?.name === 'InteractionRequiredAuthError') {
        return null
      }
      throw error
    }
  }

  async login(options?: Record<string, any>) {
    const app = await this.ensureApplication()
    await app.loginRedirect({
      scopes: this.getScopes(),
      ...(options || {})
    })
  }

  async logout() {
    const app = await this.ensureApplication()
    const account = this.account || app.getActiveAccount?.() || (app.getAllAccounts?.() || [])[0]
    await app.logoutRedirect({
      account: account || undefined,
      postLogoutRedirectUri: this.options.logoutRedirectUri || this.options.redirectUri || window.location.origin
    })
    this.token.clear()
    this.idToken.clear()
    this.account = null
  }

  async refreshTokens() {
    const app = await this.ensureApplication()
    const account = this.account || app.getActiveAccount?.() || (app.getAllAccounts?.() || [])[0]
    if (!account) { throw new Error('No active Azure AD account available') }
    const result = await app.acquireTokenSilent({
      account,
      scopes: this.getScopes(),
      forceRefresh: true
    })
    await this.populateFromResult(app, result)
    return {
      data: {
        access_token: result.accessToken,
        id_token: result.idToken
      }
    }
  }

  private async ensureApplication() {
    if (!this.applicationPromise) {
      this.applicationPromise = this.createApplication()
    }
    return this.applicationPromise
  }

  private async createApplication() {
    if (!(window as any).msal?.PublicClientApplication) {
      const sdkUrl = this.options.sdkUrl || 'https://alcdn.msauth.net/browser/2.38.0/js/msal-browser.min.js'
      await loadScript(sdkUrl)
    }
    const msal = (window as any).msal
    if (!msal?.PublicClientApplication) {
      throw new Error('MSAL browser SDK failed to load')
    }
    return new msal.PublicClientApplication({
      auth: {
        clientId: this.options.clientId,
        authority: this.options.authority || 'https://login.microsoftonline.com/organizations',
        redirectUri: this.options.redirectUri || window.location.origin,
        postLogoutRedirectUri: this.options.logoutRedirectUri || this.options.redirectUri || window.location.origin
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false
      }
    })
  }

  private getScopes(): string[] {
    const scope = this.options.scope
    if (Array.isArray(scope)) { return scope }
    if (typeof scope === 'string') { return scope.split(/\s+/).filter(Boolean) }
    return ['openid', 'profile', 'email']
  }

  private async populateFromResult(app: any, result: any) {
    this.account = result.account || null
    app.setActiveAccount?.(this.account || undefined)
    this.token.set(result.accessToken || null)
    this.idToken.set(result.idToken || null)
  }

  private buildUser(result: any) {
    const claims = result.idTokenClaims || {}
    return {
      ...claims,
      name: claims.name || this.account?.name,
      email: claims.email || claims.preferred_username || this.account?.username,
      preferred_username: claims.preferred_username || this.account?.username
    }
  }
}

class AtviseLocalStrategy implements AuthStrategy {
  public readonly name = 'atviseLocal'
  public readonly token = new TokenAccessor()
  public readonly idToken = new TokenAccessor()

  async initialize() {}
  async handleRedirect(_url: URL) { return false }
  async restoreSession() { return null }

  async login(options?: Record<string, any>): Promise<any> {
    const { username, password } = options ?? {}
    const result = await $fetch<{ username: string; role?: string; additionalInfo?: string }>(
      '/api/webmi/login',
      { method: 'POST', body: { username, password } }
    )
    // webMI clientvariableschange won't fire (HTTP transport broken), so set
    // the atvise store directly so the layout renders after local login.
    const atviseStore = useAtviseStore()
    atviseStore.setUserData({ username: result.username, additionalInfo: result.additionalInfo })
    atviseStore.setLoggedIn(true)
    return { name: result.username, email: result.username, role: result.role }
  }

  async logout() {
    const atviseStore = useAtviseStore()
    atviseStore.setLoggedIn(false)
    atviseStore.setUserData({})
  }
}

function createStubAuth() {
  const state: AuthState = reactive({
    loggedIn: false,
    user: null,
    strategy: null
  })
  const auth = {
    strategies: {} as Record<string, AuthStrategy>,
    get loggedIn() {
      return state.loggedIn
    },
    get strategy() {
      return null
    },
    get $state() {
      return state
    },
    loginWith: async () => { throw new Error('Authentication is only available in the browser') },
    logout: async () => {},
    refreshTokens: async () => undefined,
    onAuthStateChanged: () => () => {}
  }
  return { auth, state }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  if (!process.client) {
    const { auth } = createStubAuth()
    nuxtApp.provide('auth', auth)
    ;(nuxtApp as any).$auth = auth
    nuxtApp.vueApp.config.globalProperties.$auth = auth
    return
  }

  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const strategies: Record<string, AuthStrategy> = {}

  const authConfig = config.public?.auth?.strategies || {}

  if (authConfig.auth0?.domain && authConfig.auth0?.clientId) {
    strategies.auth0 = new Auth0Strategy('auth0', authConfig.auth0)
  }
  if (authConfig.aad?.clientId) {
    strategies.aad = new AadStrategy('aad', authConfig.aad)
  }
  // Always available: direct Atvise username/password login (used in local mode)
  strategies.atviseLocal = new AtviseLocalStrategy()

  const state = reactive<AuthState>({
    loggedIn: false,
    user: null,
    strategy: null
  })

  const emitter = mitt<{ stateChanged: AuthState }>()

  const setLoggedIn = (strategyName: string, user: any) => {
    state.strategy = strategyName
    state.loggedIn = true
    state.user = user || null
    authStore.setStrategy(strategyName)
    authStore.setLoggedIn(true)
    authStore.setUser(user)
    emitter.emit('stateChanged', { ...state })
  }

  const resetState = () => {
    state.strategy = null
    state.loggedIn = false
    state.user = null
    authStore.setStrategy(null)
    authStore.setLoggedIn(false)
    authStore.setUser(null)
    emitter.emit('stateChanged', { ...state })
  }

  const reportAuthError = (phase: string, strategyName: string, error: unknown) => {
    try {
      nuxtApp.callHook?.('auth:error', { phase, strategy: strategyName, error })
    } catch (_) {
      // swallow errors from custom hook listeners
    }
  }

  for (const strategy of Object.values(strategies)) {
    await strategy.initialize().catch((error) => {
      reportAuthError('initialize', strategy.name, error)
    })
  }

  const currentUrl = new URL(window.location.href)
  let handled = false
  for (const [name, strategy] of Object.entries(strategies)) {
    try {
      const wasHandled = await strategy.handleRedirect(currentUrl)
      if (wasHandled) {
        const user = await strategy.restoreSession()
        if (user) {
          setLoggedIn(name, user)
        }
        handled = true
        break
      }
    } catch (error) {
      reportAuthError('handleRedirect', name, error)
    }
  }

  if (handled) {
    window.history.replaceState({}, document.title, `${currentUrl.origin}${currentUrl.pathname}${currentUrl.hash}`)
  }

  if (!state.loggedIn) {
    for (const [name, strategy] of Object.entries(strategies)) {
      try {
        const user = await strategy.restoreSession()
        if (user) {
          setLoggedIn(name, user)
          break
        }
      } catch (error) {
        reportAuthError('restoreSession', name, error)
      }
    }
  }

  const auth = {
    strategies,
    get loggedIn() {
      return state.loggedIn
    },
    get strategy() {
      return state.strategy ? strategies[state.strategy] : null
    },
    get $state() {
      return state
    },
    async loginWith(name: string, options?: Record<string, any>) {
      const strategy = strategies[name]
      if (!strategy) {
        throw new Error(`Unknown auth strategy: ${name}`)
      }
      state.strategy = name
      authStore.setStrategy(name)
      const user = await strategy.login(options)
      // For non-redirect strategies (e.g. atviseLocal) login() returns the user directly
      if (user) {
        setLoggedIn(name, user)
      }
    },
    async logout() {
      const strategy = state.strategy ? strategies[state.strategy] : null
      resetState()
      if (strategy) {
        await strategy.logout()
      }
    },
    async refreshTokens() {
      const strategy = state.strategy ? strategies[state.strategy] : null
      if (!strategy?.refreshTokens) { return undefined }
      const result = await strategy.refreshTokens()
      return result
    },
    onAuthStateChanged(handler: (state: AuthState) => void) {
      emitter.on('stateChanged', handler)
      return () => emitter.off('stateChanged', handler)
    }
  }

  nuxtApp.provide('auth', auth)
  defineGlobalProperty(nuxtApp.vueApp.config.globalProperties, '$auth', auth)
  defineGlobalProperty(nuxtApp as any, '$auth', auth)
})

function defineGlobalProperty (target: Record<string, any>, key: string, value: any) {
  if (!target || typeof target !== 'object') { return }
  const descriptor = Object.getOwnPropertyDescriptor(target, key)
  if (descriptor && descriptor.configurable === false) {
    if (process.dev) {
      console.warn(`[auth-plugin] Unable to overwrite ${key} on target`)
    }
    return
  }
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: false,
    get () {
      return value
    }
  })
}
