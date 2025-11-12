import { defineNuxtPlugin } from '#app'
import { GridLayout, GridItem } from 'vue-grid-layout'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('grid-layout', GridLayout)
  nuxtApp.vueApp.component('grid-item', GridItem)
})
