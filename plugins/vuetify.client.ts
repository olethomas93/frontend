import { defineNuxtPlugin } from '#app'
import { inject, reactive } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

// ---------------------------------------------------------------------------
// Vuetify 3 provide/inject symbols (Symbol.for ensures cross-module identity)
// ---------------------------------------------------------------------------
const VUETIFY_DISPLAY = Symbol.for('vuetify:display')
const VUETIFY_THEME = Symbol.for('vuetify:theme')
const VUETIFY_DEFAULTS = Symbol.for('vuetify:defaults')
const VUETIFY_ICONS = Symbol.for('vuetify:icons')
const VUETIFY_LOCALE = Symbol.for('vuetify:locale')
const VUETIFY_DATE_ADAPTER = Symbol.for('vuetify:date-adapter')

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

  nuxtApp.vueApp.use(vuetify)
  nuxtApp.provide('vuetify', vuetify)

  // ---------------------------------------------------------------------------
  // Override the $vuetify computed that Vuetify 3 registered via app.mixin().
  // Our mixin is registered AFTER Vuetify's, so Vue 3's mergeObjectOptions
  // strategy (later wins) means our $vuetify computed takes precedence.
  //
  // We reconstruct the same reactive object Vuetify 3 would build, adding:
  //   breakpoint  – v2 alias for display (same properties: smAndDown, etc.)
  //   theme.currentTheme – v2 compat getter → current theme colours object
  //   theme.dark          – v2 compat getter/setter → toggle dark theme
  // ---------------------------------------------------------------------------
  nuxtApp.vueApp.mixin({
    computed: {
      $vuetify () {
        const display = inject.call(this, VUETIFY_DISPLAY) as any
        const theme = inject.call(this, VUETIFY_THEME) as any
        const defaults = inject.call(this, VUETIFY_DEFAULTS)
        const icons = inject.call(this, VUETIFY_ICONS)
        const locale = inject.call(this, VUETIFY_LOCALE)
        const date = inject.call(this, VUETIFY_DATE_ADAPTER)

        // Proxy wraps the reactive theme object to expose v2 compat properties
        // while keeping all v3 theme APIs intact.
        const themeCompat = theme
          ? new Proxy(theme as Record<string, any>, {
              get (target, prop: string) {
                if (prop === 'currentTheme') {
                  // v3: theme.current is a ref; .value.colors is the colour map
                  return target.current?.value?.colors ?? target.current?.colors ?? {}
                }
                if (prop === 'dark') {
                  return target.global?.name?.value === 'dark'
                }
                return Reflect.get(target, prop)
              },
              set (target, prop: string, value: any) {
                if (prop === 'dark') {
                  if (target.global?.name) {
                    target.global.name.value = value ? 'dark' : 'light'
                  }
                  return true
                }
                return Reflect.set(target, prop, value)
              }
            })
          : theme

        return reactive({
          defaults,
          display,
          theme: themeCompat,
          icons,
          locale,
          date,
          // v2 compat: $vuetify.breakpoint → same as $vuetify.display
          // Vuetify 3 display already exposes xs, sm, smAndDown, mdAndUp, etc.
          breakpoint: display
        })
      }
    }
  })

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
    globalWindow.$nuxt.$vuetify = vuetify
  }
})
