import { defineStore } from 'pinia'

type StrategyName = string | null

interface AuthUser {
  [key: string]: any
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    loggedIn: false,
    strategy: null as StrategyName
  }),
  getters: {
    isLoggedIn: (state) => state.loggedIn,
    currentUser: (state) => state.user,
    currentStrategy: (state) => state.strategy
  },
  actions: {
    setUser (user: AuthUser | null) {
      this.user = user ?? null
    },
    setLoggedIn (value: boolean) {
      this.loggedIn = Boolean(value)
    },
    setStrategy (name: StrategyName) {
      this.strategy = name ?? null
    }
  }
})
