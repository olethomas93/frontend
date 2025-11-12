<template>
  <atvise-visu-v3 ref="visu" :style="{ height, width }" :query="item" :settings="visu" @mounted="setSize" />
</template>

<script>
import { customLayer } from 'leaflet-customlayer'

export default {
  props: {
    item: {
      type: Object,
      default: undefined
    },
    map: {
      type: Object,
      default: undefined
    },
    visu: {
      type: String,
      default: undefined
    },
    position: {
      type: Object,
      default: () => { return { lat: (1000 / 2) * 0.5, lng: (-1600 / 2) * 0.5 } }
      // default: () => { return { lat: 0, lng: 0 } }
    },
    edit: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 0.5
    }
  },
  data () {
    return {
      pos: undefined, // { lat: 900, lng: 500 },
      layer: undefined,
      container: undefined,
      height: 0,
      width: 0
    }
  },
  computed: {
    hasPosition () {
      return this.$lodash.get(this.item, 'childs.position')
    }
  },
  watch: {
    map () {
      console.log('map ready')
    },
    item: {
      deep: true,
      handler () {
        if (this.hasPosition) {
          this.getPosition()
        }
      }
    }
  },
  mounted () {
    this.pos = JSON.parse(JSON.stringify(this.position))
    this.init()
    if (this.hasPosition) {
      this.getPosition()
    }
    // setTimeout(() => {
    //   const svg = this.$el.querySelector('svg')
    //   this.height = svg.getAttribute('height') + 'px'
    //   this.width = svg.getAttribute('width') + 'px'
    // }, 1000)
  },
  destroyed () {
    this.layer.removeFrom(this.map)
  },
  methods: {
    setSize () {
      const svg = this.$el.querySelector('svg')
      this.height = svg.getAttribute('height') + 'px'
      this.width = svg.getAttribute('width') + 'px'
      this.$emit('mounted')
    },
    move () {
      if (this.edit) {
        this.map.dragging.disable()
        this.map.on('mousemove', (data) => {
          this.pos = { lat: data.latlng.lat, lng: data.latlng.lng }
          this.render()
        })
        this.map.on('mouseup', () => {
          this.map.dragging.enable()
          this.map.removeEventListener('mousemove')
          this.map.removeEventListener('mouseup')
          this.savePosition()
        })
      }
    },
    getPosition () {
      top.webMI.data.read(this.item.childs.position.nodeid, (data) => {
        if (!data.error) {
          this.pos = JSON.parse(data.value)
          this.layer.addTo(this.map)
          this.$emit('mounted')
        }
      })
    },
    savePosition () {
      const pos = this.pos
      console.log(this.item.childs.position.nodeid, pos)
      top.webMI.data.write(this.item.childs.position.nodeid, JSON.stringify(pos))
    },
    render (item) {
      const zoom = this.map.getZoom()
      const point = this.map.latLngToContainerPoint(this.pos)
      this.container = this.layer.getContainer()
      const child = this.container.children[0]
      if (child) {
        child.style.position = 'absolute'
        child.style.transformOrigin = 'inherit'
        const factor = Math.pow(2, zoom)
        child.style.transform = `scale(${factor * this.scale}) translate(-25px,-25px)`
        child.style.top = parseInt(point.y) + 'px'
        child.style.left = parseInt(point.x) + 'px'
      }
    },
    init () {
      // const map = this.map
      const self = this
      // eslint-disable-next-line new-cap
      this.layer = new customLayer({
        container: this.$refs.visu.$el, // document.createElement('v-btn'), // The DomElement object to display.
        minZoom: 0, // Minimum zoom level of the layer.
        maxZoom: 10, // Maximum zoom level of the layer.
        opacity: 1, // Opacity of the layer.
        visible: true, // Visible of the layer.
        zIndex: 100 // The explicit zIndex of the layer.
      })
      this.$refs.visu.$el.addEventListener('mousedown', (data) => {
        this.move()
      })

      this.$refs.visu.$el.addEventListener('click', (data) => {
        if (!this.edit) {
          this.$emit('click', this.item)
        }
      })

      this.layer.on('layer-mounted', function () {
        setTimeout(() => {
          self.render(this)
        }, 200)
      })
      this.layer.on('layer-render', function (e) {
        self.render()
      })
      if (!this.hasPosition) {
        this.layer.addTo(this.map)
      }
    }
  }
}
</script>

<style>

</style>
