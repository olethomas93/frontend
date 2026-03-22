import { defineNuxtPlugin } from '#app'
import lodash from 'lodash'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useAlertsStore } from '~/stores/alerts'
import { useAtviseStore, mergeAuthStrategies } from '~/stores/atvise'
import { useAuthStore } from '~/stores/auth'
import { useTranslationStore } from '~/stores/translation'

interface WebMIDataAPI {
  addEventListener(event: string, handler: (payload: any) => void): void
  login(
    username: string,
    password: string,
    options: Record<string, any>,
    callback: (response: any) => void
  ): void
  read(path: string, callback: (response: { value: any[] }) => void): void
}

interface WebMITrendFactory {
  createTrend(options: Record<string, any>, config?: Record<string, any>): void
}

interface WebMI {
  data: WebMIDataAPI
  trendFactory?: WebMITrendFactory
}

interface AtviseEnvironment {
  webMI: WebMI
  webMIConfig?: { auth?: { strategies?: Record<string, any> } }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) { return }

  const alertsStore = useAlertsStore()
  const atviseStore = useAtviseStore()
  const translationStore = useTranslationStore()
  const authStore = useAuthStore()
  const auth = (nuxtApp as any).$auth
  const { loggedIn } = storeToRefs(authStore)

  waitForAtviseEnvironment()
    .then((environment) => {
      const { webMI } = environment

      // loginAtvise is only needed for SSO strategies (AAD / auth0) that carry a
      // bearer token webMI needs to validate.  For the local form strategy the
      // session is established server-side and no extra webMI login call is made
      // (matching the original atvise.js behaviour).
      const needsWebMILogin = (strategyName: string) =>
        strategyName.includes('aad') || strategyName === 'auth0'

      const attemptLogin = () => {
        const strategyName = auth?.strategy?.name ?? ''
        if (auth?.loggedIn && needsWebMILogin(strategyName)) {
          loginAtvise(auth, webMI).catch(() => {})
        }
      }

      attemptLogin()

      auth?.onAuthStateChanged?.((state: any) => {
        if (state?.loggedIn && needsWebMILogin(auth?.strategy?.name ?? '')) {
          loginAtvise(auth, webMI).catch(() => {})
        }
      })

      watch(loggedIn, (isLoggedIn) => {
        if (isLoggedIn) {
          if (needsWebMILogin(auth?.strategy?.name ?? '')) {
            loginAtvise(auth, webMI).catch(() => {})
          }
          // After atviseLocal login webMI.js has upgraded the session.
          // atviseStuff2.js already tried (and failed) to fetch displays.js
          // before the user authenticated.  Retry switchLanguage now that the
          // webMI session carries auth headers so displays.js will succeed.
          const win = window as any
          if (typeof win.switchLanguage === 'function' && win.language) {
            win.switchLanguage(win.language)
          }
        }
      })

      setTimeout(() => {
        if (auth) {
          setAuthStrategies(auth, environment)
        }
        setColors(nuxtApp, webMI)
      }, 1000)

      webMI.data?.addEventListener('clientvariableschange', (event: any) => {
        handleClientVariablesChange({
          event,
          atviseStore,
          translationStore,
          alertsStore,
          webMI
        })
      })

      webMI.data?.addEventListener('permissionnotification', (notification: any) => {
        alertsStore.setCustomAlert({ message: notification })
      })
    })
    .catch((error) => {
      if (process.dev) {
        console.warn('[atvise] Failed to initialise Atvise integration:', error)
      }
    })
})

function handleClientVariablesChange ({
  event,
  atviseStore,
  translationStore,
  alertsStore,
  webMI
}: {
  event: any
  atviseStore: ReturnType<typeof useAtviseStore>
  translationStore: ReturnType<typeof useTranslationStore>
  alertsStore: ReturnType<typeof useAlertsStore>
  webMI: WebMI
}) {
  if ('preferredlanguage' in event) {
    atviseStore.setLanguage(event.preferredlanguage)
  }
  if (event.username?.length > 0) {
    if (event.additionalInfo) {
      try {
        event.additionalInfo = JSON.parse(event.additionalInfo)
      } catch (error) {
        // ignore parse errors
      }
    }
    atviseStore.setUserData({ ...event })
    atviseStore.setLoggedIn(true)
    translationStore.loadTranslations()
    try {
      webMI.trendFactory?.createTrend({}, { additionalModules: ['highcharts/modules/sankey.js', 'highcharts/modules/draggable-points.js'] })
    } catch (error) {
      // Fail silently
    }
  } else if (event.username === '') {
    atviseStore.setUserData({})
    atviseStore.setLoggedIn(false)
    alertsStore.setCustomAlert({ message: 'Login failed!' })
  }
}

function getTheme (webMI: WebMI, name = 'dark') {
  return new Promise((resolve, reject) => {
    if (!webMI.data?.read) {
      reject(new Error('webMI data API is unavailable'))
      return
    }

    webMI.data.read('SYSTEM.GLOBALS.theme.' + name, (data: any) => {
      if (!Array.isArray(data?.value)) {
        resolve({})
        return
      }
      let temp = '{'
      data.value.forEach((item: string, index: number, original: string[]) => {
        temp += item
        if (index + 1 < original.length) {
          temp += ','
        }
      })
      temp += '}'
      try {
        resolve(JSON.parse(temp))
      } catch (error) {
        reject(error)
      }
    })
  })
}

async function setColors (nuxtApp: any, webMI: WebMI) {
  const vuetify = nuxtApp.vueApp.config.globalProperties.$vuetify
  if (!vuetify?.theme?.themes) { return }
  const dark = await getTheme(webMI, 'dark').catch(() => ({}))
  Object.keys(dark).forEach((i) => {
    if (vuetify.theme.themes.dark) {
      vuetify.theme.themes.dark[i] = (dark as any)[i]?.color
    }
  })
  const light = await getTheme(webMI, 'light').catch(() => ({}))
  Object.keys(light).forEach((i) => {
    if (vuetify.theme.themes.light) {
      vuetify.theme.themes.light[i] = (light as any)[i]?.color
    }
  })
}

function loginAtvise (auth: any, webMI: WebMI) {
  return new Promise<void>(async (resolve, reject) => {
    if (!auth?.loggedIn) {
      return reject(new Error('Not logged in.'))
    }

    const email = auth.$state?.user?.email || auth.$state?.user?.preferred_username || auth.$state?.user?.name
    const token = auth.strategy?.token?.get?.()
    let idToken = lodash.get(auth.strategy, 'idToken', null)?.get?.()

    if (!webMI?.data?.login) {
      return reject(new Error('Atvise login API is unavailable'))
    }

    const login = () => webMI.data.login(email, '', { token, idToken }, (data: any) => {
      if (data['']?.username?.length > 0) {
        resolve()
      } else {
        alert('AAD login failed!')
        auth.logout?.()
      }
    })

    if (idToken) {
      const isValid = auth.strategy?.idToken?.status?.().valid?.()
      if (!isValid) {
        try {
          const { data } = await auth.refreshTokens?.()
          idToken = data?.id_token
          login()
        } catch (error) {
          reject(error as Error)
        }
      } else {
        login()
      }
    } else {
      login()
    }
  })
}

function setAuthStrategies (auth: any, environment: AtviseEnvironment) {
  const strategies = environment.webMIConfig?.auth?.strategies
  if (strategies) {
    mergeAuthStrategies(auth, strategies)
  }
}

function waitForAtviseEnvironment (timeout = 10000, interval = 100): Promise<AtviseEnvironment> {
  return new Promise((resolve, reject) => {
    const start = Date.now()

    const poll = () => {
      const environment = resolveAtviseEnvironment()
      if (environment) {
        resolve(environment)
        return
      }
      if (Date.now() - start >= timeout) {
        reject(new Error('Timed out waiting for Atvise runtime'))
        return
      }
      setTimeout(poll, interval)
    }

    poll()
  })
}

function resolveAtviseEnvironment (): AtviseEnvironment | null {
  if (!process.client) { return null }

  const candidateWindows = [window, getTopWindow()].filter(Boolean) as Window[]

  for (const win of candidateWindows) {
    try {
      const webMI = (win as any).webMI as WebMI | undefined
      if (webMI?.data) {
        const webMIConfig = (win as any).webMIConfig as AtviseEnvironment['webMIConfig']
        return { webMI, webMIConfig }
      }
    } catch (error) {
      // Ignore cross-origin errors and continue with the next candidate
    }
  }

  return null
}

function getTopWindow (): Window | null {
  if (typeof window === 'undefined') { return null }
  try {
    return window.top || null
  } catch (error) {
    if (process.dev) {
      console.warn('[atvise] Unable to access top window:', error)
    }
    return null
  }
}
