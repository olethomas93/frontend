<template>
  <v-card>
    <v-row>
      <v-col>
        <v-select
          v-model="selectedCage"
          :items="items"
          multiple
          label="Velg"
          item-title="displayname"
          item-value="displayname"
          return-object
        />
      </v-col>
      <v-col>
        <time-picker @time="setTime($event)" />
      </v-col>
      <v-col>
        <datePicker @date="setDate($event)" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="click">
          Oppdater
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <data-table :items="dataTable" :headers="headers" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import timePicker from '../../common/timePicker.vue'
import datePicker from '../../common/datePicker.vue'
import DataTable from '../dataTable.vue'
export default {
  components: {
    timePicker,
    datePicker,
    DataTable
  },
  props: {
    base: {
      type: String,
      default: ' '
    }
  },
  data () {
    return {
      time: this.$moment().format('HH:mm'),
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      items: [
        { id: 1, value: 1, description: 'Level1' },
        { id: 2, value: 2, description: 'Level2' }
      ],
      tableItems: [],
      selectedCage: [],
      dataTable: [],
      headers: [
        { text: 'Sensor', value: 'sensor' },
        { text: 'Depth (m)', value: 'depth' },
        { text: 'Unit', value: 'unit' },
        { text: 'verdi', value: 'value' },
        { text: 'timestamp', value: 'time' }
      ]
    }
  },
  async mounted () {
    this.items = await this.getCages()
    this.selectedCage[0] = this.items[0]
  },
  methods: {
    setTime (e) {
      this.time = e
    },
    setDate (e) {
      this.date = e
    },
    async click () {
      const _tempTable = []
      await this.getNodes(this.selectedCage)

      const data = await this.getHistory(this.tableItems)
      for (const i in data) {
        for (const j in this.tableItems) {
          if (this.tableItems[j].nodeid === data[i].id) {
            const nodeid = data[i].id.split('=')[2]
            const parent = await this.getParentInfo(nodeid)
            if (data[i].value) {
              _tempTable.push({
                value: `${data[i].value.value.avg.toFixed(2)} ${data[i].value.eng_unit}`,
                unit: this.tableItems[j].displayname,
                location: nodeid.split('.')[7],
                sensor: parent[0].displayname,
                depth: parent[0].childs.depth.value,
                time: new Date(data[i].value.sourceTimestamp).toString().substr(0, 21)
              })
            }
          }
        }
      }
      this.dataTable = _tempTable
    },
    getCages () {
      return new Promise((resolve, reject) => {
        top.webMI.data.call(
          'JMH_getType',
          {
            vTypes: [
              'ObjectTypes.PROJECT.jmhGeneral.fishFarming',
              'ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType.Unit_Cage'
            ],
            key: 'TypeDefinition',
            value: 'ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType.Unit_Cage',
            includeStartAddress: true,
            startAddress: this.base
          },
          function (data) {
            if (data.error) {
              console.log('error')
            } else {
              resolve(data)
            }
          }
        )
      })
    },
    getParentInfo (nodeid) {
      const _arr = nodeid.split('.')
      _arr.pop()
      const newNode = _arr.join('.')
      return new Promise((resolve, reject) => {
        top.webMI.data.call(
          'BrowseNodes',
          {
            vTypes: [
              'ObjectTypes.PROJECT.jmhGeneral.fishFarming',
              'ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType',
              'i=62'
            ],
            mapping: ['displayname:displayname',
              'nodeid:nodeid',
              'name:description',
              'TypeDefinition:typedefinition:splitnamespace',
              'value:value'],
            includeStartAddress: true,
            startAddress: newNode
          },
          function (data) {
            if (data.error) {
              console.log('error')
            } else {
              let _arr = {}
              _arr = Object.keys(data).map((i) => {
                return data[i]
              })
              resolve(_arr)
            }
          }
        )
      })
    },
    getHistory (measurements) {
      const nodeids = measurements.map((mes) => {
        return mes.nodeid
      })
      const toHour = this.time.split(':')
      let hour = Number(toHour[0])
      hour += -1
      toHour[0] = hour
      const temp2 = toHour.join(':')
      const fromHour = this.time.split(':')
      fromHour[0] -= 4
      const _temp = fromHour.join(':')
      return new Promise((resolve, reject) => {
        top.webMI.data.call(
          'JMH_getHistory',
          {
            rollup: 'PT1M',
            nodes: nodeids,
            from: `${this.date}T0${_temp}:00Z`,
            to: `${this.date}T${temp2}:00Z`
          },
          function (data) {
            let arr = []
            arr = Object.keys(data).map((i) => {
              return { value: data[i][0], id: i }
            })

            resolve(arr)
          }
        )
      })
    },
    async getNodes (cages) {
      this.tableItems = []
      for (const cage of cages) {
        const data = await this.getMeasurments(cage.nodeid)
        this.tableItems = this.tableItems.concat(data)
      }
    },
    getMeasurments (cageAdress) {
      return new Promise((resolve, reject) => {
        top.webMI.data.call(
          'JMH_getType',
          {
            vTypes: [
              'ObjectTypes.PROJECT',
              'VariableTypes.PROJECT.measurement',
              'i=62'
            ],
            key: 'TypeDefinition',
            value: 'VariableTypes.PROJECT.measurement',
            includeStartAddress: true,
            startAddress: cageAdress
          },
          function (data) {
            if (data.error) {
              console.log('error')
            } else {
              resolve(data)
            }
          }
        )
      })
    }
  }
}
</script>

<style></style>
