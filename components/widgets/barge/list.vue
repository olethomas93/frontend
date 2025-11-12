<template>
  <v-data-table
    v-if="sensors.length >0"
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
    <template #[`item.liter`]="{ item }">
      <div v-if="item.data">
        <div v-if="item.data.liter>0">
          {{ item.data.liter }}L
        </div>
      </div>
    </template>

    <template #[`item.displayname`]="{ item }">
      {{ $T(item.displayname) }}
    </template>
    <template #[`item.data.percent`]="{ item }">
      <data-table-widget-bar v-if="item.TypeDefinition.includes('ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType.Unit_Tank')" :value="item.data.percent" />
      <div v-else-if="item.displayname.includes('Luker')">
        {{ item.value }} Lukket
      </div>
      <div v-if="item.name.toLowerCase().includes('1000v') || item.name.toLowerCase().includes('400v')">
        {{ Math.round(item.childs.U12.value) }}V | {{ Math.round(item.childs.I1.value) }}A
      </div>
      <div v-else-if="item.TypeDefinition.includes('ObjectTypes.PROJECT.BaseObjectTypeJMH.SensorType.Sensor_energy')">
        <data-table-widget-lamp :value="item.childs.connected.value" />
      </div>
    </template>
  </v-data-table>
  <sensors-no-sensors v-else />
</template>

<script>
import { webMI } from '@/global/webMI_mixin'

export default {
  name: 'Bargelist',
  components: {
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
    }
  },
  data: () => ({
    sensors: [],
    search: '',
    update: 0
  }),
  computed: {
    headers () {
      let headers = []
      if (this.mini) {
        headers = [
          { text: this.$T('Name'), value: 'displayname', groupable: false },
          { text: this.$T(''), value: 'liter', groupable: false },
          // { text: 'Forbruk', value: 'data.consum', groupable: false },
          { text: this.$T(''), value: 'data.percent', groupable: false, width: 150 }
        ]
      }

      return headers
    }
  },
  watch: {
  },

  async mounted () {
    const sensors = await this.getTanks()
    const hatch = await this.getHatches()
    const power = await this.getPower()
    await this.getSensorsData(sensors)
    this.sensors = this.sensors.concat(hatch).concat(power)
    console.log(this.sensors)
  },

  destroyed () {
    clearInterval(this.interval)
  },
  methods: {
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
    getTanks () {
      return new Promise((resolve, reject) => {
        top.webMI.data.call(
          'JMH_getType',
          {
            includeStartAddress: true,
            endLevel: 0,
            key: 'TypeDefinition',
            value: 'ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType.Unit_Tank',
            startAddress: this.base || this.$route.query.base,
            vTypes: [
              'ObjectTypes.PROJECT',
              'VariableTypes.PROJECT.measurement',
              'i=62'
            ],
            mapping: [
              'displayname:displayname',
              'nodeid:nodeid:splitnamespace',
              'name:description',
              'TypeDefinition:typedefinition:splitnamespace',
              'value:value'
            ]
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
    getHatches () {
      return new Promise((resolve, reject) => {
        top.webMI.data.call(
          'JMH_getType',
          {
            includeStartAddress: true,
            endLevel: 0,
            key: 'displayname',
            value: 'Luker',
            startAddress: this.base || this.$route.query.base,
            vTypes: [
              'ObjectTypes.PROJECT',
              'i=62'
            ],
            mapping: [
              'displayname:displayname',
              'nodeid:nodeid:splitnamespace',
              'name:description',
              'TypeDefinition:typedefinition:splitnamespace',
              'value:value'
            ]
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
    getPower () {
      return new Promise((resolve, reject) => {
        top.webMI.data.call(
          'JMH_getType',
          {
            includeStartAddress: true,
            endLevel: 0,
            key: 'TypeDefinition',
            value: 'ObjectTypes.PROJECT.BaseObjectTypeJMH.SensorType.Sensor_energy',
            startAddress: this.base || this.$route.query.base,
            vTypes: [
              'ObjectTypes.PROJECT',
              'i=62'
            ],
            mapping: [
              'displayname:displayname',
              'nodeid:nodeid:splitnamespace',
              'name:description',
              'TypeDefinition:typedefinition:splitnamespace',
              'value:value'
            ]
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
      this.sensors = this.sensors.concat(sensors)
    },

    getSensorData (sensor) {
      return new Promise((resolve, reject) => {
        const nodes = this.getAllNodes(sensor)
        const ret = {}
        top.webMI.data.read(nodes, function (data) {
          for (const i in data) {
            ret[data[i].description.en] = data[i].value
          }
          resolve(ret)
        })
      })
    },

    getAllNodes (sensor) {
      const temp = []
      for (const i in sensor.childs) {
        temp.push(sensor.childs[i].nodeid.split('=')[2])
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
