<template>
  <div style="height:100%">
    <map-general
      ref="map"
      :style="{ width: mapWidth }"
      @movestart="opacity = 0.8"
      @moveend="opacity = 1"
      @update:bounds="getFeaturesInView"
      @currentZoom="zoom = $event"
    >
      <template #map>
        <!-- <l-control position="topleft">
          <v-autocomplete
            outlined
            variant="filled"
            variant="solo"
            prepend-inner-icon="mdi-magnify"
            clearable
            :items="powerLines"
            item-title="displayname"
            item-value="nodeid"
            @keydown.stop=""
          />
        </l-control> -->
        <v-marker-cluster ref="clusterRef" @ready="clusterReady">
          <avju-map-marker
            v-for="sensor in sensors"
            :key="sensor.nodeid"
            :item="sensor"
            :selected="selected"
            @marker:click="setSelected($event)"
          />
        </v-marker-cluster>
        <avju-map-line
          v-for="line in powerLines"
          :key="line.nodeid"
          :line="line"
          :selected="selected"
          :zoom="zoom"
          @click="setSelected($event)"
        />
      </template>
    </map-general>
    <v-navigation-drawer
      ref="drawer"
      v-model="drawer"
      absolute
      right
      clipped
      style="z-index:100"
      :mini-variant.sync="drawer"
      permanent
      mini-variant-width="0"
      width="1140"
      :style="{opacity: opacity}"
    >
      <slot name="content">
        <data-table
          v-show="!selected"
          show-search
          :items="sensors"
          :headers="headers"
          :mobile-headers="mobileHeaders"
          @click:row="selected = $event"
        />
        <v-card v-if="selected">
          <v-card-title class="pa-2">
            {{ selected.displayname }}
            <v-spacer />
            <v-btn icon color="primary" @click="selected = undefined">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <!-- <v-autocomplete
            outlined
            variant="filled"
            variant="solo"
            prepend-inner-icon="mdi-magnify"
            clearable
            :items="powerLines"
            item-title="displayname"
            item-value="nodeid"
            @keydown.stop=""
          /> -->
          <!-- <v-card-text> -->
          <atvise-visu-v3 :style="{height: `${height}px`}" :base="selected.nodeid" :settings="$lodash.get(selected, 'childs.default.nodeid') || $lodash.get(selected, 'childs._default.nodeid')" />
          <!-- </v-card-text> -->
          <v-card-actions>
            <!-- <v-btn variant="outlined" color="#00bad4" @click="$nuxt.$emit('map:zoomSelected')">
              zoom
            </v-btn> -->
            <v-spacer />
            <v-btn variant="outlined" color="#00bad4" @click="sendCmd(3)">
              {{ $T('Refresh data') }}
            </v-btn>
            <v-btn variant="outlined" color="#00bad4" @click="sendCmd(1)">
              {{ $T('Refresh picture') }}
            </v-btn>
            <v-btn variant="outlined" color="#00bad4" @click="sendCmd(4)">
              {{ $T('Refresh IMU') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </slot>
      <v-btn
        tile
        width="30"
        min-width="30"
        max-width="30"
        height="60"
        :style="{top: '50%', transform:'translate(-100%, -50%)',position:'absolute',zIndex: 10}"
        @click="drawer = !drawer"
      >
        <v-icon v-if="drawer">
          mdi-chevron-left
        </v-icon>
        <v-icon v-else>
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </v-navigation-drawer>
  </div>
</template>

<script>
import MarkerCluster from '../map/MarkerCluster.vue'

export default {
  components: {
    'v-marker-cluster': MarkerCluster
  },
  props: {
    base: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      selected: undefined,
      drawer: true,
      opacity: 1,
      sensors: [],
      lineCoords: [],
      powerLines: [],
      zoom: 0,
      height: 900,
      headers: [
        { text: '', value: 'childs.connected.value', width: 50, sortable: true, custom: { component: 'datasource-online-icon' } },
        { text: this.$T('Name'), value: 'displayname' },
        { text: this.$T('Line temperature'), value: 'childs.linetemp.value', width: 150, sortable: true, custom: { item: 'childs.linetemp', component: 'value-unit', unit: '°C' } },
        { text: this.$T('Distance'), value: 'childs.distance.value', width: 150, sortable: true, custom: { item: 'childs.distance', component: 'value-unit' } },
        { text: this.$T('Pitch'), value: 'childs.pitch.value', width: 150, sortable: true, custom: { item: 'childs.pitch', component: 'sparkline' } },
        { text: this.$T('Roll'), value: 'childs.roll.value', width: 150, sortable: true, custom: { item: 'childs.roll', component: 'sparkline' } },
        { text: this.$T('Alarm'), value: 'nodeid', width: 50, sortable: false, custom: { component: 'alarm-icon' } },
        { text: '', value: 'settings', width: 50, sortable: false, custom: { component: 'settings-icon' } }
      ],
      mobileHeaders: [
        { text: this.$T('Name'), value: 'displayname' },
        { text: this.$T('Line temp'), value: 'childs.linetemp.value', width: 150, sortable: true, custom: { item: 'childs.linetemp', component: 'value-unit' } },
        { text: this.$T('Alarm'), value: 'nodeid', width: 50, sortable: false, custom: { component: 'alarm-icon' } }
      ]
    }
  },
  computed: {
    mapWidth () {
      return this.drawer ? '100%' : 'calc(100% - 1140px)'
      // return '100%'
    }
  },
  watch: {
    selected () {
      this.drawer = false
    }
  },
  mounted () {
    this.getItems('sensors', false)
    this.getItems('powerLines', true)
    setTimeout(() => {
      this.drawer = false
    }, 500)
    this.height = this.$refs.drawer.$el.clientHeight - 120
  },
  methods: {
    flyToBounds () {
      const bounds = this.$refs.clusterRef.mapObject.value?.getBounds()
      if (bounds) { this.map.flyToBounds(bounds, { maxZoom: 9 }) }
    },
    clusterReady () {
      console.log('cluster ready')
      // this.flyToBounds()
    },
    sendCmd (cmd) {
      top.webMI.data.call('AVJU_ilo_control', { sensorid: this.selected.nodeid, command: cmd }, (data) => {
        console.log('ilo_control return:', data)
      })
    },
    setSelected (item) {
      console.log('Set selected: ', item)
      this.selected = item
    },
    async getItems (type, getValues) {
      const filter = {
        startAddress: `${this.base}.${type}`,
        vTypes: ['ObjectTypes.PROJECT', 'VariableTypes.PROJECT.setting', 'VariableTypes.PROJECT.measurement', 'VariableTypes.ATVISE.Display', 'i=62', 'i=61'],
        endLevel: 3,
        mapping: ['nodeid:nodeid:splitnamespace', 'browsename:browsename', 'typeDefinition:typedefinition:splitnamespace', 'displayname:displayname', 'description:description']
      }
      if (getValues) {
        filter.mapping.push('value:value')
      }
      const items = await this.$browse(filter, true)
      this[type] = items.filter((item) => { return item.typeDefinition.includes('ObjectTypes.PROJECT') })
      // return items.filter((item) => { return item.typedefinition.includes('ObjectTypes.PROJECT') })
    },
    getFeaturesInView () {
      // const features = []
      // const map = this.$refs.map.map
      // map.eachLayer(function (layer) {
      //   if (layer instanceof top.L.Marker) {
      //     if (map.getBounds().contains(layer.getLatLng())) {
      //       features.push(layer)
      //     }
      //   }
      // })
      // console.log(features)
    }
  }
}
</script>

<style>
@import "leaflet.markercluster/dist/MarkerCluster.css";
@import "leaflet.markercluster/dist/MarkerCluster.Default.css";

</style>
