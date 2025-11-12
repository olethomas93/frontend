<template>
  <div>
    <data-table
      :items="items"
      :headers="headers"
      :mobile-headers="mobileHeaders"
      :table-props="tableProps"
      @click:row="click($event.nodeid)"
      @selected="selected = $event"
    />
    <crud-widget-v2
      :base="base"
      :can-add="rights.engineer"
      :can-edit="rights.write"
      _can-delete
      add-form="customer-add"
      :selected="selected"
      :object-type="objectType"
      @update="init"
    />
  </div>
</template>

<script>
import rights from '@/global/atviseRightsMixin'

export default {
  mixins: [
    rights
  ],
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    }
  },
  data: () => {
    return {
      items: [],
      selected: [],
      headers: [
        { text: 'Navn', value: 'displayname' },
        { text: 'Beskrivelse', value: 'description' },
        { text: 'Alarm', value: 'nodeid', width: 80, sortable: false, custom: { component: 'alarm-icon' } }
      ],
      mobileHeaders: [
        { text: 'Navn', value: 'displayname' },
        { text: 'Beskrivelse', value: 'description' }
      ],
      tableProps: {
        showSelect: false,
        singleSelect: true,
        hideDefaultFooter: true
      }
    }
  },
  watch: {
    'rights.write' (value) {
      this.tableProps.showSelect = value
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      try {
        this.items = await this.getItems()
      } catch (err) {
        // console.log('Failed to get customers')
        // console.log(err)
      }
    },
    getItems () {
      return new Promise((resolve, reject) => {
        const filter = {
          startAddress: this.base,
          endLevel: 0,
          vTypes: ['ObjectTypes.PROJECT'],
          mapping: ['browsename:browsename', 'displayname:displayname', 'nodeid:nodeid:splitnamespace', 'description:description']
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

</style>
