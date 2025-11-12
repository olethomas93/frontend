<!-- A wrapper for a leaflet-marker. it renders the
HTML between the element as a marker on the leaflet map -->

<template>
  <div class="svg-wrapper" style="width:100%; height:100%;">
    <slot style="display:block;" />
  </div>
</template>
<script>
import L from 'leaflet'

import { findRealParent } from 'vue2-leaflet'

export default {
  props: {
    bounds: {
      type: Array,
      default () {
        return [[69.861456, 20.710621166574803], [69.871556, 20.7006211665748]]
      }
    }
  },
  data () {
    return {
      leafMarker: undefined
    }
  },
  watch: {
  },
  mounted () {
    const svgEl = this.getSVG(this.$el)
    this.leafMarker = L.svgOverlay(svgEl, this.bounds)

    this.leafMarker.addTo(findRealParent(this.$parent).mapObject)
  },
  destroyed () {
    findRealParent(this.$parent).mapObject.removeLayer(this.leafMarker)
  },
  methods: {
    getSVG (html) {
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      svgElement.setAttribute('viewBox', '0 0 100 100')
      const svgel = html.querySelector('SVG')
      svgElement.innerHTML = svgel.innerHTML
      return svgElement
    }

  }
}

</script>
<style scoped>
.svg-wrapper {
  position: absolute;
  display: block;
}

.animation{
  width: 100%;
position: absolute;
border-radius: 10px;
transition: all 1s;
animation: fadeIn 2s;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

#parId {
  transition: opacity 1s;
}
.removed {
  display: none;
}
</style>
