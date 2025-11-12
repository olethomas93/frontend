import { defineNuxtPlugin } from '#app'
import mitt from 'mitt'

type Events = Record<string, unknown>

export default defineNuxtPlugin((nuxtApp) => {
  const emitter = mitt<Events>()
  const { vueApp } = nuxtApp

  vueApp.config.globalProperties.$eventBus = emitter
  vueApp.provide('eventBus', emitter)

  if (process.client) {
    const globalWindow = window as typeof window & { $nuxt?: Record<string, any> }
    globalWindow.$nuxt = globalWindow.$nuxt || {}
    globalWindow.$nuxt.$eventBus = emitter
  }
})
