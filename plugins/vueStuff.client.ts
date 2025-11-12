import { defineNuxtPlugin } from '#app'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import Lodash from 'lodash'
import * as THREE from 'three'
import VueResize from 'vue-resize'
import 'vue-resize/dist/vue-resize.css'

type WidgetModule = { default?: any }

function resolveComponentName (filePath: string): string {
  const segments = filePath.split('/')
  const fileName = segments.pop() || ''
  const parent = segments.pop() || ''
  if (parent === 'widgets') {
    return camelCase(fileName.replace(/\.\w+$/, ''))
  }
  return camelCase((parent + upperFirst(fileName)).replace(/\.\w+$/, ''))
}

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp

  vueApp.config.globalProperties.$lodash = Lodash
  vueApp.provide('lodash', Lodash)
  if (process.client) {
    const globalWindow = window as typeof window & { $nuxt?: Record<string, any> }
    globalWindow.$nuxt = globalWindow.$nuxt || {}
    globalWindow.$nuxt.$lodash = Lodash
    globalWindow.$nuxt.$three = THREE
  }

  const widgets = import.meta.glob<WidgetModule>('~/components/widgets/**/*.{vue,js}', { eager: true })
  Object.entries(widgets).forEach(([path, module]) => {
    const component = module.default || module
    if (!component) { return }
    const componentName = resolveComponentName(path)
    vueApp.component(componentName, component)
  })

  vueApp.config.globalProperties.$three = THREE
  vueApp.provide('three', THREE)

  vueApp.use(VueResize)
})
