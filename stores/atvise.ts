import { defineStore } from 'pinia'
import lodash from 'lodash'

interface UserData {
  right?: string[]
  [key: string]: any
}

export const useAtviseStore = defineStore('atvise', {
  state: () => ({
    userData: {} as UserData,
    loggedIn: false,
    language: 'en'
  }),
  getters: {
    getUserData: (state) => state.userData,
    getLoggedIn: (state) => state.loggedIn,
    getLanguage: (state) => state.language,
    isSuperadmin: (state) => {
      const rights = state.userData?.right || []
      return Array.isArray(rights) ? rights.indexOf('USER.superadmin') !== -1 : false
    }
  },
  actions: {
    setUserData (user: UserData) {
      this.userData = user || {}
    },
    setLoggedIn (loggedIn: boolean) {
      this.loggedIn = Boolean(loggedIn)
    },
    setLanguage (language: string) {
      this.language = language || 'en'
    }
  }
})

export function mergeAuthStrategies (auth: any, strategies: Record<string, any>) {
  if (!auth || !strategies) { return }
  Object.keys(strategies).forEach((name) => {
    auth.strategies[name] = lodash.merge(auth.strategies[name], strategies[name])
  })
}
