import { defineNuxtPlugin } from '#app'
import lodash from 'lodash'

const atviseStore = {
  namespaced: true,
  state: () => ({
    userData: {},
    loggedIn: false,
    language: 'en'
  }),
  mutations: {
    SET_USERDATA (state: any, user: any) {
      state.userData = user
    },
    SET_LOGGEDIN (state: any, loggedin: boolean) {
      state.loggedIn = loggedin
    },
    SET_LANGUAGE (state: any, language: string) {
      state.language = language
    }
  },
  getters: {
    getUserData: (state: any) => state.userData,
    getLoggedIn: (state: any) => state.loggedIn,
    getLanguage: (state: any) => state.language,
    isSuperadmin: (state: any) => {
      const rights = state.userData?.right || []
      return Array.isArray(rights) ? rights.indexOf('USER.superadmin') !== -1 : false
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const store = (nuxtApp as any).$store
  if (!store) { return }

  if (!store.hasModule('atvise')) {
    store.registerModule('atvise', atviseStore)
  }

  const auth = (nuxtApp as any).$auth

  if (auth?.loggedIn) {
    loginAtvise(store, auth).catch(() => {})
  }

  auth?.onAuthStateChanged?.((state: any) => {
    if (state?.loggedIn) {
      loginAtvise(store, auth).catch(() => {})
    }
  })

  setTimeout(() => {
    if (auth) {
      setAuthStrategies(auth)
    }
    setColors(nuxtApp)
  }, 1000)

  top.webMI.data.addEventListener('clientvariableschange', (e: any) => {
    if ('preferredlanguage' in e) {
      store.commit('atvise/SET_LANGUAGE', e.preferredlanguage)
    }
    if (e.username?.length > 0) {
      if (e.additionalInfo) {
        try {
          e.additionalInfo = JSON.parse(e.additionalInfo)
        } catch (error) {
          // ignore parse errors
        }
      }
      store.commit('atvise/SET_USERDATA', { ...e })
      store.commit('atvise/SET_LOGGEDIN', true)
      store.dispatch('translation/loadTranslations')
      try {
        top.webMI.trendFactory.createTrend({}, { additionalModules: ['highcharts/modules/sankey.js', 'highcharts/modules/draggable-points.js'] })
      } catch (error) {
        // Fail silently
      }
    } else if (e.username === '') {
      store.commit('atvise/SET_USERDATA', {})
      store.commit('atvise/SET_LOGGEDIN', false)
      store.commit('SET_CUSTOM_ALERT', { message: 'Login failed!' })
    }
  })

  top.webMI.data.addEventListener('permissionnotification', (notification: any) => {
    store.commit('SET_CUSTOM_ALERT', { message: notification })
  })
})

function getTheme (name = 'dark') {
  return new Promise((resolve) => {
    top.webMI.data.read('SYSTEM.GLOBALS.theme.' + name, (data: any) => {
      let temp = '{'
      data.value.forEach((item: string, index: number, original: string[]) => {
        temp += item
        if (index + 1 < original.length) {
          temp += ','
        }
      })
      temp += '}'
      resolve(JSON.parse(temp))
    })
  })
}

async function setColors (nuxtApp: any) {
  const vuetify = nuxtApp.vueApp.config.globalProperties.$vuetify
  if (!vuetify?.theme?.themes) { return }
  const dark = await getTheme('dark')
  Object.keys(dark).forEach((i) => {
    vuetify.theme.themes.dark[i] = dark[i].color
  })
  const light = await getTheme('light')
  Object.keys(light).forEach((i) => {
    vuetify.theme.themes.light[i] = light[i].color
  })
}

function loginAtvise (store: any, auth: any) {
  return new Promise<void>(async (resolve, reject) => {
    if (!auth?.loggedIn) {
      return reject(new Error('Not logged in.'))
    }

    const email = auth.$state?.user?.email || auth.$state?.user?.preferred_username || auth.$state?.user?.name
    const token = auth.strategy?.token?.get?.()
    let idToken = lodash.get(auth.strategy, 'idToken', null)?.get?.()

    const login = () => top.webMI.data.login(email, '', { token, idToken }, (data: any) => {
      if (data['']?.username?.length > 0) {
        resolve()
      } else {
        alert('AAD login failed!')
        auth.logout?.()
      }
    })

    if (idToken) {
      const isValid = auth.strategy?.idToken?.status?.().valid?.()
      if (!isValid) {
        try {
          const { data } = await auth.refreshTokens?.()
          idToken = data?.id_token
          login()
        } catch (error) {
          reject(error as Error)
        }
      } else {
        login()
      }
    } else {
      login()
    }
  })
}

function setAuthStrategies (auth: any) {
  const strategies = top.webMIConfig?.auth?.strategies
  if (strategies) {
    Object.keys(strategies).forEach((i) => {
      auth.strategies[i] = lodash.merge(auth.strategies[i], strategies[i])
    })
  }
}
