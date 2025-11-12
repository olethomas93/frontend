<template>
  <div>
    <v-row style="height:100%">
      <v-col sm="12" lg="5" style="height:100%; overflow:auto;">
        <sensors-listoxygen
          sensor-type="Oxygen"
          :base="base"
          group-by="location"
          @items="items = $event"
        />
        <sensors-listoxygen
          sensor-type="Salinity"
          :base="base"
          group-by="location"
          @items="items = $event"
        />
      </v-col>
      <v-col v-if="large" cols="7">
        <map-base
          editable
          @mapReady="onReady"
          @zoom="zoomUpdate"
          @edit="edit = $event"
          @save="save"
        >
          <template #overlay>
            <transition name="bounce">
              <div v-if="edit" class="editInfo">
                Edit Mode
              </div>
            </transition>
            <map-info-window
              :width="200"
              :pointto="JSON.parse(fleetPos.position.value)"
            >
              <center>
                {{ fleetName.displayname }}
              </center>
            </map-info-window>
            <template v-for="(station, index) in items">
              <map-info-window
                v-if="
                  station.typeDefinition.includes('weatherstation') &&
                    station.childs.active.value
                "
                :key="index"
                :width="200"
                :top="150"
              >
                <div>
                  <div>
                    <center>
                      Værstasjon
                    </center>
                    <alarm-icon
                      style="    width: 48px;
    height: 48px;
    position: absolute;
    right: -20px;
    top: -5px;"
                      :base="station.nodeid"
                    />
                  </div>
                  <atvise-visu-v3
                    :base="station.nodeid"
                    settings="ObjectTypes.PROJECT.BaseObjectTypeJMH.SensorType.Sensor_weatherstation.atvCompassWidget"
                  />
                </div>
              </map-info-window>
            </template>
          </template>

          <template #map>
            <div v-for="cage in items" :key="cage.nodeid">
              <l-circle
                v-if="cage.typeDefinition.includes('Unit_Cage')"
                ref="circle"
                :lat-lng="getPositionArr(cage.childs.position.value)"
                :color="cage.displayname == 'Reference' ? 'orange' : 'blue'"
                :radius="40"
                fill-color="black"
                :stroke="true"
                :weight="1"
                @click="openInfo(cage.nodeid)"
                @mousedown="move($event, cage)"
              >
                <l-tooltip
                  :options="{
                    direction: 'top',
                    permanent: true,
                    className: 'fiskemannen'
                  }"
                >
                  <h4>{{ cage.displayname }}</h4>
                </l-tooltip>
              </l-circle>
            </div>
            <l-polygon
              :lat-lngs="bounds1"
              color="#00a3e0"
              dash-array="10"
              :fill="true"
              :smooth-factor="1.0"
            />

            <!-- <l-polygon
        :lat-lngs="bargeBounds"
        color="orange"
        fill-color="orange"
        :smooth-factor="1.0"
      /> -->
            <!-- <map-info-drawer :remote="drawer">
              <template #content>
                <sensors-list-mini :nodeid="dialogInfo" :mini="true" />
              </template>
            </map-info-drawer> -->
          </template>
        </map-base>
      </v-col>
    </v-row>
  </div>
</template>
<script>
// import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import { webMI } from '@/global/webMI_mixin'
export default {
  components: {
    // 'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  mixins: [webMI],

  inject: ['theme'],
  props: {
    base: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      apiService: undefined,
      tileUrl: this.urlLight,
      currentZoom: 5,
      radius: 500,
      show: false,
      layerIndex: 0,
      zoomTreshold: 14,
      newVal: [],
      count: 0,
      sensors: [],
      map: undefined,
      weatherStations: [],
      bounds1: [],
      cages: {},
      sensor: [],
      items: [],
      edit: false,
      fleetPos: {},
      dialogInfo: ' ',
      fleetName: '',
      drawer: false
    }
  },
  computed: {
    layer () {
      return this.layers[this.layerIndex]
    },
    large () {
      return this.$vuetify.breakpoint.mdAndUp
    }
  },
  watch: {
    'theme.isDark' (isDark) {
      this.setStyle(isDark)
    },
    base: {
      immediate: true,
      async handler () {
        const locationBase = this.getBase(this.base)
        this.fleetName = await this.getLocation(locationBase)
        this.fleetBounds = JSON.parse(
          (await this.read(`${locationBase}.geometry`)).value
        )
        this.setFleetBounds(this.fleetBounds)
        this.fleetPos = await this.getByTypeVar(
          locationBase,
          'VariableTypes.PROJECT.setting.json.position'
        )
      }
    }
  },

  async mounted () {},
  methods: {
    setFleetBounds (points) {
      for (const i of points) {
        this.bounds1.push([i.latitude, i.longitude])
      }
    },
    read (node) {
      return new Promise((resolve, reject) => {
        top.webMI.data.read(node, function (data) {
          resolve(data)
        })
      })
    },
    save () {
      for (const item of this.items) {
        if (item.childs.position) {
          top.webMI.data.write(
            [item.childs.position.nodeid],
            [item.childs.position.value]
          )
        }
      }
    },
    move (e, cage) {
      if (this.edit) {
        this.map.dragging.disable()

        this.map.on('mousemove', function (data) {
          cage.childs.position.value = `{ "lat": ${data.latlng.lat}, "lng": ${data.latlng.lng} }`
        })

        this.map.on('mouseup', () => {
          this.map.dragging.enable()
          this.map.removeEventListener('mousemove')
        })
      }
    },
    countUp () {
      this.count += 1
    },
    getPosition (cage) {
      const position = JSON.parse(cage)
      return position
    },
    openInfo (nodeid) {
      if (!this.edit) {
        this.dialogInfo = nodeid
        this.drawer = !this.drawer
      }
    },
    getBase (base) {
      const _arr = base.split('.')
      _arr.pop()
      return _arr.join('.')
    },
    getZoom (zoom) {
      switch (zoom) {
        case 14:
          return 1
        case 15:
          return 0.5
        case 16:
          return 0.7
        case 17:
          return 1.5
        case 18:
          return 4
        default:
          return 5
      }
    },
    getPositionArr (cage) {
      let position
      if (typeof cage === 'string') {
        position = JSON.parse(cage)
      } else {
        position = cage
      }

      return [position.lat, position.lng]
    },
    getTest (startAdr, type) {
      this.sensors = this.getByType(startAdr, type)
      return this.sensors
    },
    getLocation (base) {
      return new Promise((resolve, reject) => {
        top.webMI.data.call(
          'BrowseNodes',
          {
            endLevel: 0,
            startAddress: base,
            includeStartAddress: true,
            vTypes: [
              'ObjectTypes.PROJECT.jmhGeneral.area.location.fishFarming'
            ],
            mapping: [
              'displayname:displayname',
              'nodeid:nodeid',
              'name:browsename',
              'TypeDefinition:typedefinition:splitnamespace',
              'value:value'
            ]
          },
          function (data) {
            if (data.error) {
              console.log('error')
            } else {
              const name = Object.keys(data).map((i) => {
                return data[i]
              })
              resolve(name[0])
            }
          }
        )
      })
    },
    getByTypeVar (startAdr, type) {
      return new Promise((resolve, reject) => {
        top.webMI.data.call(
          'BrowseNodes',
          {
            endLevel: 1,
            startAddress: startAdr,
            vTypes: [type],
            mapping: [
              'displayname:displayname',
              'nodeid:nodeid',
              'name:description',
              'TypeDefinition:typedefinition:splitnamespace',
              'value:value'
            ]
          },
          function (data) {
            if (data.error) {
              console.log('error')
            } else {
              // const arr = Object.keys(data.cages.childs).map((i) => {
              //   return data.cages.childs[i]
              // })
              resolve(data)
            }
          }
        )
      })
    },

    getAllNodes (sensor) {
      const temp = []
      for (const i in sensor.mes) {
        temp.push(sensor.mes[i].nodeid.split('=')[2])
      }
      return temp
    },
    zoomUpdate (zoom) {
      this.currentZoom = zoom
    },
    update (e) {
      console.log(e)
    },
    onReady (map) {
      this.map = map

      const pos = JSON.parse(this.fleetPos.position.value)
      this.map.flyTo({ lat: pos.lat, lng: pos.lng }, 14)
    },
    flyTo (coord) {
      const pos = JSON.parse(coord.position.value)
      this.map.flyTo({ lat: pos.lat, lng: pos.lng }, 12)
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
  }
}
</script>

<style scoped>
@import "leaflet.markercluster/dist/MarkerCluster.css";
@import "leaflet.markercluster/dist/MarkerCluster.Default.css";

.sensors {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.weather {
  position: absolute;
  left: -20vw;
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
.editInfo {
  z-index: 9999999;
  position: absolute;
  top: 5%;
  right: 5%;
  background-color: #00a3e0;
  height: 50px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10%;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.fiskemannen {
  background-color: red !important;
  box-shadow: 0 !important;
  color: blue !important;
}

.bounce-enter-active {
  animation: bounce-in 1s;
}
.bounce-leave-active {
  animation: fade-out 0.5s;
}
@keyframes bounce-in {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

@keyframes fade-out {
  0% {
    opacity: 100%;
  }
  100% {
    opacity: 0%;
  }
}
</style>
<style>
.leaflet-tooltip {
  box-shadow: none;
  background: transparent;
  border: 0px;
  border-radius: 0px;
}
.leaflet-tooltip-top:before {
  border-top-color: transparent !important;
  background: transparent !important;
}
</style>
