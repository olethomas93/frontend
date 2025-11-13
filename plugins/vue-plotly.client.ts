import { defineNuxtPlugin } from '#app'
import VuePlotly from 'vue-plotly'

const PlotlyComponent = (VuePlotly as any).Plotly || VuePlotly

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Plotly', PlotlyComponent)
})
