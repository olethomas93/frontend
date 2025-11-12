import EventEmitter from 'events'
import colors from 'vuetify/es5/util/colors.js'
import dotenv from 'dotenv'
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'

// Init
dotenv.config()
const development = process.env.NODE_ENV === 'development'
const remote = true // process.env.REMOTE === 'true' || false
const local = !remote
// To avoid Possible EventEmitter memory leak detected warnings
EventEmitter.defaultMaxListeners = 20
// Define
const config = {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  // Target: https://go.nuxtjs.dev/config-target
  // target: 'server',
  // https://git.io/nuxt-telemetry
  // telemetry: false,
  logo_path: process.env.LOGO_PATH,
  server: {
    host: process.env.IP,
    port: process.env.PORT
  },
  head: {
    // title: process.env.TITLE1,
    // titleTemplate: `%s - ${process.env.TITLE2}`, // '%s - Atvise',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      // { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logos/favicon.ico' }
      // { rel: 'stylesheet', href: '/style.css' }
    ],
    script: [
      {
        src: 'webmicfg.js'
      },
      {
        id: 'projectjs',
        src: 'project.js'
      },
      {
        src: 'webmi.js',
        body: false
      },
      {
        src: 'atviseStuff.js'
      },
      {
        src: 'atviseStuff2.js'
      }
      // {
      //   src: 'scada-flow.js'
      // }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  // loading: { color: '#fff' },
  // loading: '@/components/loading.vue',
  // loadingIndicator: {
  //   name: '@/assets/jmh-loading-indicator.html',
  //   color: 'white',
  //   background: '#00a3e0'
  // },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/main.css',
    './node_modules/@mdi/font/css/materialdesignicons.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/vueStuff'
    },
    {
      src: '~/plugins/vue-grid-layout'
    },
    {
      src: '~/plugins/vue-plotly'
    },
    {
      src: '~/plugins/eventBus'
    },
    {
      src: '~/plugins/browse'
    },
    {
      src: '~/plugins/atvise'
    },
    {
      src: '~/plugins/translate'
    },
    {
      src: '~/plugins/sfcLoader'
    },
    {
      src: '~/plugins/vuedraggable',
      mode: 'client'
    }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://auth.nuxtjs.org/
    '@nuxtjs/auth-next',
    // Doc: https://nuxtjs.org/faq/http-proxy/
    // '@nuxtjs/proxy',
    'nuxt-leaflet',
    ['nuxt-moment', {
      defaultLocale: 'nb',
      locales: ['nb']
    }],
    'nuxt-intercom'
  ],
  intercom: {
    appId: 'jktwl0q2',
    // disabled: process.env.INTERCOM !== 'true',
    hideDefaultLauncher: true
  },
  /*
   *  Auth module configuration
   */
  auth: {
    redirect: {
      login: '/login', // redirect user when not connected
      callback: '/callback'
      // home: '/'
    },
    strategies: {
      auth0: {
        // domain: process.env.AUTH0_DOMAIN,
        scheme: '~/schemes/auth0_rt.js'
      },
      atviseLocal: {
        scheme: '~/schemes/atviseLocal.js'
      },
      aad: {
        scheme: '~/schemes/aad_rt.js'
      }
    }
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // customVariables: ['~/assets/variables.scss'], // Fungerer bare hvis treeShake er true
    treeShake: false,
    defaultAssets: {
      font: false,
      icons: 'mdiSvg'
    },
    theme: {
      options: {
        customProperties: true
      },
      dark: false,
      themes: {
        dark: {
          // primary: '#ff8000',
          primary: '#00a3e0',
          accent: '#282828',
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: '#ffc72c',
          error: '#ff671f',
          success: '#26d07c',
          critical: '#bca0dc',
          background: '#999999',
          card: '#ff00ff'
        },
        light: {
          // primary: '#ff8000',
          primary: '#00a3e0',
          accent: '#282828',
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: '#ffc72c',
          error: '#ff671f',
          success: '#26d07c',
          critical: '#bca0dc',
          background: '#999999',
          card: '#00ff00'
        }
      }
    }
  },
  publicRuntimeConfig: {
    atvise: {
      login: process.env.LOGIN,
      local,
      enableStdVisu: false
    },
    app_meta: {
      title1: process.env.TITLE1 || 'unknown',
      title2: process.env.TITLE2 || 'unknown',
      cr: process.env.CR || 'unknown',
      logo_url: process.env.LOGO_PATH
    },
    // https://github.com/nuxt-community/auth-module/issues/713
    auth: {
      strategies: {
        auth0: {
          domain: process.env.AUTH0_DOMAIN,
          clientId: process.env.AUTH0_CLIENT_ID,
          audience: process.env.AUTH0_AUDIENCE,
          responseType: 'code',
          scope: 'openid profile email',
          logoutRedirectUri: process.env.LOG_OUT_URL,
          grantType: 'authorization_code',
          useRefreshTokens: true,
          // endpoints normally not needed, auth0 module will populate this with the domain property. But since we are configuring auth after build this is needed.
          endpoints: {
            authorization: `https://${process.env.AUTH0_DOMAIN}/authorize`,
            userInfo: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
            token: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
            logout: `https://${process.env.AUTH0_DOMAIN}/v2/logout`
          }
        },
        aad: {
          endpoints: {
            configuration: 'https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration',
            logout: '/'
          },
          token: {
            property: 'access_token',
            type: 'Bearer',
            maxAge: 1800
          },
          refreshToken: {
            property: 'refresh_token',
            maxAge: 60 * 60 * 24 * 30
          },
          idToken: {
            property: 'id_token',
            maxAge: 1800,
            prefix: '_id_token.',
            expirationPrefix: '_id_token_expiration.'
          },
          responseType: 'code',
          grantType: 'authorization_code',
          clientId: process.env.AAD_CLIENT_ID,
          codeChallengeMethod: 'S256',
          scope: ['openid', 'profile', 'email', 'offline_access'],
          autoLogout: false
        }
      }
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['json', 'typescript', 'javascript', 'css', 'html']
        // features: ['contextmenu', 'folding', 'colorDetector', 'clipboard', 'codeAction']
      })
    ],
    extend (config, ctx) {
      // const path = require('path')
      // config.resolve.alias.vscode = path.resolve(
      //   './node_modules/monaco-languageclient/lib/vscode-compatibility'
      // )
      // https://github.com/nuxt/nuxt.js/issue0.13242
      // Må ha denne for at man kan compilere widgets fra atvise
      config.resolve.alias.vue = 'vue/dist/vue.common'
      // Init dev with chrome extention in visual studio code
      // https://vuejs.org/v2/cookbook/debugging-in-vscode.html
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  }
}

// Only use proxy if we are in development
if (development) {
  config.modules.push('@nuxtjs/proxy')
  config.proxy = {
    '/customScripts': {
      target: process.env.ATVISE_PROXY
    },
    '/vueComponents': {
      target: process.env.ATVISE_PROXY
    },
    '/highcharts': {
      target: process.env.ATVISE_PROXY
    },
    '/webMI': {
      target: process.env.ATVISE_PROXY
    },
    '/other': {
      target: process.env.ATVISE_PROXY
    },
    '/jquery': {
      target: process.env.ATVISE_PROXY
    },
    '/slickgrid': {
      target: process.env.ATVISE_PROXY
    },
    '/webmi.js': {
      target: process.env.ATVISE_PROXY
    },
    '/webmicfg.js': {
      target: process.env.ATVISE_PROXY
    },
    '/project.js': {
      target: process.env.ATVISE_PROXY
    },
    '/nb': {
      target: process.env.ATVISE_PROXY
    },
    '/en': {
      target: process.env.ATVISE_PROXY
    }
  }
}

if (local) {
  config.router = {
    mode: 'hash'
  }
  config.target = 'static'
} else {
  config.router = {
    middleware: ['auth']
  }
}

export default config
