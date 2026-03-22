import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const lightColors = {
  primary: '#00a3e0',
  accent: '#282828',
  secondary: '#ffb300',
  info: '#26a69a',
  warning: '#ffc72c',
  error: '#ff671f',
  success: '#26d07c',
  critical: '#bca0dc',
  background: '#999999',
  card: '#00ff00'
}

const darkColors = {
  primary: '#00a3e0',
  accent: '#282828',
  secondary: '#ffb300',
  info: '#26a69a',
  warning: '#ffc72c',
  error: '#ff671f',
  success: '#26d07c',
  critical: '#bca0dc',
  background: '#999999',
  card: '#ff00ff'
}

// ---------------------------------------------------------------------------
// Breakpoint compatibility (v2 $vuetify.breakpoint → v3 useDisplay equivalent)
// Returns a proxy that computes breakpoint booleans from window.innerWidth at
// read time — non-reactive but sufficient for template conditionals that
// re-render on layout events already handled by the parent.
// ---------------------------------------------------------------------------
function createBreakpointProxy () {
  return new Proxy({} as Record<string, unknown>, {
    get (_, prop: string) {
      if (!process.client) {
        // Sensible server-side defaults (md breakpoint)
        const ssrDefaults: Record<string, unknown> = {
          xs: false, sm: false, md: true, lg: false, xl: false,
          xsOnly: false, smOnly: false, mdOnly: true, lgOnly: false, xlOnly: false,
          smAndDown: false, smAndUp: true,
          mdAndDown: true, mdAndUp: true,
          lgAndDown: true, lgAndUp: false,
          name: 'md', width: 1280, height: 800, mobile: false
        }
        return ssrDefaults[prop]
      }
      const w = window.innerWidth
      const h = window.innerHeight
      const xs = w < 600
      const sm = w >= 600 && w < 960
      const md = w >= 960 && w < 1280
      const lg = w >= 1280 && w < 1920
      const xl = w >= 1920
      const bp: Record<string, unknown> = {
        xs, sm, md, lg, xl,
        xsOnly: xs, smOnly: sm, mdOnly: md, lgOnly: lg, xlOnly: xl,
        smAndDown: xs || sm,
        smAndUp: !xs,
        mdAndDown: xs || sm || md,
        mdAndUp: md || lg || xl,
        lgAndDown: xs || sm || md || lg,
        lgAndUp: lg || xl,
        name: xs ? 'xs' : sm ? 'sm' : md ? 'md' : lg ? 'lg' : 'xl',
        width: w,
        height: h,
        mobile: xs || sm
      }
      return bp[prop]
    }
  })
}

// ---------------------------------------------------------------------------
// Theme colour proxy (v2 currentTheme → v3 theme.colors)
// ---------------------------------------------------------------------------
function createThemeProxy (vuetify: ReturnType<typeof createVuetify>, themeName: string) {
  return new Proxy<Record<string, string>>({}, {
    get (_, prop: string) {
      return vuetify.theme.themes.value?.[themeName]?.colors?.[prop]
    },
    set (_, prop: string, value: string) {
      const theme = vuetify.theme.themes.value[themeName] ||= { dark: themeName === 'dark', colors: {} }
      theme.colors[prop] = value
      return true
    }
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: { dark: false, colors: { ...lightColors } },
        dark: { dark: true, colors: { ...darkColors } }
      }
    }
  })

  const breakpoint = createBreakpointProxy()
  const lightProxy = createThemeProxy(vuetify, 'light')
  const darkProxy = createThemeProxy(vuetify, 'dark')

  // Add v2 compat properties directly onto the vuetify instance so that
  // components accessing this.$vuetify (the real v3 instance) still find them.
  const vuetifyAny = vuetify as any
  if (!vuetifyAny.breakpoint) {
    vuetifyAny.breakpoint = breakpoint
  }
  // Patch theme with v2 helpers while keeping native v3 theme intact
  const origTheme = vuetifyAny.theme
  if (origTheme && !origTheme.currentTheme) {
    Object.defineProperty(origTheme, 'currentTheme', {
      configurable: true,
      enumerable: false,
      get () {
        const name = vuetify.theme.global.name.value as string
        return vuetify.theme.themes.value[name]?.colors ?? {}
      }
    })
    if (!Object.getOwnPropertyDescriptor(origTheme, 'dark')) {
      Object.defineProperty(origTheme, 'dark', {
        configurable: true,
        enumerable: false,
        get () { return vuetify.theme.global.name.value === 'dark' },
        set (value: boolean) { vuetify.theme.global.name.value = value ? 'dark' : 'light' }
      })
    }
    origTheme.themes = origTheme.themes ?? {}
    origTheme.themes.light = origTheme.themes.light ?? lightProxy
    origTheme.themes.dark = origTheme.themes.dark ?? darkProxy
  }

  const compatibilityLayer = {
    theme: origTheme ?? { currentTheme: {}, dark: false, themes: { light: lightProxy, dark: darkProxy } },
    breakpoint
  }

  nuxtApp.vueApp.use(vuetify)
  nuxtApp.provide('vuetify', vuetify)
  // Best-effort override; falls back to the properties on the vuetify instance above
  defineGlobalProperty(nuxtApp.vueApp.config.globalProperties, '$vuetify', compatibilityLayer)

  // Vuetify 2 components used inject: ['theme'] to get { isDark: boolean } from VApp.
  // Vuetify 3 removed this — provide a compat shim at the app level so those
  // components continue to work without touching each one individually.
  nuxtApp.vueApp.provide('theme', {
    get isDark () {
      return vuetify.theme.global.name.value === 'dark'
    }
  })

  if (process.client) {
    const globalWindow = window as typeof window & { $nuxt?: Record<string, unknown> }
    globalWindow.$nuxt = globalWindow.$nuxt || {}
    globalWindow.$nuxt.$vuetify = compatibilityLayer
  }
})

function defineGlobalProperty (target: Record<string, unknown>, key: string, value: unknown) {
  if (!target || typeof target !== 'object') { return }
  const descriptor = Object.getOwnPropertyDescriptor(target, key)
  if (descriptor && descriptor.configurable === false) {
    // Non-configurable: fall back to direct assignment (works when writable:true)
    try {
      (target as any)[key] = value
    } catch {
      if (process.dev) {
        console.warn(`[vuetify-plugin] Unable to overwrite ${key} on target`)
      }
    }
    return
  }
  try {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get () { return value }
    })
  } catch {
    try { (target as any)[key] = value } catch { /* ignore */ }
  }
}
