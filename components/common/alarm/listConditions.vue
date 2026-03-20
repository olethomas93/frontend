<template>
  <div>
    <resize-observer @notify="handleResize" />
    <v-data-table
      v-model="selected"
      :items="conditions"
      :headers="headers"
      item-key="condition"
      :height="computedHeight"
      multi-sort
      :sort-by="['locationName','activeMessage', 'item']"
      :sort-desc="true"
      :fixed-header="true"
      :show-select="true"
      :search="search"
      disable-pagination
      hide-default-footer
      :show-group-by="false"
      show-expand
      single-expand
      :expanded.sync="expanded"
      density="compact"
      class="elevation-1"
    >
      <template v-slot:[`body.prepend`]>
        <tr>
          <td colspan="2" />
          <td colspan="1">
            <filter-combo :filter="locationFilter" label="Filter" :items="uniqLocations" @change="locationFilter = $event" />
          </td>
          <td colspan="2" />
        </tr>
      </template>

      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length + 1">
          <pre>{{ JSON.stringify(item, null, 2) }}</pre>
          <!-- <atvise-visu :base="item.base" :settings="item.display" style="height:300px" /> -->
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import filterCombo from './_filterCombo.vue'

export default {
  components: {
    filterCombo
  },
  data: () => ({
    selected: [],
    selectedAlarm: {},
    // showDisabled: false,
    // alarming: undefined,
    search: '',
    // customerFilter: undefined,
    // alarms: [],
    // subID: null,
    pagination: { sortBy: 'timestamp', descending: true },
    // showMenu: false,
    // showDialogDetail: false,
    x: 0,
    y: 0,
    computedHeight: 600,
    expanded: [],
    locationFilter: []
    // statusFilter: []
  }),
  computed: {
    uniqLocations () {
      const temp = this.$lodash.uniqBy(this.conditions, 'locationName')
      return this.$lodash.map(temp, (cond) => { return cond.locationName || 'undefined' })
    },
    conditions () {
      return JSON.parse(JSON.stringify(this.$store.state.alarming.conditions))
    },
    headers () {
      return [
        { text: 'base', value: 'base', groupable: false, filterable: true, align: ' d-none' }, // d-none skjuler kolonne men gjør at den fortsatt er søkbar
        {
          text: 'Kunde',
          value: 'customerName',
          width: 150
          // filter: (value, search) => {
          //   if (!this.customerFilter) { return true }
          //   return value.includes(this.customerFilter)
          // }
        },
        {
          text: 'Lokasjon',
          value: 'locationName',
          filter: (value, search) => {
            if (this.locationFilter.length === 0) { return true }
            return this.$lodash.includes(this.locationFilter, value)
          },
          width: 210
        },
        { text: 'Enhet', value: 'item', groupable: true, width: 100 },
        { text: 'Alarm', value: 'activeMessage', groupable: false, width: 200 }
      ]
    }
  },
  mounted () {
    this.handleResize()
  },
  methods: {
    handleResize () {
      this.computedHeight = this.fillHeight ? window.innerHeight - 135 : this.height
    }
  }
}
</script>

<style>

</style>
