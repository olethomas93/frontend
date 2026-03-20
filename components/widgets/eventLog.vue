<template>
  <v-card>
    <v-container :fluid="true">
      <v-row>
        <v-col cols="12" md="3">
          <form-date-time-picker v-model="from"  :outlined="true" :label="$T('From')" :hide-details="true" />
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
            @change="items=[]"
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
        <v-col cols="12">
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
            <template #[`item.value`]="{item}">
              <div style="overflow:hidden;max-width:150px;text-overflow: ellipsis;">
                {{ item.value }}
              </div>
            </template>
            <template #expanded-item="{item}">
              <td :colspan="headers.length">
                <pre>{{ JSON.stringify(item, null, 2) }}</pre>
              </td>
            </template>
            <template #[`header.system`]="{}">
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
            <template #[`header.component`]="{}">
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
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    }
  },
  data () {
    return {
      loading: true,
      locationFilter: '',
      componentFilter: '',
      hideDetails: true,
      from: '',
      to: '',
      filterBase: 'AGENT.OBJECTS',
      selected: [],
      items: [],
      types: [
        {
          text: this.$T('Alarm logs'),
          value: 'v:2'
        },
        {
          text: this.$T('Event logs'),
          value: 'v:3'
        }
      ],
      selectedType: 'v:2'
    }
  },
  computed: {
    headers () {
      const headers = [
        { text: this.$T('Pri'), value: 'priority' },
        { text: this.$T('Time'), value: 'timestamp' }
      ]
      if (this.selectedType === 'v:2') {
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
      }
      const headers2 = [
        { text: this.$T('Event'), value: 'eventtext.nb' },
        { text: this.$T('Value'), value: 'value' },
        { text: this.$T('Comment'), value: 'Comment.nb' },
        { text: this.$T('State'), value: 'ActiveState.nb' },
        { text: this.$T('User'), value: 'username' }
      ]

      return [...headers, ...headers2]
    }
  },
  mounted () {
    const base = this.base.split('.')
    this.filterBase = base.join('.')
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
      if (filter.type[0] === 'v:3') {
        filter.SourceName = ['g:Server/WebAccess/http*', 'g:Server/WebAccess/Log*']
      }
      filter.timestamp = ['n:>=' + from + '<' + to]
      filter.address = [`g:${this.filterBase}.*`]
      // filter.select = ['v:base', 'v:priority', 'v:timestamp', 'v:eventtext', 'v:value', 'v:system', 'v:component', 'v:EventId', 'v:address', 'v:Comment']
      // filter.numrows = 10
      const self = this
      top.webMI.data.queryFilter(filter, function (e) {
        const items = e.result.map(function (alarm) {
          alarm.timestamp = new Date(alarm.timestamp).toLocaleString()
          const language = 'nb'
          if (alarm.eventtext?.nb) {
            // eslint-disable-next-line no-useless-escape
            const toReplace = alarm.eventtext[language].match(/(?<=\%\().+?(?=\))/g) // Finn alle tilfeller av %(....)
            if (toReplace) {
              toReplace.forEach((text) => {
                const newText = typeof alarm[text] === 'object' ? alarm[text][language] : alarm[text]
                alarm.eventtext.nb = alarm.eventtext.nb.replace(`%(${text})`, newText)
              })
            }
          }
          return alarm
        })
        self.items = items
        self.loading = false
      })
    },
    setDefaultDates () {
      this.to = new Date().toISOString().split('T')[0] + ' ' + '23:59'
      this.from = new Date().toISOString().split('T')[0] + ' ' + '00:00'
    }
  }
}
</script>

<style>

</style>
