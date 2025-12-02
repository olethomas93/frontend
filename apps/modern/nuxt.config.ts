import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: 'Atvise Modern UI',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      meta: [
        { name: 'description', content: 'Modernized Atvise web UI with Nuxt 3' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      // Path to the atvise instance or proxy; set via NUXT_PUBLIC_ATVISE_BASE_URL
      atviseBaseUrl: process.env.NUXT_PUBLIC_ATVISE_BASE_URL || 'http://localhost:8080'
    }
  },
  css: ['~/assets/main.css'],
  components: true,
  devServer: {
    host: process.env.IP || '0.0.0.0',
    port: Number(process.env.PORT) || 3000
  },
  nitro: {
    devProxy: {
      '/webmi': {
        target: process.env.NUXT_PUBLIC_ATVISE_BASE_URL || 'http://localhost:8080',
        changeOrigin: true
      },
      '/customScripts': {
        target: process.env.NUXT_PUBLIC_ATVISE_BASE_URL || 'http://localhost:8080',
        changeOrigin: true
      },
      '/vueComponents': {
        target: process.env.NUXT_PUBLIC_ATVISE_BASE_URL || 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
