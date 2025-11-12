import { defineNuxtPlugin } from '#app'
import lodash from 'lodash'
import { useAlertsStore } from '~/stores/alerts'
import { useAtviseStore, mergeAuthStrategies } from '~/stores/atvise'
import { useTranslationStore } from '~/stores/translation'

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) { return }

  const alertsStore = useAlertsStore()
  const atviseStore = useAtviseStore()
  const translationStore = useTranslationStore()
  const auth = (nuxtApp as any).$auth

  if (auth?.loggedIn) {
    loginAtvise(auth).catch(() => {})
  }

  auth?.onAuthStateChanged?.((state: any) => {
    if (state?.loggedIn) {
      loginAtvise(auth).catch(() => {})
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
      atviseStore.setLanguage(e.preferredlanguage)
    }
    if (e.username?.length > 0) {
      if (e.additionalInfo) {
        try {
          e.additionalInfo = JSON.parse(e.additionalInfo)
        } catch (error) {
          // ignore parse errors
        }
      }
      atviseStore.setUserData({ ...e })
      atviseStore.setLoggedIn(true)
      translationStore.loadTranslations()
      try {
        top.webMI.trendFactory.createTrend({}, { additionalModules: ['highcharts/modules/sankey.js', 'highcharts/modules/draggable-points.js'] })
      } catch (error) {
        // Fail silently
      }
    } else if (e.username === '') {
      atviseStore.setUserData({})
      atviseStore.setLoggedIn(false)
      alertsStore.setCustomAlert({ message: 'Login failed!' })
    }
  })

  top.webMI.data.addEventListener('permissionnotification', (notification: any) => {
    alertsStore.setCustomAlert({ message: notification })
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

function loginAtvise (auth: any) {
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
    mergeAuthStrategies(auth, strategies)
  }
}
