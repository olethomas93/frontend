<template>
  <v-card>
    <v-container :fluid="true">
      <v-row>
        <v-col cols="12" md="3">
          <form-date-time-picker
            v-model="from"
            
            :outlined="true"
            :label="$T('From')"
            :hide-details="true"
          />
        </v-col>
        <v-col cols="12" md="3">
          <form-date-time-picker v-model="to"  :outlined="true" :label="$T('To')" :hide-details="true" />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedType"
            
            :outlined="true"
            :items="types"
            :label="$T('Type')"
            :hide-details="true"
            @change="items = []"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-btn :large="true" @click="search">
            {{ $T('Search') }}
            <v-icon :right="true">
              mdi-magnify
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container :fluid="true">
      <v-data-table
        v-model="selected"
        :sort-desc="true"
        sort-by="timestamp"
        :headers="headers"
        :items="items"
        :loading="loading"
        :show-expand="true"
        :fixed-header="false"
        mobile-breakpoint="0"
        item-key="EventId"
      >
        <template #[`item.Abbreviation`]="{ item }">
          <v-chip :color="item.Fontcolor" dark>
            {{ item.Abbreviation }}
          </v-chip>
        </template>
        <template #[`item.value`]="{ item }">
          <div style="overflow:hidden;max-width:150px;text-overflow: ellipsis;">
            {{ item.value }}
          </div>
        </template>
        <template #expanded-item="{ item }">
          <td :colspan="headers.length">
            <pre>{{ JSON.stringify(item, null, 2) }}</pre>
          </td>
        </template>
        <template #[`header.system`]="{ }">
          <v-text-field
            v-model="locationFilter"
            density="compact"
            :outlined="true"
            :label="$T('System')"
            :hide-details="true"
            @click.stop=""
            @keydown.stop=""
          />
        </template>
        <template #[`header.component`]="{ }">
          <v-text-field
            v-model="componentFilter"
            density="compact"
            :outlined="true"
            :label="$T('Component')"
            :hide-details="hideDetails"
            @click.stop=""
            @keydown.stop=""
          />
        </template>
        <template #[`item.display`]="{ item }">
          <v-btn v-if="item.display.length > 0" icon @click="openDisplay(item.display)">
            <v-icon>
              mdi-open-in-app
            </v-icon>
          </v-btn>
        </template>
        <template #[`header.ticketNumber`]="{ }">
          <v-text-field
            v-model="ticketNumberFilter"
            density="compact"
            :outlined="true"
            :label="$T('Ticket number')"
            :hide-details="hideDetails"
            @click.stop=""
            @keydown.stop=""
          />
        </template>
        <template #[`item.serviceNow.ticket_url`]="{ item }">
          <v-btn v-if="item.ticketNumber" :color="SNCOLOR" size="x-small" @click="openUrl(item.serviceNow.ticket_url)">
            <v-icon>
              mdi-link-variant
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    SNCOLOR: {
      type: String,
      default: '#532478'
    }
  },
  data () {
    return {
      loading: true,
      locationFilter: '',
      componentFilter: '',
      ticketNumberFilter: '',
      hideDetails: true,
      from: '',
      to: '',
      filterBase: 'AGENT.OBJECTS',
      selected: [],
      items: [],
      types: [
        {
          text: this.$T('ServiceNow logs'),
          value: 'v:1'
        }
      ],
      selectedType: 'v:1'
    }
  },
  computed: {
    headers () {
      const headers = [
        { text: this.$T('Prority'), value: 'Abbreviation' },
        { text: this.$T('Time'), value: 'timestamp' },
        { text: this.$T('Site'), value: 'site' },
        { text: this.$T('Building'), value: 'building' }
      ]
      headers.push({
        text: this.$T('System'),
        value: 'system',
        sortable: false,
        filter: (v) => {
          if (!v) { v = '' }
          // if (!this.locationFilter) return true
          return v.toLowerCase().includes(this.locationFilter.toLowerCase())
        }
      })
      headers.push({
        text: this.$T('Component'),
        value: 'component',
        sortable: false,
        filter: (v) => {
          if (!v) { v = '' }
          // if (!this.locationFilter) return true
          return v.toLowerCase().includes(this.componentFilter.toLowerCase())
        }
      })
      const headers2 = [
        { text: this.$T('Event'), value: 'eventtext.en' },
        { text: this.$T('View'), value: 'display' },
        { text: this.$T('State'), value: 'ActiveState.en' },
        { text: this.$T('Acknowlegde state'), value: 'AckedState.en' },
        { text: this.$T('Comment'), value: 'Comment.en' },
        { text: this.$T('User'), value: 'username' },
        { text: this.$T('ServiceNow status message'), value: 'serviceNow.ticket_status' }
        // { text: this.$T('ServiceNow ID'), value: 'ticketNumber' }
      ]
      headers2.push({
        text: this.$T('Ticket number'),
        value: 'ticketNumber',
        sortable: false,
        filter: (v) => {
          if (!v) { v = '' }
          // if (!this.locationFilter) return true
          return v.toLowerCase().includes(this.ticketNumberFilter.toLowerCase())
        }
      })
      const headers3 = [
        { text: this.$T('Link'), value: 'serviceNow.ticket_url' }
      ]
      return [...headers, ...headers2, ...headers3]
    }
  },
  mounted () {
    // const base = this.base.split('.')
    this.filterBase = this.base
    this.setDefaultDates()
    this.search()
  },
  methods: {
    search () {
      this.loading = true
      const filter = {}
      filter.type = [this.selectedType] // ["v:2"];
      const from = new Date(this.from).getTime()
      const to = new Date(this.to).getTime()
      filter.timestamp = ['n:>=' + from + '<' + to]
      filter.address = [`g:${this.filterBase}`]
      console.log(filter.address)
      // filter.select = ['v:base', 'v:priority', 'v:timestamp', 'v:eventtext', 'v:value', 'v:system', 'v:component', 'v:EventId', 'v:address', 'v:Comment']
      // filter.numrows = 10
      const self = this
      top.webMI.data.queryFilter(filter, function (e) {
        const items = e.result.map(function (event) {
          if (event.value === '[object Object]') {
            return ''
          }
          const eventObj = JSON.parse(event.value)
          event = eventObj
          event.timestamp = new Date(event.timestamp).toLocaleString()
          if (event.serviceNow) {
            event.ticketNumber = event.serviceNow.ticket_number
          }
          return event
        })
        self.items = items
        self.loading = false
      })
    },
    setDefaultDates () {
      this.to = new Date().toISOString().split('T')[0] + ' ' + '23:59'
      this.from = new Date().toISOString().split('T')[0] + ' ' + '00:00'
    },
    openUrl (url) {
      console.log(url)
      window.open(url, '_blank')
    },
    openDisplay (display) {
      const base = display.split('.').slice(0, -1).join('.')
      this.$router.push({ query: { display, base } })
      this.$emit('close')
    }
  }
}
</script>

<style></style>
