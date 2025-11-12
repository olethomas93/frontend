<template>
  <div>
    <data-table
      v-model="selected"
      :items="customers"
      :headers="headers"
      :mobile-headers="mobileHeaders"
      :table-props="tableProps"
      @click:row="click($event.nodeid)"
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
    },
    objectType: {
      type: String,
      default: 'ObjectTypes.PROJECT.jmhGeneral.customer'
    }
  },
  data () {
    return {
      selected: [],
      customers: [],
      headers: [
        { text: 'Navn', value: 'displayname' },
        { text: 'Beskrivelse', value: 'description' },
        // { text: 'Lokasjoner', value: 'childs.locations.childs', width: 80, sortable: false, custom: { component: 'locations' } },
        // { text: 'Tickets', value: 'childs.tickets.childs', width: 80, sortable: false, custom: { component: 'tickets' } },
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
        this.selected = []
        this.customers = await this.getCustomers()
      } catch (err) {
        // console.log('Failed to get customers')
        // console.log(err)
      }
    },
    getCustomers () {
      const base = this.base // this.$route.query.base || top.webMI.query.base || 'AGENT.OBJECTS'
      return new Promise((resolve, reject) => {
        const filter = {
          startAddress: base,
          endLevel: 1,
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
    },
    click (address) {
      this.$router.push({ query: { base: address, display: address + '.default' } })
    }
  }
}
</script>

<style>
</style>
