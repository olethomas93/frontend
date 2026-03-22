<template>
  <map-base @mapReady="onReady" @seamap=" seamap = $event" v-bind="$attrs" @currentZoom="zoomUpdate">
    <template #overlay>
      <slot name="overlay" />
    </template>
    <template #map>
      <slot name="map">
        <v-marker-cluster ref="clusterRef" @ready="clusterReady">
          <template v-for="(m, index) in items">
            <map-custom-marker
              v-if="$lodash.get(m, 'childs.mapMarker') && $lodash.get(m, 'childs.position')"
              :key="`marker-${index}`"
              :coord="m.childs.position.nodeid"
              :offset-x="0"
              :offset-y="0"
              :animated="false"
              alignment="center"
              :draggable="false"
              style="outline-color:#2393c0;outline-offset:5px;"
              :style="{outlineStyle: getOutline(m)}"
              @click="centerMap"
            >
              <atvise-visu-v3 style="height:50px;width:50px" :query="{ label: m.displayname}" :settings="m.childs.mapMarker.nodeid" :base="m.nodeid" @click="$emit('marker:click', m)" />
            </map-custom-marker>
            <map-custom-marker
              v-else-if="$lodash.get(m, 'childs.position')"
              :key="`standard-marker-${index}`"
              :coord="m.childs.position.nodeid"
              :offset-x="-20"
              :offset-y="-50"
              :animated="false"
            >
              <map-markerLocation :seamap="seamap" :nodeid="m.nodeid" :title="m.displayname" :connected="m.connected" @_click="$emit('click', m)" />
            </map-custom-marker>
          </template>
        </v-marker-cluster>
      </slot>
    </template>
  </map-base>
</template>
<script>
import MarkerCluster from './MarkerCluster.vue'

export default {
  components: {
    'v-marker-cluster': MarkerCluster
  },
  inject: ['theme'],
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    selected: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      center: [69.65115032865484, 19.43637298573463],
      tileUrl: this.urlLight,
      currentZoom: 5,
      radius: 500,
      show: false,
      layerIndex: 0,
      newVal: [],
      map: undefined,
      seamap: false
    }
  },
  computed: {
    layer () {
      return this.layers[this.layerIndex]
    }
  },
  watch: {
    'theme.isDark': {
      immediate: true,
      handler (isDark) {
        this.setStyle(isDark)
      }
    }
    // items: {
    //   immediate: true,
    //   async handler (val) {
    //     await Promise.all(
    //       val.map(async (item) => {
    //         if (this.$lodash.get(item, 'childs.position')) {
    //           item.childs.position.value = await this.getPosition()
    //           // top.webMI.data.read(item.childs.position.nodeid, (data) => {
    //           //   console.log(data)
    //           //    = JSON.parse(data.value)
    //           // })
    //         }
    //       })
    //     )
    //   }
    // }
  },
  updated () {
    // this.flyTobounds()
  },
  mounted () {
    setTimeout(this.flyToBounds, 700)
  },
  methods: {
    centerMap (val) {
      // console.log('center map', val)
      const latLng = val.getLatLng()
      this.map.setView(latLng, this.map.getZoom())
    },
    getOutline (item) {
      const nodeid = this.$lodash.get(item, 'nodeid')
      const selected = this.$lodash.get(this.selected, 'nodeid')
      return nodeid === selected ? 'solid' : null
    },
    async getPosition () {
      return await this.read()
    },
    read () {
      return new Promise((resolve) => {
        resolve({ lat: 71, lng: 22 })
      })
    },
    flyToBounds () {
      const bounds = this.$refs.clusterRef.mapObject.value?.getBounds()
      if (bounds) { this.map.flyToBounds(bounds, { maxZoom: 9 }) }
    },
    zoomUpdate (zoom) {
      this.currentZoom = zoom
      this.$emit('currentZoom', zoom)
    },
    clusterReady () {
      // this.flyToBounds()
    },
    onReady (map) {
      this.map = map
      // this.map.on('click', function (e) {
      //   console.log(e)
      // })
    },
    setStyle (isDark) {
      this.layerIndex = isDark ? 2 : 0
    },
    seaMap () {
      if (this.layerIndex === 1) {
        this.layerIndex = 0
      } else {
        this.layerIndex = 1
      }
    }
    // navigate (data) {
    //   const base = data.nodeid
    //   let display = data.nodeid + '.default'
    //   if (data.childs?.default) {
    //     display = data.childs.default.nodeid
    //   }
    //   this.$router.push({ query: { base, display } })
    // }
  }
}
</script>

<style>
@import "leaflet.markercluster/dist/MarkerCluster.css";
@import "leaflet.markercluster/dist/MarkerCluster.Default.css";

.blob.red {
  background: rgba(255, 82, 82, 1);
  box-shadow: 0 0 0 0 rgba(255, 82, 82, 1);
  animation: pulse-red 2s infinite;
}
@keyframes pulse-red {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
  }
}

</style>
