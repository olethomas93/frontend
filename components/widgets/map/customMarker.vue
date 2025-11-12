<!-- A wrapper for a leaflet-marker. it renders the
HTML between the element as a marker on the leaflet map -->

<template>
  <!-- <div class="marker-wrapper" :class="{animation:animated}" style="height:100%;width:100%;"> -->
  <div class="marker-wrapper" :class="{animation:animated}" style="" @click="$emit('click', leafMarker)">
    <slot />
  </div>
</template>
<script>
import L, { Icon } from 'leaflet'

import { findRealParent } from 'vue2-leaflet'

export default {
  props: {
    coord: {
      type: [Object, String],
      default () {
        return { lat: 69, lng: 18 }
      }
    },
    alignment: {
      type: String,
      default: 'none'
    },
    offsetX: {
      type: Number,
      default: 0
    },
    offsetY: {
      type: Number,
      default: 0
    },
    zoom: {
      type: Number,
      default: 0
    },
    draggable: {
      type: Boolean,
      default: false
    },
    zoomTreshold: {
      type: Number,
      default: 0
    },
    zoomTresholed: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      leafMarker: undefined
    }
  },
  watch: {
    alignment (alignment) {
      this.computeAlignment(alignment)
    },
    coord () {
      this.init()
      // this.leafMarker.setLatLng([this.coord.lat, this.coord.lng])
    },
    zoom (zoom) {
      this.computeAlignment(this.alignment)
      if (zoom <= this.zoomTreshold) {
        findRealParent(this.$parent).mapObject.removeLayer(this.leafMarker)
      } else {
        this.leafMarker.addTo(findRealParent(this.$parent).mapObject)

        this.computeAlignment(this.alignment)
      }
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    findRealParent(this.$parent).mapObject.removeLayer(this.leafMarker)
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
    async init () {
      let coord = this.coord
      if (typeof this.coord === 'string') {
        coord = await this.getPosition(this.coord)
      }
      this.leafMarker = L.marker([coord.lat, coord.lng], {
        icon: new CustomMarker({ html: this.$el }),
        draggable: this.draggable
      })
      if (!this.zoomTresholed) {
        this.leafMarker.addTo(findRealParent(this.$parent).mapObject)
        this.computeAlignment(this.alignment)
      }
    },
    computeAlignment (alignment) {
      const div = this.$el
      let x = 0
      let y = 0
      switch (alignment) {
        case 'none':

          break
        case 'top':
          y -= div.offsetHeight
          x -= div.offsetHeight / 2
          break
        case 'bottom':
          x = x - div.offsetWidth / 2
          break
        case 'left':
          x = x - div.offsetWidth
          y = y - div.offsetHeight / 2
          break
        case 'right':
          y = y - div.offsetHeight / 2
          break
        case 'center':
          x -= div.offsetWidth / 2
          y -= div.offsetHeight / 2
          break
        case 'topleft':
          x = -div.offsetWidth
          y = -div.offsetHeight
          break
        case 'topright':
          y = y - div.offsetHeight
          break
        case 'bottomleft':
          x = x - div.offsetWidth
          break
        case 'bottomright':
          break
        default:
          throw new Error('Invalid alignment type of custom marker!')
      }
      div.style.left = x + this.offsetX + 'px'
      div.style.top = y + this.offsetY + 'px'
    }
  }
}
export const CustomMarker = Icon.extend({
  options: {
    className: 'removed'
  },
  createIcon () {
    const div = document.createElement('div')
    div.className = 'removed'
    div.appendChild(this.options.html)
    return div
  }
})
</script>
<style scoped>
.marker-wrapper {
  position: absolute;
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
