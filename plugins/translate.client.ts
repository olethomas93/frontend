import { defineNuxtPlugin } from '#app'
import { useTranslationStore } from '~/stores/translation'

export default defineNuxtPlugin((nuxtApp) => {
  const translationStore = useTranslationStore()

  const translate = (value?: string) => {
    if (!value) { return '' }
    return translationStore.translateText(`T{${value}}`)
  }

  nuxtApp.vueApp.config.globalProperties.$T = translate

  return {
    provide: {
      T: translate
    }
  }
})
