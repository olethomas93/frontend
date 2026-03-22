import { defineNuxtPlugin } from '#app'
import { LMap, LTileLayer, LMarker, LPopup, LTooltip, LCircle, LPolygon, LPolyline } from '@vue-leaflet/vue-leaflet'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('LMap', LMap)
  nuxtApp.vueApp.component('LTileLayer', LTileLayer)
  nuxtApp.vueApp.component('LMarker', LMarker)
  nuxtApp.vueApp.component('LPopup', LPopup)
  nuxtApp.vueApp.component('LTooltip', LTooltip)
  nuxtApp.vueApp.component('LCircle', LCircle)
  nuxtApp.vueApp.component('LPolygon', LPolygon)
  nuxtApp.vueApp.component('LPolyline', LPolyline)
})
