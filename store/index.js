export const state = () => ({
  alerts: {}
})

export const getters = {
}

export const mutations = {
  SET_ALERT (state, error) {
    state.alerts = { message: error.message, statuscode: error.response.status, body: error.response.data.message, type: '' }
  },
  SET_CUSTOM_ALERT (state, error) {
    state.alerts = { message: error.message, type: 'custom' }
  }
}

export const actions = {
}
