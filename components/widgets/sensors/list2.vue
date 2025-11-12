<template>
  <v-card>
    <div
    >
      <!-- <div style="display:flex; flex-direction:row; align-items: center;">
        <v-text-field
          v-if="!mini"
          v-model="search"
          append-icon="mdi-magnify"
          label="Søk"
          single-line
          hide-details
          style="width:40vh;"
          @keydown.stop=""
        />

        <v-btn v-if="!mini" color="primary" style="position: absolute; right: 1%;" @click.stop="dialog = true">
          Logg
        </v-btn>
      </div>
    </div> -->
      <v-data-table
        v-if="filteredList.length > 0"
        ref="table"
        :search="search"
        :headers="headers"
        :items="filteredList"
        class="elevation-2"
        mobile-breakpoint="0"
        single-expand
        :items-per-page="mini ? 7 : 20"
        :show-group-by="true"
        :group-by="groupBy"
        hide-default-footer
        @update:page="update = $event"
        @current-items="emitItems($event)"
      >
        <template #[`item.location`]="{ item }">
          {{ $T(item.location) }}
        </template>
        <template #[`item.data.value`]="{ item }">
          <div style="display: flex;flex-direction: row;">
            <div style="display: flex;flex-direction: row;">
              <v-progress-linear v-if="item.engunit === '%'" v-model="item.data.value" color="primary" height="25" style="width:150px">
                <template #default="">
                  {{ item.data.value.toFixed(1) }} {{ item.engunit }}
                </template>
              </v-progress-linear>
              <span v-else>
                <div v-if="item.data.value">
                  {{ item.data.value.toFixed(1) }} {{ item.engunit }}
                </div>
                <div v-else> {{ item.data.value }} {{ item.engunit }}  </div>
              </span>
            </div>

            <v-icon
              v-if="item.engunit == '°'"
              :style="{
                webkitTransform: `rotate(${item.data.value.toFixed(0)}deg)`
              }"
            >
              mdi-arrow-up
            </v-icon>
          </div>
        </template>
        <template #[`item.verdi`]="{ item }">
          <div style="display: flex;flex-direction: row;">
            <span v-if="item.data.value" style="font-size:1.0em">{{ item.data.value.toFixed(1) }}</span>
            <span v-else style="font-size:1.0em">NaN</span>
            <span style="font-size:1em">{{ item.engunit }}</span>
          </div>
        </template>

        <template #[`item.nodeid`]="{ item }">
          <alarm-icon overlap :base="item.nodeid" />
        </template>

        <template #[`item.sensorTypeAndMes`]="{ item }">
          <v-badge dot :color="item.active ? 'green':'grey'">
            <div style="display: flex;flex-direction: column;">
              <span class="primary--text text--lighten-1" style="font-size:1em;">{{ $T(item.location) }}</span>
              <span class="h6 font-weight-medium" style="font-size:0.9em">{{
                $T(item.sensorType)
              }}</span>
            </div>
          </v-badge>
        </template>
        <template #[`item.graf`]>
          <v-tooltip bottom>
            <template #activator="{ on , attrs }">
              <div v-bind="attrs" v-on="on">
              <!-- <sparkline
                ref="graph"
                :update="update"
                :nodeid="item.nodeid"
                :vtype="item.type"
              /> -->
              </div>
            </template>
            <span>Klikk for trend</span>
          </v-tooltip>
        </template>
        <template
          ref="headergroup"
          #[`group.header`]="{headers, group, toggle, remove, isOpen}"
          class="groupHeader"
        >
          <td v-if="groupBy.length >1" :colspan="headers.length" :style="{ background: 'grey' }">
            <!-- <v-btn color="primary" class="elevation-2 group"> -->
            <v-btn icon @click="toggle">
              <v-icon v-if="isOpen">
                mdi-minus
              </v-icon>
              <v-icon v-else>
                mdi-plus
              </v-icon>
            </v-btn>
            {{ group }}
            <v-btn icon @click="remove">
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
          <!-- </v-btn> -->
          </td>
        </template>

        <template #[`footer`]="{props}">
          <div v-if="props.pagination.pageCount>1">
            <v-btn
              icon
              @click="
                props.options.page > 1
                  ? (props.options.page -= 1)
                  : props.options.page
              "
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            {{ props.pagination.page }}/{{ props.pagination.pageCount }}
            <v-btn
              icon
              @click="
                props.options.page <= props.pagination.pageCount
                  ? (props.options.page += 1)
                  : props.options.page
              "
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
      <sensors-no-sensors v-else></sensors-no-sensors>
    </div>
  </v-card>
</template>

<script>
import { webMI } from '@/global/webMI_mixin'
// import sparkline from '~/components/widgets/sensors/sparkline.vue'

export default {
  name: 'SensorsList',
  components: {
    // sparkline
  },
  mixins: [webMI],
  props: {
    base: {
      type: String,
      default: undefined
    },
    mini: {
      type: Boolean,
      default: false
    },
    groupBy: {
      type: String,
      default: ''
    },
    includeStartAddress: {
      type: Boolean,
      default: true
    },
    getAll: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    sensors: [],
    search: '',
    update: 0,
    dialog: false
  }),
  computed: {
    headers () {
      let headers = []
      if (this.mini) {
        headers = [
          { text: this.$T('Sensor'), value: 'sensorTypeAndMes', groupable: false },
          { text: this.$T('Measurement'), value: 'displayName', groupable: false },
          { text: this.$T('Value'), value: 'verdi', groupable: false }
          // { text: this.$T('Last 24h'), value: 'graf', groupable: false, width: 150 }
        ]
      } else {
        headers = [
          { text: this.$T('Area'), value: 'location' },
          { text: this.$T('Sensor'), value: 'sensorType' },
          { text: 'Dybde', value: 'depth' },
          { text: this.$T('Measurement'), value: 'displayName', groupable: false },
          { text: this.$T('Value'), value: 'data.value', groupable: false, width: 200 }
        ]
      }

      return headers
    },
    filteredList () {
      return this.sensors.filter((item) => {
        return item.active
      })
    }
  },
  watch: {
    base: {
      immediate: true,
      async handler () {
        if (this.base) {
          const sensors = await this.getSensors()
          await this.getSensorsData(sensors)
          // this.interval = setInterval(() => {
          //   this.getSensorsData(sensors)
          // }, 10000)
        }
      }
    }

  },

  async mounted () {
    const sensors = await this.getSensors()
    await this.getSensorsData(sensors)
  },

  destroyed () {
    clearInterval(this.interval)
  },
  methods: {
    getBase (base) {
      const _arr = base.split('.')
      _arr.pop()
      const _base = _arr.join('.')
      return _base
    },
    emitItems (e) {
      this.debounce(function () {
        this.updateGraph()
      }, 250)
      this.$emit('items', e)
    },
    degreeToText (degree) {
      const val = degree / 22.5 + 0.5
      const arr = [
        'N',
        'NNE',
        'NE',
        'ENE',
        'E',
        'ESE',
        'SE',
        'SSE',
        'S',
        'SSW',
        'SW',
        'WSW',
        'W',
        'WNW',
        'NW',
        'NNW'
      ]
      return arr[val % 16]
    },
    getNodeId (nodeid) {
      const tempArr = nodeid.split('.')
      tempArr.pop()
      return tempArr.join('.')
    },
    getLocationBase (routeAdress) {
      const _arr = routeAdress.split('.')

      _arr.pop()
      const newBase = _arr.join('.')
      return newBase
    },
    updateGraph () {
      this.update = { nmbr: Math.random() }
    },
    debounce (func, wait, immediate) {
      let timeout

      return function executedFunction () {
        const context = this
        const args = arguments

        const later = function () {
          timeout = null
          if (!immediate) { func.apply(context, args) }
        }

        const callNow = immediate && !timeout

        clearTimeout(timeout)

        timeout = setTimeout(later, wait)

        if (callNow) { func.apply(context, args) }
      }
    },
    getSensors () {
      let base = this.base
      if (this.getAll) {
        const _arr = this.base.split('.')
        _arr.pop()
        if (_arr.length === 6) {
          base = _arr.join('.')
        }
      }
      return new Promise((resolve, reject) => {
        top.webMI.data.call(
          'JMH_getSensors',
          {
            includeStartAddress: this.getAll ? false : this.includeStartAddress,
            startAddress: base
          },
          function (data) {
            if (data.error) {
              console.log('error')
            } else {
              const arr = Object.keys(data).map((i) => {
                return data[i]
              })
              resolve(arr)
            }
          }
        )
      })
    },
    async getSensorsData (sensors) {
      await Promise.all(
        sensors.map(async (sensor) => {
          const data = await this.getSensorData(sensor)
          sensor.data = data
          return sensor
        })
      )
      this.sensors = sensors
    },

    getSensorData (sensor) {
      return new Promise((resolve, reject) => {
        // const nodes = this.getAllNodes(sensor)
        const node = sensor.nodeid.split('=')[2]
        top.webMI.data.read(node, function (data) {
          resolve(data)
        })
      })
    },

    getAllNodes (sensor) {
      const temp = []
      for (const i in sensor) {
        temp.push(sensor[i].nodeid.split('=')[2])
      }
      return temp
    }
  }
}
</script>
<style>
.v-row-group__header {
  background: transparent !important;
}
.group {
  margin-left: 5%;
}
</style>
