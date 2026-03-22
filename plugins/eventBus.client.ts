import { defineNuxtPlugin } from '#app'
import mitt from 'mitt'

type Events = Record<string, unknown>

export default defineNuxtPlugin((nuxtApp) => {
  const emitter = mitt<Events>()

  // Vue 2 components use $on/$off/$emit — add aliases so legacy code works
  const eventBus = Object.assign(emitter, {
    $on: emitter.on.bind(emitter),
    $off: emitter.off.bind(emitter),
    $emit: emitter.emit.bind(emitter)
  })

  const { vueApp } = nuxtApp

  vueApp.config.globalProperties.$eventBus = eventBus
  vueApp.provide('eventBus', eventBus)

  if (process.client) {
    const globalWindow = window as typeof window & { $nuxt?: Record<string, any> }
    globalWindow.$nuxt = globalWindow.$nuxt || {}
    globalWindow.$nuxt.$eventBus = eventBus
  }
})
