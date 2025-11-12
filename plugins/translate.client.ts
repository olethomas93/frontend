import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const store = (nuxtApp as any).$store

  const translate = (value?: string) => {
    if (!value) { return '' }
    const getter = store?.getters?.['translation/translateText']
    return typeof getter === 'function' ? getter(`T{${value}}`) : ''
  }

  nuxtApp.provide('T', translate)
  nuxtApp.vueApp.config.globalProperties.$T = translate
})
