<!-- A wrapper for a leaflet-marker. it renders the
HTML between the element as a marker on the leaflet map -->

<template>
  <!-- <div class="marker-wrapper" :class="{animation:animated}" style="height:100%;width:100%;"> -->
  <div>
    <slot />
  </div>
</template>
<script>
import L from 'leaflet'
import { findRealParent } from 'vue2-leaflet'

export default {
  data () {
    return {
      leafMarker: undefined
    }
  },
  watch: {
  },
  mounted () {
    this.init()
  },
  destroyed () {
    // findRealParent(this.$parent).mapObject.removeLayer(this.leafMarker)
  },
  methods: {
    getPosition (nodeid) {
      return new Promise((resolve) => {
        top.webMI.data.read(nodeid, (data) => {
          if (!data.error) {
            resolve(JSON.parse(data.value))
          }
        })
      })
    },
    init () {
      const latLngBounds = L.latLngBounds([[-900, 0], [1920 / 1.5, 1080 / 1.5]])
      const map = findRealParent(this.$parent).mapObject
      map.fitBounds(latLngBounds)
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      svgElement.setAttribute('viewBox', '0 0 1920 1080')
      top.webMI.data.read('AGENT.OBJECTS.FOU.plantegning', (data) => {
        console.log(data)
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(data.value, 'text/xml')
        svgElement.innerHTML = xmlDoc.querySelector('svg').innerHTML
        L.svgOverlay(svgElement, latLngBounds, {
          opacity: 1
        }).addTo(map)
        this.$emit('done')
      })
      // this.leafMarker = L.marker([coord.lat, coord.lng], {
      //   icon: new CustomMarker({ html: this.$el }),
      //   draggable: this.draggable
      // })
      // if (!this.zoomTresholed) {
      //   this.leafMarker.addTo(findRealParent(this.$parent).mapObject)
      //   this.computeAlignment(this.alignment)
      // }
    }
  }
}

</script>

<style scoped>
</style>
