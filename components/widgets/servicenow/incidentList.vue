<template>
  <v-container class="max-height-container" :fluid="true" :fill-height="true">
    <v-data-table
      v-model="selected"
      class="elevate fill-height-dynamic-width"
      :items="items"
      sort-by="timestamp"
      :headers="headers"
      :loading="loading"
      hide-default-footer
      :items-per-page="-1"
      single-expand
      item-key="ticketNumber"
      :show-expand="!$vuetify.breakpoint.smAndDown"
    >
      <template #expanded-item="{ item }">
        <td :colspan="headers.length + 1">
          <history :key="item.ticketNumber" :item="item" :base="base" />
        </td>
      </template>
      <template #[`item.Abbreviation`]="{ item }">
        <v-chip :color="item.Fontcolor" dark>
          {{ item.Abbreviation }}
        </v-chip>
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
        <v-btn
          v-if="item.ticketNumber"
          :color="SNCOLOR"
          size="x-small"
          @click="openUrl(item.serviceNow.ticket_url)"
        >
          <v-icon>
            mdi-link-variant
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import History from './history.vue'
export default {
  components: {
    History
  },
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
      const headers = [{
        text: this.$T('Ticket number'),
        value: 'ticketNumber',
        sortable: false,
        width: 100,
        filter: (v) => {
          if (!v) { v = '' }
          // if (!this.locationFilter) return true
          return v.toLowerCase().includes(this.ticketNumberFilter.toLowerCase())
        }
      },
      { text: this.$T('ServiceNow status message'), width: 100, value: 'serviceNow.ticket_status' },
      { text: this.$T('Link'), value: 'serviceNow.ticket_url' },
      { text: this.$T('Prority'), value: 'Abbreviation' },
      { text: this.$T('Last event update'), value: 'timestamp' },
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
        { text: this.$T('User'), value: 'username' }
      ]
      /*
                        const headers3 = [
                            { text: this.$T('Link'), value: 'serviceNow.ticket_url' }
                        ] */
      return [...headers, ...headers2]
    }
  },
  mounted () {
    // const base = this.base.split('.')
    this.init()
  },
  methods: {
    openUrl (url) {
      window.open(url, '_blank')
    },
    openDisplay (display) {
      const base = display.split('.').slice(0, -1).join('.')
      this.$router.push({ query: { display, base } })
      this.$emit('close')
    },
    async init () {
      this.loading = true
      const arrData = await this.getItems()
      this.items = await this.getLastEvent(arrData)
      this.loading = false
    },
    getItems () {
      return new Promise((resolve, reject) => {
        const vTypes = []
        vTypes.push('VariableTypes.PROJECT.serviceNowTicket')
        const filter = {
          startAddress: this.base,
          endLevel: this.browseEndLevel,
          vTypes,
          mapping: ['browsename:browsename', 'displayname:displayname', 'nodeid:nodeid:splitnamespace', 'description:description', 'typeDefinition:typedefinition:splitnamespace', 'value:value']
        }
        top.webMI.data.call('BrowseNodes', filter, (data) => {
          resolve(this.toArray(data))
        })
      })
    },
    toArray (data) {
      return Object.keys(data).map((i) => {
        return data[i]
      })
    },
    getLastEvent (dataItems) {
      return new Promise((resolve, reject) => {
        const items = []
        for (let i = 0; i < dataItems.length; i++) {
          top.webMI.data.read(dataItems[i].nodeid, function (e) {
            const obj = JSON.parse(e.value)
            const timestamp = new Date(obj.timestamp)
            obj.timestamp = timestamp.toLocaleString()
            obj.ticketNumber = obj.serviceNow.ticket_number
            const activeTime = new Date(obj.activetime)
            obj.activetimestring = activeTime.toLocaleString()
            const ticketCreated = new Date(obj.ticket_created)
            obj.ticket_createdString = ticketCreated.toLocaleString()
            items.push(obj)
          })
        }
        resolve(items)
      })
    }
  }
}
</script>

<style scoped>
.max-height-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.fill-height-dynamic-width {
  overflow-y: auto;
  width: 100%;
  align-self: flex-start;
}
</style>
