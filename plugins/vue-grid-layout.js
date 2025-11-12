import Vue from 'vue'
import VueGridLayout from 'vue-grid-layout'

const VueGL = {
  install (Vue) {
    Vue.component('grid-layout', VueGridLayout.GridLayout)
    Vue.component('grid-item', VueGridLayout.GridItem)
  }
}
Vue.use(VueGL)
export default VueGL
