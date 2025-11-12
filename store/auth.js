export const state = () => ({
  user: null,
  loggedIn: false,
  strategy: null
})

export const getters = {
  isLoggedIn: state => state.loggedIn,
  user: state => state.user,
  strategy: state => state.strategy
}

export const mutations = {
  SET_USER (state, user) {
    state.user = user || null
  },
  SET_LOGGED_IN (state, value) {
    state.loggedIn = Boolean(value)
  },
  SET_STRATEGY (state, name) {
    state.strategy = name || null
  }
}

export const actions = {}
