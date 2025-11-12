<template>
  <v-container v-if="filteredList.length> 0" class="oxygentbl">
    <v-card>
      <v-card-subtitle>{{ $T(sensorType) }}</v-card-subtitle>
      <v-data-table
        :items="filteredList"
        :headers="headers"
        hide-default-footer
      >
        <template #[`item.merde`]="{ item }">
          <div v-if="item.typeDefinition.includes('UnitType')">
            {{ $T(item.displayname) }}
          </div>
        </template>

        <template #[`item.depth`]="{ item }">
          <template v-for="sensor in item.childs">
            <tr v-if="sensor.typeDefinition.includes(sensorType.toLowerCase())" :key="sensor.nodeid">
              <td>
                {{ sensor.childs.depth.value }}
              </td>
            </tr>
          </template>
        </template>

        <template #[`item.sat`]="{ item }">
          <template v-for="sensor in item.childs">
            <tr v-if="sensor.typeDefinition.includes(sensorType.toLowerCase())" :key="sensor.nodeid">
              <td v-if="sensorType==='Oxygen'">
                {{ Number(sensor.childs.sat.value).toFixed(1) }}
              </td>
              <td v-if="sensorType==='Salinity'">
                {{ Number(sensor.childs.cond.value).toFixed(1) }}
              </td>
            </tr>
          </template>
        </template>

        <template #[`item.mgl`]="{ item }">
          <template v-for="sensor in item.childs">
            <tr v-if="sensor.typeDefinition.includes(sensorType.toLowerCase())" :key="sensor.nodeid">
              <td v-if="sensorType==='Oxygen'">
                {{ Number(sensor.childs.mgl.value).toFixed(1) }}
              </td>
              <td v-if="sensorType ==='Salinity'">
                {{ Number(sensor.childs.salinity.value).toFixed(1) }}
              </td>
            </tr>
          </template>
        </template>

        <template #[`item.temp`]="{ item }">
          <template v-for="(sensor, i) in item.childs">
            <tr v-if="sensor.typeDefinition.includes(sensorType.toLowerCase())" :key="sensor.nodeid">
              <td v-if="sensorType==='Oxygen'" style="display:flex">
                {{ Number(sensor.childs.temp.value).toFixed(1) }}
                <div style="margin-left:50%;display:flex;">
                  <button-popup
                    :key="i"
                    style="margin-left:10%"
                    :base="sensor.nodeid"
                    :display="`${sensor.typeDefinition}.trend`"
                    show-icon="icon"
                    icon="mdi-chart-line"
                  />
                  <data-table-widget-settings-icon  style="margin-left:20%" :item="sensor" />
                </div>
              </td>
              <td
                v-if="sensorType==='Salinity'"
                style="display:flex;flex-direction: row;
    align-items: center;
}"
              >
                {{ Number(sensor.childs.temp.value).toFixed(1) }}
                <div style="margin-left:50%;display:flex;">
                  <button-popup
                    :key="i"
                    style="margin-left:10%"
                    :base="sensor.nodeid"
                    :display="`${sensor.typeDefinition}.trend`"
                    show-icon="icon"
                    icon="mdi-chart-line"
                  />
                  <data-table-widget-settings-icon  style="margin-left:20%" :item="sensor" />
                </div>
              </td>
            </tr>
          </template>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog">
      <sensors-logg-popup :base="base" />
    </v-dialog>
  </v-container>
</template>

<script>
// import sparkline from '~/components/widgets/sensors/sparkline.vue'

export default {
  name: 'SensorsList',
  components: {
    // sparkline
  },
  props: {
    base: {
      type: String,
      default: ''
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
    },
    sensorType: {
      type: String,
      default: 'oxygen'
    }
  },
  data: () => ({
    sensors: [],
    search: '',
    update: 0,
    dialog: false,
    filteredItems: [],
    fab: false
  }),
  computed: {
    filteredList () {
      let _arr = []
      if (this.base.length > 5) {
        _arr = this.sensors.filter((item) => {
          let activeSensor = false
          for (const sensor in item.childs) {
            if (item.childs[sensor].typeDefinition.includes(this.sensorType.toLowerCase())) {
              if (item.childs[sensor].childs.active.value) {
                activeSensor = true
              }
            }
          }

          return activeSensor
        })
      }

      return _arr
    },
    headers () {
      let headers = []

      if (this.sensorType === 'Oxygen') {
        headers = [{ text: `${this.$T('Plassering')}`, value: 'merde' },
          { text: `${this.$T('Depth')} (m)`, value: 'depth' },
          { text: `${this.$T('Saturation')} (%)`, value: 'sat', groupable: false },
          { text: `${this.$T('Saturation')} (mgl/l)`, value: 'mgl', groupable: false },
          { text: `${this.$T('Temperature')} (°C)`, value: 'temp', groupable: false }

        ]
      }
      if (this.sensorType === 'Salinity') {
        headers = [{ text: `${this.$T('Plassering')}`, value: 'merde', width: 30 },
          { text: `${this.$T('Depth')} (m)`, value: 'depth', width: 30 },
          { text: `${this.$T('Salinity')} (%)`, value: 'sat', groupable: false, width: 30 },
          { text: `${this.$T('Conductivity')} (‰)`, value: 'mgl', groupable: false, width: 30 },
          { text: `${this.$T('Temperature')} (°C)`, value: 'temp', groupable: false, width: 30 }

        ]
      }

      return headers
    }
  },
  watch: {
    base: {
      immediate: true,
      async handler () {
        if (this.base) {
          this.sensors = await this.getItems()
        }
      }
    },
    filteredList: {
      immediate: false,
      handler () {
        this.$emit('items', this.sensors)
      },
      search: {
        handler () {}
      }
    }
  },

  async mounted () {
    // this.sensors = await this.getItems()
  },

  destroyed () {
    clearInterval(this.interval)
  },
  methods: {
    filterChilds (list) {
      return list
    },

    subNode (mes) {
      return new Promise((resolve, reject) => {
        top.webMI.data.subscribe(mes.nodeid, function (data) {
          mes.value = data.value
        })
      })
    },
    getItems () {
      return new Promise((resolve, reject) => {
        const vTypes = []
        vTypes.push('ObjectTypes.PROJECT.BaseObjectTypeJMH.SensorType')
        vTypes.push('ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType.Unit_Cage')
        vTypes.push('VariableTypes.PROJECT.measurement')
        vTypes.push('VariableTypes.PROJECT.position')
        vTypes.push('i=62')
        vTypes.push('VariableTypes.PROJECT.setting')
        const filter = {
          startAddress: this.base,
          endLevel: 0,
          vTypes,
          mapping: [
            'browsename:browsename',
            'displayname:displayname',
            'nodeid:nodeid:splitnamespace',
            'description:description',
            'typeDefinition:typedefinition:splitnamespace',
            'value:value'
          ]
        }
        top.webMI.data.call('BrowseNodes', filter, (data) => {
          resolve(this.toArray(data))
        })
      })
    },
    toArray (data) {
      return Object.keys(data).map((i) => {
        // this.toArray(data[i].childs)
        return data[i]
      })
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
