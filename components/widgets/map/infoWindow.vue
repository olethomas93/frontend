<template>
  <div>
    <div ref="box" class="test" :style="{width:`${width}px`,top:`${top}px`,left:`${right ? undefined : left}px`, right:`${right}px`}">
      <slot />
    </div>
    <l-polyline :lat-lngs="path" color="grey" class-name="polyline" />
  </div>
</template>

<script>
import { findRealParent } from 'vue2-leaflet'
export default {
  components: {
  },
  // eslint-disable-next-line vue/require-prop-types
  // eslint-disable-next-line vue/prop-name-casing
  props: {
    width: {
      type: Number,
      default: 150
    },
    top: {
      type: Number,
      default: 100
    },
    left: {
      type: Number,
      default: 35
    },
    right: {
      type: Number,
      default: undefined
    },
    pointto: {
      type: Object,
      default: () => {
        return { lat: 0, lng: 0 }
      }
    }
  },
  data: () => ({
    path: []
  }),
  computed: {
  },
  watch: {
  },
  mounted () {
    // this.$parent.$on('update:zoom', () => {
    //   this.calculatePolyline()
    // })
    // this.$parent.$on('update:center', () => {
    //   console.log('center changed')
    //   this.calculatePolyline()
    // })
    findRealParent(this.$parent).mapObject.on('move', (e) => {
      this.calculatePolyline()
    })
    this.calculatePolyline()
    // this.$parent.$on('bounds_changed', () => {
    //   this.calculatePolyline()
    // })
  },
  destroyed () {
  },
  methods: {
    calculatePolyline () {
      const map = findRealParent(this.$parent).mapObject
      const box = this.$refs.box
      if (box) {
        const x = this.right ? box.offsetLeft : box.offsetWidth + box.offsetLeft
        const y = box.offsetTop + 20// (box.offsetHeight / 2)
        const latLng = this.point2LatLng({ x, y }, map)
        if (this.pointto.lat > 0) {
          this.path = [{ lat: latLng.lat, lng: latLng.lng }, this.pointto]
        } else {
          this.path = []
        }
      }
    },
    point2LatLng (point, map) {
      // console.log(map.containerPointToLatLng(point))
      // const topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast())
      // const bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest())
      // const scale = 2 ** map.getZoom()
      // // console.log(this)
      // const worldPoint = new this.$parent.$parent.google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y)
      // return map.getProjection().fromPointToLatLng(worldPoint)

      return map.containerPointToLatLng(point)
    }
  }
}
</script>

<style>
.test {
  /* top: 100px;
  left: 25px; */
  color: white;
  position: absolute;
  z-index: 401 !important;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  background-color: rgba(128, 128, 128, 0.219);
  padding: 5px;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
