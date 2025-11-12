<template>
  <div>
    <data-table :items="sensors" :headers="headers" :table-props="tableProps">
      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length" style="padding-left:56px;">
          <data-table :headers="headers2" :items="getMeasurements(item.childs)" :table-props="{ hideDefaultFooter: true, hideDefaultHeader: true }" />
          <!-- <avju-measurements-list :base="item.nodeid" /> -->
        </td>
      </template>
    </data-table>
  </div>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: ''
    },
    typeDefinition: {
      type: String,
      default: 'ObjectTypes.PROJECT.BaseObjectTypeJMH.SensorType'
    }
  },
  data: () => {
    return {
      items: [],
      sensors: [],
      headers: [
        { text: 'Name', value: 'displayname', groupable: false },
        { text: 'Description', value: 'description', groupable: false },
        { text: 'Trend', value: 'nodeid', groupable: false, width: 100, custom: { component: 'trend-icon' } }
      ],
      headers2: [
        { text: 'Name', value: 'displayname', groupable: false },
        // { text: 'Description', value: 'description', groupable: false },
        { text: 'Value', value: 'value', groupable: false, width: 100, custom: { component: 'value-unit' } }
        // { text: 'Trend', value: 'nodeid', groupable: false, width: 100, custom: { component: 'trend-icon' } }
      ],
      tableProps: {
        hideDefaultFooter: true,
        hideDefaultHeader: true,
        // showGroupBy: true,
        // groupBy: 'parent',
        showExpand: true
      }
    }
  },
  async mounted () {
    this.items = await this.getData()
    this.sensors = this.getSensors(this.items)
  },
  methods: {
    getData () {
      return new Promise((resolve) => {
        const filter = {
          mapping: ['typedefinition:typedefinition:splitnamespace', 'nodeid:nodeid:splitnamespace', 'browsename:browsename', 'displayname:displayname', 'description:description', 'value:value'],
          startAddress: this.base,
          // vTypes: ['ObjectTypes.PROJECT.AVJU', 'VariableTypes.PROJECT.measurement', 'i=61', 'i=62'],
          vTypes: ['ObjectTypes.PROJECT', 'VariableTypes.PROJECT.measurement', 'i=61', 'i=62'],
          endLevel: 0
        }
        top.webMI.data.call('BrowseNodes', filter, (data) => {
          // resolve(this.getSensors(data))
          resolve(this.objToArr(data))
        })
      })
    },
    getSensors (data) {
      // return data.filter((item) => { return item.typedefinition.includes('ObjectTypes.PROJECT.AVJU.sensor') })
      // return data.filter((item) => { return item.typedefinition.includes('ObjectTypes.PROJECT.BaseObjectTypeJMH.SensorType') })
      return data.filter((item) => { return item.typedefinition.includes(this.typeDefinition) })
    },
    getMeasurements (data) {
      const temp = this.objToArr(data)
      return temp.filter((item) => { return item.typedefinition.includes('VariableTypes.PROJECT.measurement') })
    },
    objToArr (data) {
      return Object.keys(data).map((i) => {
        // data[i].childs = data[i].childs && data[i].childs !== 'ondemand' ? this.objToArr(data[i].childs) : []
        return data[i]
      })
    }
  }

}
</script>

<style>

</style>
