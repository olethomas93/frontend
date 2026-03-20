import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'

let linkedomPath: string
try {
  const _req = createRequire(import.meta.url)
  const pkgDir = dirname(_req.resolve('linkedom/package.json'))
  linkedomPath = resolve(pkgDir, 'esm', 'index.js')
} catch {
  linkedomPath = 'linkedom'
}

loadEnv()

const currentDir = dirname(fileURLToPath(import.meta.url))

const development = process.env.NODE_ENV === 'development'
const devHost = process.env.IP || 'localhost'
const devPort = Number(process.env.PORT || 8656)
const remote = true
const local = !remote

const proxyTargets: Record<string, string | undefined> = {
  '/customScripts': process.env.ATVISE_PROXY,
  '/vueComponents': process.env.ATVISE_PROXY,
  '/highcharts': process.env.ATVISE_PROXY,
  '/webMI': process.env.ATVISE_PROXY,
  '/other': process.env.ATVISE_PROXY,
  '/jquery': process.env.ATVISE_PROXY,
  '/slickgrid': process.env.ATVISE_PROXY,
  '/webmi.js': process.env.ATVISE_PROXY,
  '/webmicfg.js': process.env.ATVISE_PROXY,
  '/project.js': process.env.ATVISE_PROXY,
  '/nb': process.env.ATVISE_PROXY,
  '/en': process.env.ATVISE_PROXY
}

const activeProxyEntries = Object.entries(proxyTargets).filter(([, target]) => Boolean(target)) as Array<[string, string]>

const createProxyMap = <T,>(factory: (target: string) => T) => Object.fromEntries(activeProxyEntries.map(([path, target]) => [path, factory(target)]))

const proxyOptions = (target: string) => ({
  target,
  changeOrigin: true,
  secure: false,
  ws: true
})

const nitroDevProxy = development ? createProxyMap(proxyOptions) : undefined
const viteDevProxy = development ? createProxyMap(proxyOptions) : undefined

export default defineNuxtConfig({
  ssr: false,
  devServer: {
    host: devHost,
    port: devPort
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logos/favicon.ico' }
      ],
      script: [
        { src: '/webmicfg.js' },
        { id: 'projectjs', src: '/project.js' },
        { src: '/webmi.js' },
        { src: '/atviseStuff.js' },
        { src: '/atviseStuff2.js' }
      ]
    }
  },
  css: [
    '~/assets/main.css',
    '@mdi/font/css/materialdesignicons.css'
  ],
  modules: ['@pinia/nuxt'],
  plugins: [
    '~/plugins/pinia.client',
    '~/plugins/store-bridge.client',
    '~/plugins/vuetify.client',
    '~/plugins/vueStuff.client',
    '~/plugins/vue-grid-layout.client',
    '~/plugins/plotly.client',
    '~/plugins/eventBus.client',
    '~/plugins/browse.client',
    '~/plugins/auth.client',
    '~/plugins/atvise.client',
    '~/plugins/translate.client',
    '~/plugins/sfcLoader.client',
    '~/plugins/vuedraggable.client'
  ],
  runtimeConfig: {
    // Server-only: used by server/utils/atvise.ts to proxy WebMI requests
    atviseProxy: process.env.ATVISE_PROXY,
    public: {
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
            endpoints: {
              authorization: process.env.AUTH0_DOMAIN ? `https://${process.env.AUTH0_DOMAIN}/authorize` : undefined,
              userInfo: process.env.AUTH0_DOMAIN ? `https://${process.env.AUTH0_DOMAIN}/userinfo` : undefined,
              token: process.env.AUTH0_DOMAIN ? `https://${process.env.AUTH0_DOMAIN}/oauth/token` : undefined,
              logout: process.env.AUTH0_DOMAIN ? `https://${process.env.AUTH0_DOMAIN}/v2/logout` : undefined
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
    }
  },
  nitro: {
    devProxy: nitroDevProxy,
    alias: {
      linkedom: linkedomPath
    }
  },
  experimental: {
    payloadExtraction: false
  },
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false
    },
    optimizeDeps: {
      include: ['vuetify', 'xml-js']
    },
    resolve: {
      alias: {
        'vue2-leaflet': resolve(currentDir, 'shims/vue2Leaflet.ts'),
        'stream': resolve(currentDir, 'shims/stream.ts')
      }
    },
    server: {
      hmr: {
        host: devHost,
        port: devPort
      },
      proxy: viteDevProxy || undefined
    }
  }
})
