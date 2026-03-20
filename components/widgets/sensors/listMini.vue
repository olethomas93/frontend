<template>
  <v-data-table
    v-if="sensors.length>0"
    ref="table"
    :search="search"
    :headers="headers"
    :items="sensors"
    class="elevation-2"
    mobile-breakpoint="0"
    single-expand
    :items-per-page="mini ? 15 : 15"
    show-group-by
    hide-default-footer
    @update:page="update = $event"
  >
    <template #[`item.data.value`]="{ item }">
      <div style="display: flex;flex-direction: row;">
        <div style="display: flex;flex-direction: row;">
          <span style="font-size:0.9em">{{ item.data.value.toFixed(2) }}</span> <span style="font-size:0.8em">{{ item.engunit }}</span>
        </div>

        <v-icon v-if="item.engunit== '°'" :style="{'webkitTransform':`rotate(${item.data.value.toFixed(2)}deg)`}">
          mdi-arrow-up
        </v-icon>
      </div>
    </template>
    <template #[`item.verdi`]="{ item }">
      <div style="display: flex;flex-direction: row;">
        <span style="font-size:0.8em">{{ item.data.value.toFixed(2) }}</span> <span style="font-size:0.8em">{{ item.engunit }}</span>
      </div>
    </template>
    <template #[`item.type`]="{ item }">
      <div style="display: flex;flex-direction: row;">
        <span class=" font-weight-light" style="font-size:0.8em">{{ item.displayName }}</span>
      </div>
    </template>

    <template #[`item.nodeid`]="{ item }">
      <icon-button :node-id="getNodeId(item.nodeid)" overlap :always="true" />
    </template>
    <template #[`item.sensorTypeAndMes`]="{ item }">
      <div style="display: flex;flex-direction: column;">
        <span style="font-size:0.8em">{{ item.sensorType }}</span>
        <span class="h6 font-weight-medium" style="font-size:0.7em">{{ item.location }}</span>
      </div>
    </template>
    <template #[`item.graf`]="{ item }">
      <v-tooltip bottom>
        <template #activator="{ on , attrs }">
          <div v-bind="attrs" v-bind="props">
            <sparkline
              ref="graph"
              :update="update"
              :nodeid="item.nodeid"
              :vtype="item.type"
              :name="$T(item.displayName)"
              :unit="item.engunit"
            />
          </div>
        </template>
        <span>Klikk for trend</span>
      </v-tooltip>
    </template>
    <template ref="headergroup" #[`group.header`]="{group,toggle,remove}" class="groupHeader">
      <v-btn color="primary" class="elevation-2 group">
        <v-btn icon @click="toggle">
          <v-icon>mdi-minus</v-icon>
        </v-btn>

        {{ group }}

        <v-btn icon @click="remove">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-btn>
    </template>
  </v-data-table>
  <sensors-no-sensors v-else />
</template>

<script>
import { webMI } from '@/global/webMI_mixin'
import IconButton from '~/components/common/alarm/iconButton.vue'
import sparkline from '~/components/widgets/sensors/sparkline.vue'

export default {
  name: 'SensorsList',
  components: {
    IconButton,
    sparkline
  },
  mixins: [
    webMI
  ],
  props: {
    nodeid: {
      type: String,
      default: ''
    },
    mini: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    sensors: [{}],
    search: '',
    update: 0
  }),
  computed: {
    headers () {
      let headers = []
      if (this.mini) {
        headers = [
          { text: 'Sensor', value: 'sensorTypeAndMes', groupable: false },
          { text: 'Måling', value: 'type', groupable: false },
          { text: 'Verdi', value: 'verdi', groupable: false },
          { text: 'Siste døgn', value: 'graf', groupable: false }
        ]
      }

      return headers
    }
  },
  watch: {
    nodeid: {
      immediate: true,
      async  handler () {
        const sensors = await this.getSensors()
        await this.getSensorsData(sensors)
        this.update = Math.random()
      }

    }
  },

  async mounted () {
    // const sensors = await this.getSensors()
    // console.log(sensors)
    // await this.getSensorsData(sensors)

  },

  destroyed () {
    clearInterval(this.interval)
  },
  methods: {
    degreeToText (degree) {
      const val = (degree / 22.5) + 0.5
      const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
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
    getSensors () {
      return new Promise((resolve, reject) => {
        top.webMI.data.call('JMH_getSensors', { includeStartAddress: true, startAddress: this.nodeid, vTypes: ['ObjectTypes.PROJECT.jmhGeneral', 'ObjectTypes.PROJECT.BaseObjectTypeJMH.SensorType', 'ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType.Unit_Cage', 'VariableTypes.PROJECT.measurement', 'i=62'], mapping: ['displayname:displayname', 'nodeid:nodeid', 'name:description', 'TypeDefinition:typedefinition:splitnamespace', 'value:value'] }, function (data) {
          if (data.error) {
            console.log('error')
          } else {
            const arr = Object.keys(data).map((i) => {
              return data[i]
            })
            const filtered = arr.filter((item) => {
              return item.active
            })
            resolve(filtered)
          }
        })
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
        this.webMI.data.read(node).then((data) => {
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
.v-row-group__header{
 background: transparent !important;
}
.group{
  margin-left: 5%;
}
</style>
