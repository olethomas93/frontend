import { defineStore } from 'pinia'
import { useAtviseStore } from './atvise'

type TranslationEntry = {
  source: string
  translation: string
}

export const useTranslationStore = defineStore('translation', {
  state: () => ({
    translations: [] as TranslationEntry[]
  }),
  getters: {
    getTranslation: (state) => (text: string) => {
      const match = state.translations.find((entry) => entry.source === text)
      return match ? match.translation : text
    },
    translateText: (state) => (text: string) => {
      if (!text) { return '' }
      let temp = text
      const matches = Array.from(text.matchAll(/\T{([^}]+)\}/g))
      matches.forEach((match) => {
        const translation = state.translations.find((entry) => entry.source === match[1])
        const translatedText = translation ? translation.translation : match[1]
        temp = temp.replaceAll(match[0], translatedText)
      })
      return temp
    }
  },
  actions: {
    setTranslations (translations: TranslationEntry[]) {
      this.translations = translations
    },
    loadTranslations () {
      if (!process.client) { return }
      const atviseStore = useAtviseStore()
      const language = atviseStore.language || 'nb'
      top.webMI.data.read(`SYSTEM.TRANSLATIONS.${language}`, (data: any) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(data.value, 'text/xml')
        const trans = Array.from(doc.querySelectorAll('source')).map((source) => ({
          source: source.innerHTML,
          translation: source.nextElementSibling?.innerHTML ?? ''
        }))
        this.setTranslations(trans)
      })
    }
  }
})
