<template>
  <div>
    <data-table
      :items="locations"
      :headers="headers"
      :mobile-headers="mobileHeaders"
      :table-props="tableProps"
      show-search
      @current-items="$emit('current-items', $event)"
      @click:row="click($event.nodeid)"
      @selected="selected = $event"
    />
    <crud-widget-v2
      :can-add="rights.engineer"
      :can-edit="rights.write"
      _can-delete
      :selected="selected"
      edit-form="location-edit-form"
      :object-type="objectType"
      @update="init"
    />
    <!-- <v-data-table
      v-model="selected"
      style="height:calc(100% - 0px)"
      :show-select="rights.write"
      :single-select="true"
      item-key="nodeid"
      :search="search"
      :headers="headers"
      mobile-breakpoint="0"
      :items="locations"
      :hide-default-footer="true"
      height="90%"
      :multi-sort="false"
      :fixed-header="false"
      _class="elevation-1"
      :items-per-page="-1"
      :single-expand="true"
      :item-class="itemRowBackground"
      sort-by="alarmCount.alarms"
      :sort-desc="[true]"
      @current-items="$emit('current-items', $event)"
      @click:row="click"
    >
      <template #top="">
        <v-text-field
          v-model="search"
          :outlined="true"
          label="Søk"
          hide-details=""
          :clearable="true"
          class="mx-4"
          @keydown.stop=""
        />
      </template>
      <template #[`item.feed.kg`]="{ item }">
        <div v-if="item.feed.capacity!==0">
          {{ parseInt(item.feed.kg/1000) }} t / {{ parseInt(item.feed.capacity/1000) }} t
        </div>
      </template>
      <template #[`item.feed.percent`]="{ item }">
        <v-progress-linear v-if="item.feed.capacity!==0" v-model="item.feed.percent" height="25" color="primary">
          {{ parseInt(item.feed.percent) }}%
        </v-progress-linear>
      </template>
      <template #[`item.alarmCount.alarms`]="{ item }">
        <alarm-icon :overlap="true" :node-id="$route.params.customerId + '.' + item.id" />
      </template>
      <template #[`item.connected`]="{ item }">
        <v-tooltip open-delay="500" :right="true" :color="item.connected ? 'success' : 'error'">
          <template #activator="{ props }">
            <v-icon :color="item.connected ? 'success' : 'error'" v-bind="props">
              {{ item.connected ? 'mdi-wifi' : 'mdi-wifi-off' }}
            </v-icon>
          </template>
          <span>{{ item.connected ? 'ONLINE' : 'OFFLINE' }}</span>
        </v-tooltip>
      </template>
    </v-data-table> -->
  </div>
</template>

<script>
import rights from '@/global/atviseRightsMixin'

export default {
  mixins: [
    rights
  ],
  props: {
    fishFarming: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: [],
      search: '',
      locations: [],
      alarmFilter: 'all',
      // headers: [
      //   { text: '', value: 'connected', width: 50, custom: { component: 'online-icon' } },
      //   { text: 'Id', value: 'browsename', width: 80 },
      //   { text: 'Navn', value: 'displayname', width: 150 },
      //   { text: 'Beh./kap. (t)', value: 'feed.kg', width: 150 },
      //   { text: 'Fyllingsgrad (%)', value: 'feed.percent', width: 200, custom: { component: 'bar' } },
      //   {
      //     text: 'Alarm',
      //     value: 'alarmCount.alarms',
      //     width: 50,
      //     sortable: true,
      //     filter: (value) => {
      //       if (this.alarmFilter === 'all') {
      //         return true
      //       }
      //       return value > 0
      //     }
      //   }
      // ],
      mobileHeaders: [
        { text: '', value: 'connected', width: 50 },
        // { text: 'Id', value: 'browsename', width: 100 },
        { text: 'Navn', value: 'displayname' },
        {
          text: 'Alarm',
          value: 'alarmCount.alarms',
          width: 50,
          sortable: true,
          filter: (value) => {
            if (this.alarmFilter === 'all') {
              return true
            }
            return value > 0
          }
        }
      ],
      tableProps: {
        showSelect: false,
        singleSelect: true,
        hideDefaultFooter: true
      }
    }
  },
  computed: {
    objectType () {
      return this.fishFarming ? 'ObjectTypes.PROJECT.jmhGeneral.area.location.fishFarming' : 'ObjectTypes.PROJECT.jmhGeneral.area.location'
    },
    headers () {
      let headers = []
      if (this.fishFarming) {
        headers = [
          { text: '', value: 'connected', width: 50, custom: { component: 'online-icon' } },
          // { text: 'Id', value: 'browsename', width: 80 },
          { text: this.$T('Name'), value: 'displayname' },
          // { text: 'Beh./kap. (t)', value: 'feed.kg', width: 150 },
          { text: this.$T('Volume'), value: 'feed.percent', width: 200, custom: { component: 'bar' } },
          { text: 'Alarm', value: 'nodeid', sortable: false, width: 50, custom: { component: 'alarm-icon' } }
          // {
          //   text: 'Alarm',
          //   value: 'alarmCount.alarms',
          //   width: 50,
          //   sortable: true,
          //   filter: (value) => {
          //     if (this.alarmFilter === 'all') {
          //       return true
          //     }
          //     return value > 0
          //   }
          // }
        ]
      } else {
        headers = [
          { text: '', value: 'connected', width: 50, custom: { component: 'online-icon' } },
          { text: 'Id', value: 'browsename', width: 100 },
          { text: 'Navn', value: 'displayname' },
          { text: 'Alarm', value: 'nodeid', custom: { component: 'alarm-icon' } }
          // {
          //   text: 'Alarm',
          //   value: 'alarmCount.alarms',
          //   width: 50,
          //   sortable: true,
          //   filter: (value) => {
          //     if (this.alarmFilter === 'all') {
          //       return true
          //     }
          //     return value > 0
          //   }
          // }
        ]
      }
      return headers
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
      const locations = await this.getLocations()
      await Promise.all(
        locations.map(async (location) => {
          const data = await this.getData(location.nodeid)
          location.feed = data.feed
          location.connected = data.connected
          location.pos = data.pos
        })
      )
      this.locations = locations
    },
    getData (nodeid) {
      return new Promise(function (resolve, reject) {
        const base = nodeid.split('=')[2]
        const nodes = [
          base + '.silos.feed.kg',
          base + '.silos.feed.capacity',
          base + '.silos.feed.percent',
          base + '.connected',
          base + '.position'
        ]
        top.webMI.data.read(nodes, function (data) {
          const feed = {
            kg: data[0].value,
            capacity: data[1].value,
            percent: data[2].value
          }
          const connected = data[3].value
          const pos = JSON.parse(data[4].value) || { lat: 0, lng: 0 }

          resolve({ feed, connected, pos })
        })
      })
    },
    getLocations () {
      return new Promise((resolve, reject) => {
        const startAddress = this.$route.query.base
        const filter = {
          mapping: ['nodeid:nodeid', 'browsename:browsename', 'displayname:displayname', 'description:description'],
          startAddress,
          endLevel: 0,
          vTypes: ['ObjectTypes.PROJECT']
        }
        top.webMI.data.call('BrowseNodes', filter, function (data) {
          const arr = Object.keys(data).map(function (i) {
            return data[i]
          })
          resolve(arr)
        })
      })
    },
    click (address) {
      this.$router.push({ query: { base: address, display: address + '.default' } })
    },
    itemRowBackground (item) {
      return item.alarms > 0 || !item.connected ? 'inAlarm' : ''
    },
    getAlarms () {}
  }
}
</script>

<style>

</style>
