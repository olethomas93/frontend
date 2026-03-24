<template>
  <v-app :style="{ backgroundColor: !isLoggedIn ? 'grey' : 'white' }">
    <template v-if="!isLoggedIn && isLocal">
      <Snackbar />
      <Login />
    </template>
    <template v-else-if="isLoggedIn">
      <v-navigation-drawer
        v-if="!lodashGet(navigationDrawer, 'disable', false)"
        v-model="drawer"
        :rail="lgAndUp"
        :expand-on-hover="lgAndUp"
        :temporary="false"
        :color="navigationDrawer.color"
        :width="navigationDrawer.width"
        :class="{ 'navigation-drawer--dark': navigationDrawer.dark }"
        app
      >
        <template #prepend>
          <UserInfo />
        </template>
        <v-divider />
        <NavList style="height:80%" />
        <template #append>
          <v-footer padless class="app-footer">
            <v-col class="text-center" cols="12">
              <div class="app_cr">
                {{ appCr }}
              </div>
              <div class="app_vers">
                {{ appVers }}
              </div>
              <div class="app_name">
                <strong>{{ appName }}</strong> edition
              </div>
            </v-col>
          </v-footer>
        </template>
      </v-navigation-drawer>
      <AlarmDrawer v-if="mdAndUp && !hideAlarmDrawer" />
      <v-app-bar
       
       
        fixed
        app
        :color="appBar.color"
        :class="{ 'app-bar--dark': appBar.dark }"
        :prominent="smAndDown"
      >
        <template v-if="lodashGet(appBar, 'logo.position') === 'left' && mdAndUp">
          <v-img max-width="180" :src="lodashGet(appBar, 'logo.src', 'logo.png')" class="mr-6" />
          <v-divider vertical inset />
        </template>
        <v-app-bar-nav-icon v-if="!lodashGet(navigationDrawer, 'disable', false)" @click.stop="drawer = !drawer" />
        <Crumbs style="flex-wrap:nowrap;overflow:scroll;" :default-base="defaultBase" :iframe-path="iframePath" />
        <v-spacer />
        <ServerTime v-if="lodashGet(appBar, 'time.show', false) === true && mdAndUp" />
        <template v-if="lodashGet(appBar, 'logo.position') === 'right' && mdAndUp">
          <v-img max-width="180" :src="lodashGet(appBar, 'logo.src', 'logo.png')" />
          <v-divider vertical inset />
        </template>
        <v-item-group v-if="lodashGet(appBar, 'zoom.show', false) && mdAndUp">
          <v-tooltip location="bottom" :open-delay="500">
            <template #activator="{ props }">
              <v-btn icon v-bind="props" @click="zoomIn">
                <v-icon>mdi-magnify-plus</v-icon>
              </v-btn>
            </template>
            <span>Zoom in</span>
          </v-tooltip>
          <v-tooltip location="bottom" :open-delay="500">
            <template #activator="{ props }">
              <v-btn icon v-bind="props" @click="zoomOut">
                <v-icon>mdi-magnify-minus</v-icon>
              </v-btn>
            </template>
            <span>Zoom out</span>
          </v-tooltip>
          <v-tooltip location="bottom" :open-delay="500">
            <template #activator="{ props }">
              <v-btn icon v-bind="props" @click="zoomAll">
                <v-icon>mdi-magnify-scan</v-icon>
              </v-btn>
            </template>
            <span>Zoom all</span>
          </v-tooltip>
        </v-item-group>
        <MainAlarm v-if="smAndDown || hideAlarmDrawer" base="AGENT.OBJECTS" class="mx-3" />
        <AppBarMenu>
          <template v-if="lodashGet(navigationDrawer, 'disable', false)" #user>
            <UserInfo />
          </template>
        </AppBarMenu>
      </v-app-bar>
      <v-main class="app-main">
        <AtviseDialog :dialog="true" />
        <Snackbar />
        <div id="mainContainer" class="main-container">
          <AtviseVisuV3 :style="{ zoom: zoom }" :settings="displaySettings" />
          <slot />
        </div>
      </v-main>
    </template>
    <Offline />
  </v-app>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, useNuxtApp, useRuntimeConfig } from '#imports'
import { useDisplay, useTheme } from 'vuetify'
import { storeToRefs } from 'pinia'
import get from 'lodash/get'
import type { Emitter } from 'mitt'
import MainAlarm from '~/components/common/alarm/mainAlarm.vue'
import AlarmDrawer from '~/components/common/alarm/drawer.vue'
import Crumbs from '@/components/crumbs.vue'
import UserInfo from '@/components/userInfo.vue'
import AtviseDialog from '~/components/atvise/atviseDialog.vue'
import Offline from '~/components/dialogOffline.vue'
import Login from '~/components/login.vue'
import NavList from '@/components/navList.vue'
import AppBarMenu from '@/components/appBarMenu.vue'
import ServerTime from '@/components/serverTime.vue'
import AtviseVisuV3 from '@/components/atviseVisuV3.vue'
import Snackbar from '@/components/snackbar.vue'
import version from '@/version.json'
import { useAtviseStore } from '~/stores/atvise'
import { useAuthStore } from '~/stores/auth'

const runtimeConfig = useRuntimeConfig()
const nuxtApp = useNuxtApp()
const router = useRouter()
const route = useRoute()
const display = useDisplay()
const theme = useTheme()
const atviseStore = useAtviseStore()
const authStore = useAuthStore()
const { loggedIn, userData } = storeToRefs(atviseStore)
const { currentUser } = storeToRefs(authStore)

const isLocal = computed(() => Boolean(get(runtimeConfig, 'public.atvise.local')))
const isLoggedIn = computed(() => Boolean(loggedIn.value))
const defaultDisplay = computed(() => userData.value?.defaultdisplay)
const displaySettings = computed(() => {
  const displayQuery = route.query.display
  return displayQuery ? displayQuery.toString().split('/').join('.') : ''
})

const config = ref<Record<string, any>>({})
const navigationDrawer = ref<Record<string, any>>({ width: 300, color: undefined, dark: undefined })
const appBar = ref<Record<string, any>>({ color: undefined, dark: undefined })
const drawer = ref(true)
const defaultBase = ref('')
const iframePath = ref('')
const zoom = ref(1)
const hideAlarmDrawer = ref(false)
const appCr = ref('')
const appVers = ref('')
const appName = ref('')
let eventBus: Emitter<Record<string, any>> | undefined
const openDisplayHandler = (data: any) => {
  router.push({ query: data.query, replace: false })
}
const resizeListener = (event: UIEvent) => {
  setTimeout(() => resize(event), 5)
}
const keyListener = (event: KeyboardEvent) => {
  if (event.altKey && event.shiftKey && event.ctrlKey && event.key.toLowerCase() === 'h') {
    router.push({ query: { display: 'AGENT.DISPLAYS.Main', base: 'AGENT.OBJECTS' }, replace: false })
  }
}

const lgAndUp = computed(() => display.lgAndUp.value)
const mdAndUp = computed(() => display.mdAndUp.value)
const smAndDown = computed(() => display.smAndDown.value)

const lodashGet = get

if (process.client) {
  watch(defaultDisplay, (value) => {
    if (!value) { return }
    setTimeout(() => {
      router.push(value as string)
    }, 100)
  })

  watch(isLoggedIn, async (value) => {
    if (!value) { return }
    setTimeout(() => {
      navigateToDefaultPage()
      resize()
    }, 1000)
    const loading = (nuxtApp as any).$loading
    if (loading?.finish) {
      loading.finish()
    }
    await nextTick()
    navigateToDefaultPage()
  })
}

const isDark = ref(false)
watch(isDark, (value) => {
  theme.global.name.value = value ? 'dark' : 'light'
}, { immediate: true })

if (process.client) {
  watch(() => route.fullPath, () => {
    setTimeout(() => resize(), 500)
  })
}

function resize (_event?: UIEvent) {
  if (!process.client) { return }
  const wrap = document.querySelector<HTMLDivElement>('div.v-main__wrap')
  if (!wrap) { return }
  wrap.style.overflow = 'hidden'
  const width = wrap.offsetWidth
  const height = wrap.offsetHeight
  const main = document.querySelector<HTMLElement>('#mainContainer')
  if (!main) { return }
  const widthZoom = width / main.offsetWidth
  const heightZoom = height / main.offsetHeight
  const nextZoom = widthZoom < heightZoom ? widthZoom : heightZoom
  main.style.zoom = `${nextZoom}`
  if (widthZoom < heightZoom) {
    main.style.left = '0px'
  } else {
    const offset = (width - (main.offsetWidth * nextZoom)) / 2 / nextZoom
    main.style.left = `${offset}px`
  }
}

function bootIntercom (appId?: string) {
  const user = currentUser.value
  if (!user) { return }
  const userName = user.given_name !== undefined ? `${user.given_name} ${user.family_name}` : user.name
  const intercom = (nuxtApp as any).$intercom
  intercom?.('boot', {
    app_id: appId || 'jktwl0q2',
    name: userName,
    email: user.email
  })
}

function zoomIn () {
  if (route.query.iframe === 'visu') {
    zoom.value += 0.1
  }
  const webMI = typeof top !== 'undefined' ? (top as any).webMI : undefined
  webMI?.trigger?.fire?.('com.atvise.zoomIn_content')
}

function zoomOut () {
  if (route.query.iframe === 'visu') {
    zoom.value -= 0.1
  }
  const webMI = typeof top !== 'undefined' ? (top as any).webMI : undefined
  webMI?.trigger?.fire?.('com.atvise.zoomOut_content')
}

function zoomAll () {
  if (route.query.iframe === 'visu') {
    zoom.value = 1
  }
  const webMI = typeof top !== 'undefined' ? (top as any).webMI : undefined
  webMI?.trigger?.fire?.('com.atvise.zoom11_content')
}

function navigateToDefaultPage () {
  if (route.query.display) {
    return
  }
  const userDefaultDisplay = lodashGet(atviseStore.userData, 'defaultdisplay')
  const configHome = lodashGet(config.value, 'home', {})
  const displayValue = userDefaultDisplay || configHome.display
  const base = lodashGet(atviseStore.userData, 'additionalInfo.defaultBase', configHome.base)
  const query: Record<string, any> = {
    base,
    display: displayValue
  }
  if (typeof top !== 'undefined') {
    const frame = lodashGet((top as any).webMIConfig, 'nuxt.home.frame')
    if (frame) {
      query.iframe = frame
    }
  }
  router.push({ query })
}

onMounted(() => {
  if (!process.client) { return }
  if (typeof window !== 'undefined') {
    config.value = lodashGet(window, 'webMIConfig.nuxt', {})
  }
  navigationDrawer.value = { ...navigationDrawer.value, ...config.value.navigationDrawer }
  appBar.value = { ...appBar.value, ...config.value.appBar }
  isDark.value = Boolean(config.value.defaultDark)
  defaultBase.value = config.value.defaultBase || ''
  hideAlarmDrawer.value = Boolean(lodashGet(config.value, 'alarmDrawer.disable', false))
  iframePath.value = ''

  setTimeout(() => {
    resize()
  }, 2000)

  setTimeout(() => {
    if (!isLocal.value) {
      const loading = (nuxtApp as any).$loading
      loading?.start?.()
    }
  }, 100)

  window.addEventListener('resize', resizeListener)
  window.addEventListener('keydown', keyListener)

  eventBus = (nuxtApp.vueApp.config.globalProperties as any)?.$eventBus as Emitter<Record<string, any>> | undefined
  eventBus?.on?.('openDisplay', openDisplayHandler)

  appCr.value = lodashGet(runtimeConfig, 'public.app_meta.cr', '')
  appVers.value = (version as any).vers
  appName.value = (version as any).release_name

  const webMI = typeof top !== 'undefined' ? (top as any).webMI : undefined
  webMI?.trigger?.connect?.('setContentType', (data: any) => {
    window.setTimeout(() => {
      const query = JSON.parse(JSON.stringify(route.query))
      if (query.iframe === data.value.type) {
        return
      }
      query.iframe = data.value.type
      router.replace({ query, hash: '#123' })
    }, 50)
  })
  webMI?.trigger?.connect?.('openDisplay', (data: any) => {
    router.push({ query: data.value.query, replace: false })
  })

  navigateToDefaultPage()
  const intercomEnable = Boolean(lodashGet(config.value, 'intercom.enable', false))
  const intercomAppId = lodashGet(config.value, 'intercom.appId')
  if (intercomEnable) {
    bootIntercom(intercomAppId)
  }
})

onBeforeUnmount(() => {
  if (!process.client) { return }
  window.removeEventListener('resize', resizeListener)
  window.removeEventListener('keydown', keyListener)
  eventBus?.off?.('openDisplay', openDisplayHandler)
})
</script>

<style scoped>
.v-breadcrumbs::-webkit-scrollbar {
  display: none;
}

.v-application {
  font-family: system-ui !important;
}

.v-navigation-drawer--rail .app-footer {
  background-color: transparent;
}

.v-navigation-drawer--rail .app-footer .app_cr,
.v-navigation-drawer--rail .app-footer .app_name {
  display: none;
}

.v-navigation-drawer--rail .app-footer .app_vers {
  position: relative;
  right: -55px;
  width: 160px;
  font-size: 12px;
  pointer-events: none;
  color: #6b6a6a;
  text-align: left;
}

.navigation-drawer--dark {
  color: white;
}

.app-bar--dark {
  color: white;
}

.app-main {
  background-color: transparent;
  min-height: 700px;
}

.main-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
