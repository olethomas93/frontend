<template>
  <v-app ref="test1" :style="{backgroundColor: !loggedIn ? 'grey' : 'white'}">
    <template v-if="!loggedIn && local">
      <snackbar />
      <login />
    </template>
    <!-- <template v-if="loggedIn === false && local === false">
      <loading />
    </template> -->
    <template v-else-if="loggedIn">
      <v-navigation-drawer
        v-if="!$lodash.get(navigationDrawer, 'disable', false)"
        v-model="drawer"
        :mini-variant="$vuetify.breakpoint.lgAndUp"
        :clipped="true"
        :fixed="true"
        :expand-on-hover="$vuetify.breakpoint.lgAndUp"
        :temporary="false"
        app
        :dark="navigationDrawer.dark"
        :light="!navigationDrawer.dark === false || undefined"
        :color="navigationDrawer.color"
        :width="navigationDrawer.width"
      >
        <template #prepend>
          <user-info />
        </template>
        <v-divider />
        <nav-list style="height:80%" />
        <template #append>
          <v-footer
            padless
            style="color: grey; font-size: 12px"
          >
            <v-col
              class="text-center"
              cols="12"
            >
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
      <!-- WIP -->
      <alarm-drawer v-if="$vuetify.breakpoint.mdAndUp && !hideAlarmDrawer" />
      <v-app-bar
        clipped-left
        :clipped-right="true"
        fixed
        app
        :dark="appBar.dark"
        :light="!appBar.dark === false || undefined"
        :color="appBar.color"
        _prominent="$vuetify.breakpoint.smAndDown"
      >
        <template v-if="$lodash.get(appBar, 'logo.position') === 'left' && $vuetify.breakpoint.mdAndUp">
          <v-img max-width="180" :src="$lodash.get(appBar, 'logo.src', 'logo.png')" style="margin-right:24px;" />
          <v-divider vertical inset />
        </template>
        <v-app-bar-nav-icon v-if="!$lodash.get(navigationDrawer, 'disable', false)" @click.stop="drawer = !drawer" />
        <crumbs style="flex-wrap:nowrap;overflow:scroll;" :default-base="defaultBase" :iframe-path="iframePath" />
        <v-spacer />
        <server-time v-if="$lodash.get(appBar, 'time.show', false) === true && $vuetify.breakpoint.mdAndUp" />
        <template v-if="$lodash.get(appBar, 'logo.position') === 'right' && $vuetify.breakpoint.mdAndUp">
          <v-img max-width="180" :src="$lodash.get(appBar, 'logo.src', 'logo.png')" style="margin-right:0px;" />
          <v-divider vertical inset />
        </template>
        <v-item-group v-if="$lodash.get(appBar, 'zoom.show',false) && $vuetify.breakpoint.mdAndUp">
          <v-tooltip bottom open-delay="500">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="zoomIn">
                <v-icon>mdi-magnify-plus</v-icon>
              </v-btn>
            </template>
            <span>Zoom in</span>
          </v-tooltip>
          <v-tooltip bottom open-delay="500">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="zoomOut">
                <v-icon>mdi-magnify-minus</v-icon>
              </v-btn>
            </template>
            <span>Zoom out</span>
          </v-tooltip>
          <v-tooltip bottom open-delay="500">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="zoomAll">
                <v-icon>mdi-magnify-scan</v-icon>
              </v-btn>
            </template>
            <span>Zoom all</span>
          </v-tooltip>
        </v-item-group>
        <!-- <div
          v-if="$vuetify.breakpoint.lgAndUp"
          class="caption intercom_launcher"
          style="cursor:pointer;"
          @click="$intercom('show')"
        >
          Brukerstøtte
        </div>
        <v-img v-if="$vuetify.breakpoint.lgAndUp" :src="$config.app_meta.logo_url" alt="fd" max-width="180" /> -->
        <main-alarm v-if="$vuetify.breakpoint.smAndDown || hideAlarmDrawer" base="AGENT.OBJECTS" style="margin:0 14px;" />
        <app-bar-menu>
          <template v-if="$lodash.get(navigationDrawer, 'disable', false)" #user>
            <user-info />
          </template>
        </app-bar-menu>
      </v-app-bar>
      <v-main style="background-color:transparent;height:700px">
        <atvise-dialog :dialog="true" />
        <snackbar />
        <!-- <div v-show="!$route.query.iframe" id="mainContainer" ref="mainContainer" class="mainContainerDefaultStyle">
          <iframe
            id="mainframe"
            ref="mainframe"
            style="position:absolute;top:0px;left:0;height:100%;width:100%;scroll"
            name="mainframe"
            _src="about:blank"
            frameborder="0"
            _load="load"
          />
          <div id="foreignobjects" style="position:absolute;top:0px;left:0;" @wheel.prevent="wheelEvent" />
          <div id="extensions" style="position:absolute;top:0px;left:500px" :style="{top:extensionsTopOffset}" />
          <div v-if="false" id="loadingscreen" />
          <div v-if="false" id="errorscreen">
            <div id="erroroverlay">
            &nbsp;
            </div><div id="errormessage">
              <div id="errorbox">
                <div><span id="errorrow1">A <b>connection error</b> may have occurred.</span><span id="errorrow2">Please <b>refresh</b> your browser or <a href="#" onclick="window.location.reload()">click here</a>.</span></div>
              </div>
            </div>
          </div>
        </div>
        <atvise-visu-v3 v-if="$route.query.iframe === 'visu'" :style="{zoom: zoom}" :settings="display" /> -->
        <atvise-visu-v3 :style="{zoom: zoom}" :settings="display" />
      </v-main>
    </template>
    <offline />
  </v-app>
</template>

<script>
import MainAlarm from '~/components/common/alarm/mainAlarm.vue'
import AlarmDrawer from '~/components/common/alarm/drawer.vue'
import crumbs from '@/components/crumbs.vue'
import userInfo from '@/components/userInfo.vue'
import AtviseDialog from '~/components/atvise/atviseDialog.vue'
import offline from '~/components/dialogOffline'
import login from '~/components/login'
import navList from '@/components/navList.vue'
import appBarMenu from '@/components/appBarMenu.vue'
// import serverTime from '@/components/serverTime.vue'
import version from '@/version.json'
// import loading from '@/components/loading.vue'

export default {
  name: 'LayoutsDefault',
  components: {
    MainAlarm,
    AlarmDrawer,
    crumbs,
    userInfo,
    AtviseDialog,
    offline,
    login,
    navList,
    appBarMenu
    // serverTime
  },
  data () {
    return {
      showBottomDrawer: true,
      test: 1,
      home: undefined,
      drawer: true,
      defaultBase: '',
      dataTable: true,
      dataTableBase: 'Views.Hjem',
      treeBase: 'AGENT.OBJECTS',
      base1: 'Views.Hjem',
      items: [
      ],
      miniVariant: false,
      extensionsTopOffset: '-0px',
      contentFrame: undefined,
      config: {},
      isDark: false,
      treeViewTypes: [],
      treeViewSubtype: false,
      navigationDrawer: {
        width: 300,
        color: undefined,
        dark: undefined
      },
      appBar: {
        color: undefined,
        dark: undefined
      },
      iframePath: '',
      snackbar: false,
      zoom: 1,
      hideAlarmDrawer: false
    }
  },
  head () {
    return {
      title: this.$config.app_meta.title1 + '-' + this.$config.app_meta.title2
    }
  },
  computed: {
    local () {
      return this.$config.atvise.local
    },
    loggedIn () {
      // return this.$store.state.auth.loggedIn
      return this.$store.state.atvise.loggedIn
    },
    defaultDisplay () {
      return this.$store.state.atvise.userData.defaultdisplay
    },
    display () {
      if (this.$route.query.display) {
        return this.$route.query.display.split('/').join('.')
      } else {
        return ''
      }
    }
  },
  watch: {
    defaultDisplay (val) {
      setTimeout(() => {
        this.$router.push(val)
      }, 100)
    },
    loggedIn (val) {
      if (val === true) {
        setTimeout(() => {
          this.navigateToDefaultPage()
          this.resize()
        }
        , 1000)
        this.$nuxt.$loading.finish()
        this.navigateToDefaultPage()
      }
    },
    isDark: {
      immediate: true,
      handler (value) {
        this.$vuetify.theme.dark = value
      }
    },
    $route (val) {
      // this.iframePath = val.query.base
      // const display = val.query.display
      // const base = val.query.base
      // top.webMI.display.openDisplay(display, { query: { base } }, this.$refs.mainframe.contentWindow)
      setTimeout(() => {
        this.resize()
      }, 500)
    }
  },
  mounted () {
    this.config = window.webMIConfig.nuxt || {}
    this.navigationDrawer = this.config.navigationDrawer
    this.appBar = this.config.appBar
    // this.$vuetify.theme.dark = this.config.defaultDark
    this.isDark = this.config.defaultDark
    this.defaultBase = this.config.defaultBase
    this.dataTableBase = this.defaultBase
    this.treeBase = this.defaultBase
    this.hideAlarmDrawer = this.$lodash.get(this.config, 'alarmDrawer.disable', false)
    this.navigationDrawerWidth = this.$lodash.get(this.config, 'navigationDrawer.width', 300)

    setTimeout(() => {
      this.resize()
    }, 2000)

    // TODO: Fix this (Ugly but works)
    setTimeout(() => {
      this.$vuetify.theme.dark = this.config.defaultDark
      if (!this.local) {
        this.$nuxt.$loading.start()
      }
    }, 100)
    window.addEventListener('resize', (data) => {
      setTimeout(() => {
        this.resize(data)
      }, 5)
    })

    // Listen for home key on advantech displays
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.shiftKey && e.ctrlKey && e.keyCode === 72) {
        this.$router.push({ query: { display: 'AGENT.DISPLAYS.Main', base: 'AGENT.OBJECTS' }, replace: false })
        // top.webMI.display.openDisplay('AGENT.DISPLAYS.Main', { base: 'AGENT.OBJECTS' })
      }
    })

    // Version
    this.appCr = this.$config.app_meta.cr
    this.appVers = version.vers
    this.appName = version.release_name

    // if (this.local) {
    top.webMI.trigger.connect('setContentType', (data) => {
      setTimeout(() => {
        const query = JSON.parse(JSON.stringify(this.$route.query))
        if (query.iframe === data.value.type) {
          // Noting to do, return
          // console.log('***********************************************************************************')
          return
        }
        query.iframe = data.value.type
        const hash = '123'
        // this.$router.push({ hash: '123', query: { iframe: query.iframe, base: query.base, display: query.display }, replace: false })
        this.$router.replace({ query, hash })
      }, 50)
    })
    top.webMI.trigger.connect('openDisplay', (data) => {
      console.log('openDisplay', data)
      this.$router.push({ query: data.value.query, replace: false })
    })
    this.$nuxt.$on('openDisplay', (data) => {
      console.log('openDisplay', data)
      this.$router.push({ query: data.query, replace: false })
    })
    // }

    // Navigate to default page, set in webmicfg.js
    this.navigateToDefaultPage()
    const intercomEnable = this.$lodash.get(this.config, 'intercom.enable', false)
    const intercomAppId = this.$lodash.get(this.config, 'intercom.appId')
    if (intercomEnable) {
      this.bootIntercom(intercomAppId)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', (data) => {
    })
  },
  methods: {
    bootIntercom (appId) {
      const user = this.$store.state.auth.user
      const userName = user.given_name !== undefined ? `${user.given_name} ${user.family_name}` : user.name
      this.$intercom('boot', {
        app_id: appId || 'jktwl0q2',
        name: userName,
        email: user.email
      })
    },
    reloadPage () {
      top.location.reload()
    },
    logout () {
      top.webMI.data.logout()
    },
    zoomIn () {
      if (this.$route.query.iframe === 'visu') {
        this.zoom += 0.1
      }
      top.webMI.trigger.fire('com.atvise.zoomIn_content')
    },
    zoomOut () {
      if (this.$route.query.iframe === 'visu') {
        this.zoom -= 0.1
      }
      top.webMI.trigger.fire('com.atvise.zoomOut_content')
    },
    zoomRect () {
      top.webMI.trigger.fire('com.atvise.zoomRect_content')
    },
    zoomAll () {
      if (this.$route.query.iframe === 'visu') {
        this.zoom = 1
      }
      top.webMI.trigger.fire('com.atvise.zoom11_content')
    },
    wheelEvent (data) {
      if (data.deltaY < 0) {
        this.zoomIn()
      } else {
        this.zoomOut()
      }
      // console.log(data)
    },
    navigateToDefaultPage () {
      if (this.$route.query.display) {
        //
      } else {
        const display = this.$lodash.get(this.$store.state.atvise, 'userData.defaultdisplay') || this.config.home.display
        const base = this.$lodash.get(this.$store.state.atvise, 'userData.additionalInfo.defaultBase', this.config.home.base)
        let iframe
        if (top.webMIConfig.nuxt.home.frame) {
          iframe = top.webMIConfig.nuxt.home.frame || 'content'
        }
        // const iframe = top.webMIConfig.nuxt.defaultView || 'content'
        this.$router.push({ query: { base, display, iframe } })
      }
    },
    showDataTable (val) {
      // const typeDefinition = val[0].typeDefinition
      this.dataTable = true
      this.dataTableBase = val.nodeid
      this.$router.push(`/datatable?base=${val.nodeid}`)
    },
    // itemRowBackground (item) {
    //   return 'red'
    // },
    resize (data) {
      // Get available space on screen
      const mainWrap = document.querySelector('div.v-main__wrap')
      mainWrap.style.overflow = 'hidden'
      const width = mainWrap.offsetWidth
      const height = mainWrap.offsetHeight
      // Calculate zoom to fit in available space
      const main = this.$refs.mainContainer
      if (main) {
        const widthZoom = (width) / main.offsetWidth
        const heightZoom = (height) / main.offsetHeight
        const zoom = widthZoom < heightZoom ? widthZoom : heightZoom
        main.style.zoom = zoom
        // top.webMI.trigger.connect('getZoom', function () {
        //   top.webMI.trigger.fire('zoomChanged', zoom)
        // })
        // top.webMI.trigger.fire('zoomChanged', zoom)
        if (widthZoom < heightZoom) {
          main.style.left = '0px'
        } else {
          // Ikke spør, bare funker
          main.style.left = ((width - (main.offsetWidth * zoom)) / 2) / zoom + 'px'
        }
      }
      // this.extensionsTopOffset = -110 // `-${100 * zoom}px`
    },
    load (data) {
      this.contentFrame = document.querySelector('iframe[framename="content"]')
      if (this.contentFrame) {
        this.contentFrame.addEventListener('load', () => {
          // this.iframePath = this.contentFrame.contentWindow.location.href
        })
      }
    }
  },
  ready () {
    window.addEventListener('resize', (data) => {
      this.log(data)
    })
  }
}
</script>

<style>
.v-breadcrumbs::-webkit-scrollbar {
    display: none;
}

.v-application{

font-family: system-ui !important;
}

.theme--dark.v-application {
  background-color: var(--v-background-base, #121212) !important;
}
.theme--light.v-application {
  background-color: var(--v-background-base, white) !important;
}
.v-navigation-drawer--mini-variant .v-footer{
  background-color: transparent;
}
/* Fixed version style on closed */
.v-navigation-drawer--mini-variant .v-footer .app_cr{
  display: none;
}
.v-navigation-drawer--mini-variant .v-footer .app_name{
  display: none;
}
.v-navigation-drawer--mini-variant .v-footer .app_vers{
  position: relative;
  right: -55px;
  width: 160px;
  font-size: 12px;
  pointer-events: none;
  color: #6b6a6a;
  text-align: left;
}
/* Fix alarm icon fix closed manu bar */
/* .v-navigation-drawer--mini-variant .v-badge__badge{
  position: static!important;
  opacity: 0.8;
} */
</style>
