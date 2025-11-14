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

  const compatibilityLayer = {
    theme: {
      themes: {
        light: createThemeProxy(vuetify, 'light'),
        dark: createThemeProxy(vuetify, 'dark')
      }
    }
  }

  nuxtApp.vueApp.use(vuetify)
  nuxtApp.provide('vuetify', vuetify)
  defineGlobalProperty(nuxtApp.vueApp.config.globalProperties, '$vuetify', compatibilityLayer)

  if (process.client) {
    const globalWindow = window as typeof window & { $nuxt?: Record<string, any> }
    globalWindow.$nuxt = globalWindow.$nuxt || {}
    globalWindow.$nuxt.$vuetify = compatibilityLayer
  }
})

function defineGlobalProperty (target: Record<string, any>, key: string, value: any) {
  if (!target || typeof target !== 'object') { return }
  const descriptor = Object.getOwnPropertyDescriptor(target, key)
  if (descriptor && descriptor.configurable === false) {
    if (process.dev) {
      console.warn(`[vuetify-plugin] Unable to overwrite ${key} on target`)
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
