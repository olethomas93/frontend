<template>
  <l-map
    :key="key1"
    ref="map"
    style="z-index:2;background:transparent;"
    :center="{lat:0,lng:0}"
    :crs="crs"
    :options="{zoomControl: true}"
    @update:zoom="zoomUpdate"
    @ready="onReady"
  >
    <l-control v-if="showMapEdit" position="topright">
      <v-btn
        :color="edit ? 'warning' : 'accent' "
        :outlined="!edit"
        @click="edit = !edit"
      >
        Edit
      </v-btn>
    </l-control>
    <!-- <l-marker v-for="(item, index) in sortedItems" :key="index" :lat-lng="[Math.random() * 10, Math.random()*10]" /> -->
    <!-- <template v-if="false">
        <map-test-tank v-for="(item,key) in items" :key="key" :value="item" :map="map" :edit="edit" />
      </template> -->
    <template v-if="map">
      <div v-for="(item, index) in sortedItems" :key="index">
        <map-atvise-visu
          :key="index"
          :item="item"
          :map="map"
          :edit="edit"
          :visu="item.childs._mapWidget.nodeid"
          @mounted="refreshMap"
          @click="$emit('click', item)"
        />
      </div>
    </template>
    <map-atvise-visu v-if="map" :map="map" :visu="visu" />
  </l-map>
</template>

<script>
import { CRS } from 'leaflet'

export default {
  props: {
    items: {
      type: Array,
      default: () => { return [] }
    },
    visu: {
      type: String,
      default: 'AGENT.OBJECTS.FOU.plantegning'
    },
    showMapEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      key1: 123,
      map: undefined,
      done: false,
      edit: false,
      coord: { lat: 0, lng: 0 },
      pos: [0, 0],
      crs: CRS.Simple,
      currentZoom: 2,
      bounds: [[-26.5, -25], [1021.5, 1023]]
      // url: 'http://leafletjs.com/examples/crs-simple/uqm_map_full.png',
      // tileComponent: {
      //   name: 'tile-component',
      //   props: {
      //     coords: {
      //       type: Object,
      //       required: true
      //     }
      //   },
      //   template: '<div>Coords: {{coords.x}}, {{coords.y}}, {{coords.z}}</div>'
      // }
    }
  },
  computed: {
    sortedItems () {
      return this.items.filter((item) => { return this.$lodash.get(item, 'childs.position') })
    }
  },
  async mounted () {
  },
  methods: {
    getPos (item) {
      if (item.pos) {
        return [item.pos.lat, item.pos.lng]
      } else {
        return [10, 500]
      }
    },
    onReady (map) {
      this.map = map
      // eslint-disable-next-line new-cap, no-use-before-define
      // const pos = JSON.parse(this.fleetPos.position.value)
      // this.map.flyTo({ lat: pos.lat, lng: pos.lng }, 14)
    },
    zoomUpdate (zoom) {
      this.currentZoom = zoom
      this.$emit('zoom', this.currentZoom)
    },
    refreshMap () {
      // Used to refresh map when new objcts is loaded
      const zoom = this.$refs.map.mapObject.getZoom()
      this.$refs.map.mapObject.setZoom(zoom)
      // this.$refs.map.mapObject.zoomOut()
      // this.$refs.map.mapObject.zoomIn()
    }
  }
}
</script>

  <style>

  </style>
