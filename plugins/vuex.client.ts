import { defineNuxtPlugin } from '#app'
import { createStore, Store } from 'vuex'
import * as rootStore from '~/store/index.js'
import * as alarmingModule from '~/store/alarming.js'
import * as authModule from '~/store/auth.js'
import * as translationModule from '~/store/translation.js'

function normalizeModule (module: any) {
  return {
    namespaced: true,
    state: module.state || (() => ({})),
    getters: module.getters || {},
    mutations: module.mutations || {},
    actions: module.actions || {}
  }
}

type RootState = typeof rootStore.state extends () => infer R ? R : Record<string, unknown>

export default defineNuxtPlugin((nuxtApp) => {
  const store = createStore({
    state: (typeof rootStore.state === 'function' ? (rootStore.state as () => RootState)() : {}) as RootState,
    getters: rootStore.getters || {},
    mutations: rootStore.mutations || {},
    actions: rootStore.actions || {},
    modules: {
      alarming: normalizeModule(alarmingModule),
      auth: normalizeModule(authModule),
      translation: normalizeModule(translationModule)
    }
  }) as Store<RootState>

  nuxtApp.vueApp.use(store)
  nuxtApp.vueApp.config.globalProperties.$store = store
  nuxtApp.provide('store', store)
  ;(nuxtApp as any).$store = store
})
