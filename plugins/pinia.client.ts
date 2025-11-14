import { defineNuxtPlugin } from '#app'
import { createPinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const existingPinia = (nuxtApp as any).$pinia || nuxtApp.vueApp.config.globalProperties.$pinia
  if (existingPinia) {
    return
  }

  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)
  nuxtApp.provide('pinia', pinia)
})
