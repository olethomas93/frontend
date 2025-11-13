import { defineNuxtPlugin } from '#app'
import PlotlyComponent from '~/components/common/trend/Plotly.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Plotly', PlotlyComponent)
})
