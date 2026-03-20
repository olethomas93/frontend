
<template>
  <div id="map-wrap" style="height: 100%; width: 100%" class="">
    <v-btn
      v-if="showSeaMap"
      style="position: absolute;
    z-index: 7;right: 1%;"
      color="primary"
      @click="seaMap"
    >
      <h6 v-if="layerIndex == 0 || layerIndex == 2">
        Sjøkart
      </h6>
      <h6 v-else-if="layerIndex==1">
        Kart
      </h6>
    </v-btn>
    <v-speed-dial
      v-if="editable && checkAdmin()"
      v-model="fab"
      style="position: fixed; zIndex:99999;"
      bottom
      right
      direction="top"
    >
      <template #activator>
        <v-btn
          v-model="fab"
          color="blue-darken-2"
          dark
          fab
        >
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-cog
          </v-icon>
        </v-btn>
      </template>
      <v-btn
        fab
        dark
        small
        color="green"
        @click="toggleSave"
      >
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="indigo"
        @click="toggleEdit"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-speed-dial>
    <l-map
      ref="map"
      :center="center"
      :zoom="8"
      style="z-index:2;"
      @movestart="$emit('movestart')"
      @moveend="$emit('moveend')"
      @ready="onReady"
      @update:zoom="zoomUpdate"
      @update:center="centerChange"
      v-on="$listeners"
    >
      <slot name="overlay" />
      <l-tile-layer :attribution="layer.attribution" :url="layer.url" :options="{className:layer.className}">
        $test
      </l-tile-layer>
      <!-- @slot for adding vue-leaflet marker,geometry etc ---->
      <slot name="map" />
    </l-map>
  </div>
</template>
<script>
import { Map } from 'leaflet'
export default {
  components: {

  },
  inject: ['theme'],
  props: {
    showSeaMap: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      map: Map,
      urlDark:
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      urlLight: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      center: [69.057734, 18.498417],
      tileUrl: this.urlLight,
      currentZoom: 0,
      radius: 500,
      show: false,
      // layerIndex changes map layer
      layerIndex: 0,
      newVal: [],
      isDark: false,
      edit: false,
      save: false,
      fab: false,
      layers: [
        {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        },
        {
          url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=sjokartraster&zoom={z}&x={x}&y={y}',
          attribution: '© Kartverket'
        },
        {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          className: 'map-tiles'
        },
        {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          className: 'map-tiles'
        },
        {
          url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}',
          attribution: '© Kartverket',
          className: 'map-tiles2'
        }

      ]
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
      handler (value) {
        this.isDark = value
        this.setStyle(value)
      }
    }
  },
  mounted () {
    this.$refs.map.mapObject.attributionControl.setPrefix('Leaflet')
  },
  methods: {
    zoomUpdate (zoom) {
      this.currentZoom = zoom
      this.$emit('currentZoom', this.currentZoom)
    },
    centerChange (event) {
      this.$emit('center', event)
    },
    onReady (map) {
      /**
       * Emits leaflet map when ready
       */
      this.map = map
      this.$emit('mapReady', this.map)
    },
    toggleEdit () {
      this.edit = !this.edit
      this.$emit('edit', this.edit)
    },
    checkAdmin () {
      let admin = false
      if (this.$store.state.auth.user['https://jmhansen.no/jm.roles'].includes('admin')) {
        admin = true
      }
      return admin
    },
    toggleSave () {
      this.save = !this.save
      this.$emit('save', this.save)
      this.save = !this.save
      this.edit = false
      this.$emit('edit', this.edit)
    },

    setStyle (isDark) {
      this.layerIndex = isDark ? 3 : 0
    },
    seaMap () {
      if (this.layerIndex === 1) {
        this.layerIndex = this.isDark ? 3 : 0
        this.$emit('seamap', false)
      } else {
        this.$emit('seamap', true)
        this.layerIndex = 1
      }
    }
  }
}
</script>

<style>
@import "leaflet.markercluster/dist/MarkerCluster.css";
@import "leaflet.markercluster/dist/MarkerCluster.Default.css";

:root {
    --map-tiles-filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
   --map-tiles-filter2:invert(0) hue-rotate(90deg)  brightness(0.8) ;
}

.map-tiles {
        filter:var(--map-tiles-filter, none);
}
.map-tiles2 {
        filter:var(--map-tiles-filter2, none);
}

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
@media (prefers-color-scheme: dark) {
    .map-tiles {
        filter:var(--map-tiles-filter, none);
  }
}
</style>
