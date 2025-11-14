import { defineNuxtPlugin } from '#app'
import { useAlertsStore } from '~/stores/alerts'
import { useAuthStore } from '~/stores/auth'
import { useAtviseStore } from '~/stores/atvise'
import { useTranslationStore } from '~/stores/translation'
import { useAlarmingStore } from '~/stores/alarming'

type CommitHandler = (payload: any) => void | Promise<void>
type DispatchHandler = (payload: any) => any

export default defineNuxtPlugin((nuxtApp) => {
  const alertsStore = useAlertsStore()
  const authStore = useAuthStore()
  const atviseStore = useAtviseStore()
  const translationStore = useTranslationStore()
  const alarmingStore = useAlarmingStore()

  const state: Record<string, any> = {}
  const defineState = (key: string, getter: () => any) => {
    Object.defineProperty(state, key, {
      get: getter,
      enumerable: true
    })
  }

  defineState('alerts', () => alertsStore.alerts)
  defineState('auth', () => authStore.$state)
  defineState('atvise', () => atviseStore.$state)
  defineState('translation', () => translationStore.$state)
  defineState('alarming', () => alarmingStore.$state)

  const getterMap: Record<string, any> = {
    'translation/getTranslation': translationStore.getTranslation,
    'translation/translateText': translationStore.translateText,
    'alarming/getAlarmCount': alarmingStore.getAlarmCount,
    'alarming/alarmCount': alarmingStore.getAlarmCount,
    'alarming/getAlarms': alarmingStore.getAlarms,
    'alarming/getConditions': alarmingStore.getConditions,
    'atvise/getLanguage': atviseStore.getLanguage,
    'atvise/getUserData': atviseStore.getUserData,
    'atvise/getLoggedIn': atviseStore.getLoggedIn,
    'atvise/isSuperadmin': atviseStore.isSuperadmin,
    'userData/getIsAdmin': () => false,
    'userData/getRight': () => () => '',
    'userData/getRootBase': () => '',
    'userData/getBase': () => ''
  }

  const commitMap: Record<string, CommitHandler> = {
    SET_ALERT: (payload) => alertsStore.setAlert(payload),
    SET_CUSTOM_ALERT: (payload) => alertsStore.setCustomAlert(payload),
    'auth/SET_USER': (payload) => authStore.setUser(payload),
    'auth/SET_LOGGED_IN': (payload) => authStore.setLoggedIn(payload),
    'auth/SET_STRATEGY': (payload) => authStore.setStrategy(payload),
    'atvise/SET_USERDATA': (payload) => atviseStore.setUserData(payload),
    'atvise/SET_LOGGEDIN': (payload) => atviseStore.setLoggedIn(payload),
    'atvise/SET_LANGUAGE': (payload) => atviseStore.setLanguage(payload)
  }

  const dispatchMap: Record<string, DispatchHandler> = {
    'translation/loadTranslations': () => translationStore.loadTranslations(),
    'alarming/list': () => alarmingStore.list(),
    'alarming/conditions': () => alarmingStore.conditionsAction(),
    'alarming/getCategories': () => alarmingStore.getCategoriesAction(),
    'alarming/acknowledge': (payload: any) => alarmingStore.acknowledge(payload),
    'alarming/shelve': (payload: any) => alarmingStore.shelve(payload),
    'alarming/unshelve': (payload: any) => alarmingStore.unshelve(payload),
    logout: async () => {
      const auth = (nuxtApp as any).$auth
      if (auth?.logout) {
        await auth.logout()
      }
    }
  }

  const gettersProxy = new Proxy({}, {
    get: (_target, key: string) => getterMap[key]
  })

  const legacyStore = {
    state,
    getters: gettersProxy,
    commit (type: string, payload?: any) {
      const handler = commitMap[type]
      if (handler) {
        return handler(payload)
      }
      if (process.dev) {
        console.warn(`[legacy-store] Unknown commit type: ${type}`)
      }
    },
    dispatch (type: string, payload?: any) {
      const handler = dispatchMap[type]
      if (!handler) {
        if (process.dev) {
          console.warn(`[legacy-store] Unknown dispatch type: ${type}`)
        }
        return Promise.resolve()
      }
      try {
        const result = handler(payload)
        return result instanceof Promise ? result : Promise.resolve(result)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    hasModule: (name: string) => ['alerts', 'auth', 'atvise', 'translation', 'alarming'].includes(name),
    registerModule: () => {},
    unregisterModule: () => {}
  }

  nuxtApp.provide('store', legacyStore)

  defineGlobalProperty(nuxtApp.vueApp.config.globalProperties, '$store', legacyStore)
  defineGlobalProperty(nuxtApp as any, '$store', legacyStore)

  if (process.client) {
    const globalWindow = window as typeof window & { $nuxt?: Record<string, any> }
    globalWindow.$nuxt = globalWindow.$nuxt || {}
    globalWindow.$nuxt.$store = legacyStore
  }
})

function defineGlobalProperty (target: Record<string, any>, key: string, value: any) {
  if (!target || typeof target !== 'object') { return }
  const descriptor = Object.getOwnPropertyDescriptor(target, key)
  if (descriptor && descriptor.configurable === false) {
    if (process.dev) {
      console.warn(`[legacy-store] Unable to overwrite ${key} on target`)
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
