export const state = () => ({
  translations: []
})

export const getters = {
  // eslint-disable-next-line arrow-parens
  getTranslation: (state) => (text) => {
    const trans = state.translations.find((element) => { return element.source === text })
    if (trans) {
      return trans.translation
    } else {
      return text
    }
    // return state.translations.find((element) => { return element.source === text })
  },
  // eslint-disable-next-line arrow-parens
  translateText: (state, getters) => (text) => {
    if (!text) {
      return ''
    }
    let temp = text
    // eslint-disable-next-line no-useless-escape
    const arr = Array.from(text.matchAll(/\T{([^}]+)\}/g))
    arr.map((trans) => {
      const source = trans[0]
      const translation = getters.getTranslation(trans[1]) // this.$store.getters['translation/getTranslation'](trans[1])
      temp = temp.replaceAll(source, translation)
      return translation
    })
    return temp
  }
}

export const mutations = {
  SET_TRANS (state, translations) {
    state.translations = translations
  }
}

// https://nuxtjs.org/docs/2.x/concepts/context-helpers#accessing-the-root-instance
export const actions = {
  loadTranslations ({ rootGetters, commit }) {
    const language = rootGetters['atvise/getLanguage']
    top.webMI.data.read(`SYSTEM.TRANSLATIONS.${language}`, (data) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(data.value, 'text/xml')
      console.log(data)
      // const trans = Array.from(doc.querySelectorAll('source'))
      const trans = Array.from(doc.querySelectorAll('source')).map((trans) => {
        return { source: trans.innerHTML, translation: trans.nextElementSibling.innerHTML }
      })
      commit('SET_TRANS', trans)
    })
  }
}
