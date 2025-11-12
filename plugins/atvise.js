import lodash from 'lodash'

const atviseStore = {
  namespaced: true,
  state: () => ({
    userData: {},
    loggedIn: false,
    language: 'en'
  }),
  mutations: {
    SET_USERDATA (state, user) {
      state.userData = user
    },
    SET_LOGGEDIN (state, loggedin) {
      state.loggedIn = loggedin
    },
    SET_LANGUAGE (state, language) {
      state.language = language
    }
  },
  getters: {
    getUserData: (state) => {
      return state.userData
    },
    getLoggedIn: (state) => {
      return state.loggedIn
    },
    getLanguage: (state) => {
      return state.language
    },
    isSuperadmin: (state) => {
      const index = state.userData.right.indexOf('USER.superadmin')
      return index !== -1
    }
  }
}

export default (context, inject) => {
  context.store.registerModule('atvise', atviseStore)
  context.store.subscribe(async (mutation, state) => {
    if (mutation.type === 'auth/SET' && mutation.payload.key === 'loggedIn' && mutation.payload.value === true) {
      // Atvise login
      if (context.store.$auth.getStrategy().name.includes('aad') || context.store.$auth.getStrategy().name === 'auth0') {
        // if (context.store.$auth.getStrategy().name === 'auth0') {
        await loginAtvise(context)
      }
    }
  })
  setTimeout(() => {
    setAuthStrategies(context)
    setColors(context)
  }, 1000)
  // Eventlistener for atvise login ++
  top.webMI.data.addEventListener('clientvariableschange', function (e) {
    if ('preferredlanguage' in e) {
      context.store.commit('atvise/SET_LANGUAGE', e.preferredlanguage)
    }
    if (e.username?.length > 0) {
      if (e.additionalInfo) {
        try {
          e.additionalInfo = JSON.parse(e.additionalInfo)
        } catch (error) {
          // e.additionalInfo = {}
        }
      }
      context.store.commit('atvise/SET_USERDATA', { ...e })
      context.store.commit('atvise/SET_LOGGEDIN', true)
      // Load translations
      context.store.dispatch('translation/loadTranslations')
      // Ugly, but will load highcharts library from atvise server
      try {
        top.webMI.trendFactory.createTrend({}, { additionalModules: ['highcharts/modules/sankey.js', 'highcharts/modules/draggable-points.js'] })
      } catch (error) {
        // Fail silently
      }
    } else if (e.username === '') {
      context.store.commit('atvise/SET_USERDATA', {})
      context.store.commit('atvise/SET_LOGGEDIN', false)
      context.store.commit('SET_CUSTOM_ALERT', { message: 'Login failed!' })
    } else {
      console.log(e)
    }
  })
  top.webMI.data.addEventListener('permissionnotification', function (notification) {
    context.store.commit('SET_CUSTOM_ALERT', { message: notification })
  })
}

function getTheme (name = 'dark') {
  return new Promise((resolve) => {
    top.webMI.data.read('SYSTEM.GLOBALS.theme.' + name, (data) => {
      let temp = '{'
      data.value.forEach((item, index, original) => {
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

async function setColors (context) {
  const dark = await getTheme('dark')
  Object.keys(dark).forEach((i) => {
    context.$vuetify.theme.themes.dark[i] = dark[i].color
  })
  const light = await getTheme('light')
  Object.keys(light).forEach((i) => {
    context.$vuetify.theme.themes.light[i] = light[i].color
  })
}

function loginAtvise (context) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (!context.store.$auth.loggedIn) {
      return reject(new Error('Not logged in.'))
    }

    const email = context.store.$auth.$state.user.email || context.store.$auth.$state.user.preferred_username || context.store.$auth.$state.user.name
    const token = context.store.$auth.strategy.token.get()
    let idToken = lodash.get(context.store.$auth.strategy, 'idToken', null)?.get()

    // Function to login using webMI.data.login
    const login = () => top.webMI.data.login(email, '', { token, idToken }, (data) => {
      if (data[''].username.length > 0) {
        resolve()
      } else {
        alert('AAD login failed!')
        context.$auth.logout()
      }
    })

    if (idToken) {
      const isValid = context.store.$auth.strategy.idToken.status().valid()
      if (!isValid) {
        console.log('not valid')
        try {
          const { data } = await context.store.$auth.refreshTokens()
          idToken = data.id_token
          login()
        } catch (error) {
          reject(error)
        }
      } else {
        login()
      }
    } else {
      login()
    }
  })
}

// function loginAtvise (store) {
//   return new Promise((resolve, reject) => {
//     if (store.$auth.loggedIn === true) {
//       const email = store.$auth.$state.user.email
//       const token = store.$auth.strategy.token.get()
//       // Idtoken is only used in aad
//       const _idToken = lodash.get(store.$auth.strategy, 'idToken')
//       let idToken
//       if (_idToken) {
//         idToken = _idToken.get()
//         // Check if idtoken is valid
//         // Expires 10 minutes before access_token and auth does not refresh it
//         // So i made this "hack"
//         const isValid = store.$auth.strategy.idToken.status().valid()
//         if (!isValid) {
//           store.$auth.refreshTokens().then(({ data }) => {
//             idToken = data.id_token
//             top.webMI.data.login(email, '', { token, idToken }, (e) => {
//               resolve(e)
//             })
//           })
//         } else {
//           top.webMI.data.login(email, '', { token, idToken }, (e) => {
//             resolve(e)
//           })
//         }
//       } else {
//         top.webMI.data.login(email, '', { token, idToken }, (e) => {
//           resolve(e)
//         })
//       }
//     }
//   })
// }

function setAuthStrategies (context) {
  const strategies = top.webMIConfig?.auth?.strategies
  if (strategies) {
    Object.keys(strategies).forEach((i) => {
      context.$auth.strategies[i] = lodash.merge(context.$auth.strategies[i], strategies[i])
      // context.$auth.strategies[i] = { ...context.$auth.strategies[i], ...strategies[i] }
    })
  }
}
