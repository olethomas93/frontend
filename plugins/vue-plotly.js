import Vue from 'vue'
import { Plotly } from 'vue-plotly'

const PL = {
  install (Vue) {
    Vue.component('Plotly', Plotly)
  }
}
Vue.use(PL)
export default PL
