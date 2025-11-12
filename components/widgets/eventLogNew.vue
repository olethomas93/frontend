<template>
  <v-card>
    <v-expansion-panels v-model="panels">
      <v-expansion-panel @click.stop="">
        <v-expansion-panel-header>
          <v-row>
            <v-col cols="12" md="3">
              <form-date-time-picker v-model="from" :dense="true" :outlined="true" :label="$T('From')" :hide-details="true" />
            </v-col>
            <v-col cols="12" md="3">
              <form-date-time-picker v-model="to" :dense="true" :outlined="true" :label="$T('To')" :hide-details="true" />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedType"
                :dense="true"
                :outlined="true"
                :items="types"
                :label="$T('Type')"
                :hide-details="true"
                @change="items=[]"
                @click.stop=""
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-btn :large="false" @click.stop="search">
                {{ $T('Search') }}
                <v-icon :right="true">
                  mdi-magnify
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <template #actions>
            <v-btn>
              {{ $T('Advanced') }}
            </v-btn>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="3">
              <v-select
                v-model="filterPriority"
                dense
                hide-details
                outlined
                multiple
                chips
                small-chips
                deletable-chips
                :label="$T('Category')"
                :items="_categories"
              />
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="filterArea"
                dense
                hide-details
                outlined
                chips
                small-chips
                deletable-chips
                :label="$T('Area')"
                :items="areas"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-if="filterArea"
                v-model="filterSystem"
                dense
                hide-details
                outlined
                clearable
                :label="$T('System')"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <data-table
      ref="table"
      :items="items"
      :headers="headers"
      :hide-footer="false"
      :table-props="tableProps"
    >
      <template #expanded-item="{ item }">
        <td v-if="selectedType === 'v:2'" :colspan="headers.length + 1">
          <alarm-info :item="item" />
        </td>
        <td v-else :colspan="headers.length">
          <pre>{{ JSON.stringify(item, null, 2) }}</pre>
        </td>
      </template>
      <template #[`footer.prepend`]>
        <Export :items="$refs.table.filteredItems" />
      </template>
    </data-table>
  </v-card>
</template>

<script>
import Export from './eventLog/export.vue'
import AlarmInfo from '@/components/common/alarm/info.vue'

export default {
  components: {
    AlarmInfo,
    Export
  },
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    }
  },
  data () {
    return {
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
      selectedType: 'v:2',
      tableProps: {
        showExpand: true,
        showDefaultFooter: true,
        itemsPerPage: 10,
        itemKey: 'EventId',
        sortDesc: true,
        sortBy: 'timestamp',
        loading: true
      },
      panels: undefined,
      areas: [
        {
          text: 'BAS',
          value: 'bas'
        },
        {
          text: 'PAS',
          value: 'pas'
        },
        {
          text: 'EDS',
          value: 'eds'
        },
        {
          text: 'FOU',
          value: 'FOU'
        },
        {
          text: 'SYS',
          value: 'sys'
        }
      ],
      filterPriority: undefined,
      filterArea: undefined,
      filterSystem: ''
    }
  },
  computed: {
    advanced () {
      return this.panels === 0
    },
    categories () {
      return this.$store.state.alarming.categories
    },
    _categories () {
      return this.categories.map((item) => {
        return {
          text: this.$lodash.get(item, 'childs.Abbreviation.value', item.displayname),
          value: this.$lodash.get(item, 'childs.severity.value', 1)
        }
      })
    },
    headers () {
      const headers = []
      if (this.selectedType === 'v:2') {
        headers.push({ text: this.$T('Time'), value: 'timestamp', width: 200 })
        headers.push({
          text: this.$T('Area'),
          value: 'area',
          sortable: false,
          width: 160,
          customFilter: { value: undefined }
        })
        headers.push({
          text: this.$T('System'),
          value: 'system',
          sortable: false,
          width: 180,
          customFilter: { value: undefined }
        })
        headers.push({
          text: this.$T('Component'),
          value: 'component',
          sortable: false,
          width: 180,
          customFilter: { value: undefined }
        })
        headers.push({ text: this.$T('Event'), value: 'eventtext.' + this.lang, width: 200 })
        headers.push({ text: this.$T('Value'), value: 'value', width: 100 })
        headers.push({ text: this.$T('State'), value: 'ActiveState.' + this.lang, width: 130, customFilter: {} })
        headers.push({ text: this.$T('Category'), value: 'category', width: 160, customFilter: {} })
        headers.push({ text: this.$T('User'), value: 'username', width: 100, customFilter: {} })
        headers.push({ text: this.$T('Comment'), value: 'Comment.' + this.lang, width: 150 })
      } else {
        headers.push({ text: this.$T('Time'), value: 'timestamp', width: 200 })
        headers.push({ text: this.$T('Address'), value: 'address' })
        headers.push({ text: this.$T('Event'), value: 'eventtext.' + this.lang })
        headers.push({ text: this.$T('Value'), value: 'value', width: 100 })
        headers.push({ text: this.$T('User'), value: 'username', width: 100, customFilter: {} })
      }
      return headers
    },
    lang () {
      return this.$lodash.get(this.$store, 'state.atvise.language', 'en')
    }
  },
  mounted () {
    const base = this.base.split('.')
    this.filterBase = base.join('.')
    this.setDefaultDates()
    this.search()
  },
  methods: {
    getCategory (pri) {
      const category = this.$lodash.filter(this.categories, ['childs.severity.value', pri])
      if (category) {
        return this.$lodash.get(category[0], 'childs.Abbreviation.value', pri)
      } else {
        return pri
      }
    },
    search () {
      this.tableProps.loading = true
      const filter = {}
      filter.type = [this.selectedType] // ["v:2"];
      const from = new Date(this.from).getTime()
      const to = new Date(this.to).getTime()
      filter.timestamp = ['n:>=' + from + '<' + to]
      if (this.advanced && this.filterArea) {
        this.filterSystem = this.filterSystem === null ? '' : this.filterSystem
        filter.address = [`g:${this.filterBase}.${this.filterArea}.${this.filterSystem}*`]
      } else {
        filter.address = [`g:${this.filterBase}.*`]
      }
      if (this.advanced && this.filterPriority) {
        filter.priority = this.filterPriority.map((item) => {
          return `v:${item}`
        })
        // filter.priority = [`v:${this.filterPriority}`]
      }
      if (filter.type[0] === 'v:3') {
        delete filter.address
        // filter.SourceName = ['g:Server/WebAccess/http*', 'g:Server/WebAccess/Log*']
      }
      // filter.select = ['v:base', 'v:priority', 'v:timestamp', 'v:eventtext', 'v:value', 'v:system', 'v:component', 'v:EventId', 'v:address', 'v:Comment']
      // filter.numrows = 10
      console.log(filter)
      const self = this
      top.webMI.data.queryFilter(filter, (e) => {
        this.tableProps.loading = false
        const items = e.result.map((alarm) => {
          alarm.timestamp = new Date(alarm.timestamp).toLocaleString()
          alarm.category = this.getCategory(alarm.priority)
          // const language = 'nb'
          // if (alarm.eventtext?.nb) {
          //   // eslint-disable-next-line no-useless-escape
          //   const toReplace = alarm.eventtext[language].match(/(?<=\%\().+?(?=\))/g) // Finn alle tilfeller av %(....)
          //   if (toReplace) {
          //     toReplace.forEach((text) => {
          //       const newText = typeof alarm[text] === 'object' ? alarm[text][language] : alarm[text]
          //       alarm.eventtext.nb = alarm.eventtext.nb.replace(`%(${text})`, newText)
          //     })
          //   }
          // }
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
