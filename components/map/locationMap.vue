<template>
  <!-- <v-content> -->
  <gmap-map
    ref="map"
    :center.sync="center"
    :zoom="zoom"
    map-type-id="roadmap"
    :style="{width:'100%',height:'100%', borderStyle: editMode ? 'solid':'none',borderWidth:'2px',borderColor:'red'}"
    :options="{
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      disableDefaultUi: false,
      maxZoom:14
    }"
    @zoom_changed="zoomChanged"
    @rightclick="zoomAll"
  >
    <div slot="visible">
      <v-btn style="position:absolute;top:16px;left:16px" @click="zoomAll">
        Vis alle
      </v-btn>
    </div>
    <!-- Satt cluster size til 200 for å deaktivere funksjon, normalt på 2 -->
    <gmap-cluster
      :zoom-on-click="true"
      :grid-size="20"
      :minimum-cluster-size="200"
      @click="clusterClick"
    >
      <location-marker
        v-for="(m, index) in locations"
        v-show="(m.active || showDeactivated)"
        :ref="'marker' + index"
        :key="index"
        :item="m"
        :draggable="editMode"
        :zoom="zoom"
        @dragend="dragEnd(m,$event)"
        @click="toggleInfoWindow(m,index)"
        @hover="toggleInfoWindow(m, index)"
        @setZoom="setZoom"
      />
    </gmap-cluster>
    <gmap-info-window
      :options="infoOptions"
      :position="infoWindowPos"
      :opened="infoWinOpen"
      @closeclick="infoWinOpen=false"
    >
      <v-btn color="success" :to="`./${infoWindowItem.id}`" append nuxt>
        Åpne lokasjon
      </v-btn>
      <v-btn color="success" @click="openAlarmDialog(infoWindowItem)">
        Vis alarmer
      </v-btn>
      <!-- <alarm-icon light :base="item.base" /> -->
    </gmap-info-window>
    <!-- <location-marker
      v-for="(m, index) in locations"
      v-show="(m.active || showDeactivated)"
      :ref="'marker' + index"
      :key="index"
      :item="m"
      :draggable="editMode"
      :zoom="zoom"
      @dragend="dragEnd(m,$event)"
      @click="toggleInfoWindow(m,index)"
      @setZoom="setZoom"
    /> -->
  </gmap-map>
  <!-- </v-content> -->
</template>

<script>
import Vue from 'vue'

// eslint-disable-next-line import/no-duplicates
import * as VueGoogleMaps from 'vue2-google-maps'

import gmapCluster from 'vue2-google-maps/dist/components/cluster.js'
// eslint-disable-next-line import/no-duplicates
import { gmapApi } from 'vue2-google-maps'

import locationMarker from './locationMarker'
import mapStyles from '@/assets/mapStyles.js'
// Vue.component(gmapCluster, VueGoogleMaps.Cluster);
import { APIservice } from '@/global/APIService.js'
// import { widget } from '@/global/mixin'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCBfOQVbNElRYjv_En2VVDI20cHJGFahJ4'
  }
})

export default {
  components: {
    // GmapCustomMarker,
    gmapCluster,
    locationMarker
    // weather: weather,
  },
  // mixins: [widget],
  // props:['base'],
  inject: ['theme'],
  data: () => ({
    zoom: 7,
    center: { lat:69.89727016997794, lng:18.48580169677734 },
    // locations: undefined,
    infoWindowPos: { lat: 0, lng: 0 },
    infoWinOpen: false,
    infoWindowItem: {},
    currentMidx: null,
    infoOptions: {
      pixelOffset: {
        width: 0,
        height: -45
      }
    },
    selected: null,
    editMode: false,
    fab: false,
    // base: null,
    showDeactivated: false,
    style: 'shadesOfGrey',
    styles: mapStyles,
    apiService: undefined, // new APIService(),
    marker: {
      lat: 69.89727016997794,
      lng: 18.48580169677734
    }
  }),
  computed: {
    google: gmapApi,
    locations () {
      const customerId = this.$route.params.customerId
      return JSON.parse(JSON.stringify(this.$store.getters.getLocations(customerId)))
    }
  },
  watch: {
    showDeactivated () {
      this.zoomAll()
    },
    'theme.isDark' (isDark) {
      this.setStyle(isDark)
    },
    locations () {
      this.zoomAll()
    }
  },
  mounted () {
    this.apiService = new APIservice(this)
    // this.getLocations()
    setTimeout(this.zoomAll, 1000)
    // this.$nextTick(this.zoomAll)
    // this.zoomAll()
    this.setStyle(this.theme.isDark)
  },
  destroyed () {},
  methods: {
    clusterClick (e) {
      // console.log('cluster click:', e)
    },
    openAlarmDialog (item) {
      this.$eventBus.$emit('alarmDialog', { cmd: 'open', filter: { search: `AGENT.OBJECTS.customers.${this.$route.params.customerId}.${item.id}`, locationFilter: [item.name] } })
      // this.$router.push({ query: { showAlarmDialog: true, alarmDialogFilter: filter } })
    },
    setStyle (isDark) {
      this.$refs.map.$mapPromise.then((map) => {
        map.setOptions({ styles: isDark ? mapStyles.shadesOfGrey : null })
        // map.setOptions({ styles: mapStyles.darkStyle })
      })
    },
    async getLocations () {
      // const self = this
      const loc = await this.apiService.getLocations()
      this.locations = loc.data
      this.zoomAll()
      // self.apiService.getLocations(this, function (data) {
      //   self.locations = data
      //   self.zoomAll()
      // })
    },
    toggleInfoWindow (marker, idx) {
      if (marker.active) {
        this.selected = JSON.parse(JSON.stringify(marker))
        this.infoWindowPos = { lat: marker.lat, lng: marker.lon }
        this.infoWindowItem = marker
        this.infoContent = marker.text
        // check if its the same marker that was selected if yes toggle
        if (this.currentMidx === idx) {
          // this.infoWinOpen = !this.infoWinOpen
          this.infoWinOpen = true
        } else {
          this.infoWinOpen = true
          this.currentMidx = idx
        }
      }
    },
    // Zoom slik at alle markers i kart vises
    zoomAll () {
      if (this.locations.length > 0) {
        const _bounds = new this.google.maps.LatLngBounds()
        // _bounds.extend(new this.google.maps.LatLng(10,20))
        for (let i = 0; i < this.locations.length; i++) {
          // if (this.locations[i].active || this.showDeactivated) {
          _bounds.extend(
            new this.google.maps.LatLng(
              this.locations[i].lat,
              this.locations[i].lon
            )
          )
          // }
        }
        this.$refs.map.$mapObject.fitBounds(_bounds)
        this.$refs.map.$mapObject.setZoom(this.zoom - 1)
      }
    },
    zoomChanged (event) {
      if (event > 20) {
        this.zoom = 12
      } else {
        this.zoom = event
      }
    },
    setZoom (event) {
      this.$refs.map.$mapObject.setZoom(event.zoom)
      this.$refs.map.$mapObject.setCenter(event.center)
    }
  }
}
</script>

<style>
</style>
