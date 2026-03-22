<template>
  <div>
    <v-data-table
      v-model="selected"
      :items="sortedAlarms"
      :headers="headers"
      item-key="EventId"
      :height="computedHeight"
      multi-sort
      :fixed-header="true"
      :show-select="true"
      :search="search"
      :disable-pagination="true"
      :hide-default-footer="true"
      mobile-breakpoint="0"
      :show-expand="!$vuetify.breakpoint.smAndDown"
      single-expand
      :expanded.sync="expanded"
      density="compact"
      class="elevation-1"
      _contextmenu:row="show"
    >
      <template #[`body.prepend`]="{ headers }">
        <tr>
          <td v-for="(header, index) in headers.slice(1)" :key="index">
            <!-- <v-text-field density="compact" hide-details :label="header.text" variant="outlined" @keydown.stop="" /> -->
            <v-combobox
              v-if="header.customFilter"
              v-model="filters[header.value]"
              :background-color="filters[header.value] ? '#ffc72c4a' : undefined"
              _clearable
              _multiple
              small-chips
              deletable-chips
              variant="filled"
              density="compact"
              hide-details
              label="Filter"
              outlined
              :items="getFilterItems(header.value)"
              @keydown.stop=""
            />
          </td>
        </tr>
      </template>
      <template #[`item.activetime`]="{ item }">
        {{ formatTimestamp(item.activetime) }}
      </template>

      <template #[`item.display`]="{ item }">
        <v-btn v-if="item.display.length > 0" icon @click="openDisplay(item.display,{ base: item.base},'content')">
          <v-icon>
            mdi-open-in-app
          </v-icon>
        </v-btn>
      </template>

      <template #[`item.eventtext.en`]="{ item }">
        <!-- <div :style="{color:item.Fontcolor || undefined, background: item.Color || undefined}"> -->
        <div :style="{color:getColor(item), background: item.Color || undefined}">
          {{ item.eventtext.en }}
        </div>
      </template>

      <template #[`item.acknowledged`]="{ item }">
        <div v-if="item.stateText == 'active'">
          {{ item.username }}
        </div>
        <div v-else>
          <v-btn small :color="getColor(item)" @click="acknowledge(item)">
            {{ $T('Acknowledge') }}
          </v-btn>
        </div>
      </template>

      <template #[`item.Abbreviation`]="{ item }">
        <v-chip
          :class="getFlash(item) ? 'blink_me' : null"
          :color="getColor(item)"
          dark
          small
        >
          {{ getPriorityText(item) }}
        </v-chip>
      </template>

      <template #[`item.value`]="{ item }">
        {{ typeof item.value == 'number' ? item.value.toFixed(2) : item.value }} {{ item.EngUnit || '' }}
      </template>

      <template #expanded-item="{ item }">
        <td :colspan="headers.length + 1">
          <alarm-info :item="item" />
        </td>
      </template>

      <template #top>
        <v-row v-if="$vuetify.breakpoint.mdAndUp">
          <v-col sm="4">
            <v-text-field
              v-model="search"
              :label="$T('Search')"
              class="mx-4"
              density="compact"
              clearable
              @keydown.stop=""
            />
          </v-col>
          <v-col sm="2">
            <v-select
              v-model="mode"
              density="compact"
              hide-details
              :items="modes"
              :label="$T('Show')"
              variant="outlined"
              :background-color="mode === 'alarms' ? undefined : '#ffc72c4a'"
            />
          </v-col>
        </v-row>
      </template>

      <template #footer>
        <v-divider />
        <div class="pa-3">
          <v-btn color="primary" :disabled="selected.length < 1" @click="acknowledge(selected)">
            {{ $T('Acknowledge') }}
          </v-btn>
          <v-btn color="primary" :disabled="selected.length < 1" @click="shelve(selected)">
            {{ $T('Shelve') }}
          </v-btn>
          <v-btn color="primary" :disabled="selected.length < 1" @click="unshelve(selected)">
            {{ $T('Unshelve') }}
          </v-btn>
        </div>
      </template>

      <template slot="no-data">
        <v-alert color="success" icon="mdi-smile">
          {{ $T('No events') }}
        </v-alert>
      </template>
      <template slot="no-results">
        <v-alert
          v-if="locationFilter.length === 0"
          :value="true"
          color="error"
          icon="fas fa-exclamation-triangle"
        >
          Your search - "{{ search }}" - did not match any results.
        </v-alert>
        <v-alert
          v-if="locationFilter.length > 0"
          :value="true"
          color="error"
          icon="fas fa-exclamation-triangle"
        >
          No events for chosen location
        </v-alert>
      </template>
    </v-data-table>
    <!-- <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list density="compact">
        <v-list-item
          v-for="(menuItem, index) in menuItems"
          :key="index"
          :disabled="menuItem.disabled(selectedAlarm)"
          @click="menuItem.func(selectedAlarm)"
        >
          <v-list-item-icon>
            <v-icon class="mr-2">
              {{ menuItem.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->
    <comment ref="comment" />
    <shelve ref="shelve" />
  </div>
</template>

<script>
import comment from '../dialogComment'
import shelve from '../dialogShelve'
import AlarmInfo from './info.vue'

export default {
  components: {
    comment,
    shelve,
    AlarmInfo
  },
  props: {
    base: {
      type: String,
      default: ''
    },
    filter: {
      type: Object,
      default: () => { return { search: '', locationFilter: [] } }
    },
    height: {
      type: String,
      default: '600'
    },
    fillHeight: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    mode: 0,
    selected: [],
    selectedAlarm: {},
    showDisabled: false,
    showShelved: false,
    showSuppressed: false,
    alarming: undefined,
    search: '',
    customerFilter: undefined,
    // alarms: [],
    subID: null,
    pagination: { sortBy: 'timestamp', descending: true },
    showMenu: false,
    showDialogDetail: false,
    x: 0,
    y: 0,
    computedHeight: 600,
    expanded: [],
    // locationFilter: [],
    // statusFilter: [],
    filters: {}
  }),
  computed: {
    getAlarmCount () { return this.$store.getters['alarming/getAlarmCount'] },
    getAlarms () { return this.$store.getters['alarming/getAlarms'] },
    language () { return top.$nuxt.$store.state.atvise.language || 'nb' },
    modes () {
      return [
        {
          text: this.$T('Events'),
          value: 'alarms'
        },
        {
          text: this.$T('Shelved'),
          value: 'shelved'
        }
      ]
    },
    // uniqLocations () {
    //   const temp = this.$lodash.uniqBy(this.sortedAlarms, 'location')
    //   return this.$lodash.map(temp, (alarm) => { return alarm.location || 'undefined' })
    // },
    sortedAlarms () {
      const temp = this.getAlarms(undefined, this.mode)
      // Alter tabel data before rendering
      const temp2 = temp.map((alarm) => {
        // alarm.state = this.getState(alarm.state)
        alarm.stateText = this.getState(alarm.state)
        // alarm.activetime = new Date(alarm.activetime).toLocaleString()
        return alarm
      })

      // Filters on top of table
      return temp2.filter((item) => {
        // every is like forEach, but stops when false is returned
        return Object.keys(this.filters).every((i) => {
          const filter = this.$lodash.get(this.filters, i, '')
          if (filter?.length === 0 || filter === null) {
            return true
          } else {
            // res = filter?.toString().includes(this.$lodash.get(item, i))
            return filter?.toString() === this.$lodash.get(item, i)
          }
        })
      })
    },
    menuItems () {
      const arr = []
      arr.push({
        text: 'Acknowledge',
        icon: 'mdi-check',
        func: this.acknowledge,
        disabled (alarm) { return alarm.acknowledged }
      })
      arr.push({
        text: 'Add comment',
        icon: 'mdi-message',
        func: this.comment,
        disabled (alarm) {
          return alarm.Comment ? alarm.Comment.en.length > 0 : false
        }
      })
      arr.push({
        text: 'Add ticket',
        icon: 'mdi-ticket',
        func: this.addTicket,
        disabled (alarm) {
          return alarm.Comment ? alarm.Comment.en.startsWith('ticket:') : false
        }
      })
      return arr
    },
    headers () {
      let headers = [
        { text: 'Base', value: 'SourceNode', groupable: false, filterable: true, align: ' d-none' }, // d-none skjuler kolonne men gjør at den fortsatt er søkbar
        { text: this.$T('Time'), value: 'activetime', groupable: false, filterable: true, width: 100 }
      ]

      const extraHeaders = this.$lodash.get(top.webMIConfig, 'nuxt.alarmList.extraItems', [])
      extraHeaders.forEach((item) => {
        headers.push({
          text: this.$T(item.text),
          value: item.value,
          // groupable: item.groupable,
          // filterable: item.filterable,
          width: item.width || null,
          customFilter: { value: '' }
        })
      })

      headers = [
        ...headers,
        // {
        //   text: 'Kunde',
        //   value: 'customer',
        //   width: 150
        // },
        // {
        //   text: 'Lokasjon',
        //   value: 'location',
        //   width: 210
        // },
        // { text: 'Enhet', value: 'device', groupable: false, width: 100 },
        // { text: this.$T('Site'), value: 'siteName', customFilter: { value: '' } },
        // { text: this.$T('Building'), value: 'buildingName', customFilter: { value: '' } },
        // { text: this.$T('Room'), value: 'room', customFilter: { value: '' } },
        // { text: this.$T('System'), value: 'systemName', customFilter: { value: '' } },
        // { text: this.$T('Component'), value: 'componentName', customFilter: { value: '' } },
        { text: this.$T('Event text'), value: 'eventtext.' + this.language, groupable: false },
        { text: this.$T('View'), value: 'display', groupable: false, width: 80 },
        { text: this.$T('Value'), value: 'value', groupable: false, filterable: false, width: 100 },
        {
          text: this.$T('Status'),
          value: 'stateText',
          groupable: false,
          width: 120,
          customFilter: { value: '' }
        },
        { text: this.$T('Priority'), value: 'Abbreviation', groupable: false, width: 120, customFilter: { value: this.$lodash.get(this.filter, 'priority', '') } },
        { text: this.$T('Acknowledge(d)'), value: 'acknowledged', groupable: false, filterable: true, width: 130 }
      ]
      return headers
    }
  },
  watch: {
    showDisabled () {
      this.selected = []
    },
    filter: {
      immediate: true,
      handler () {
        this.search = this.filter.search || ''
        this.mode = this.filter.mode || 'alarms'
        this.locationFilter = this.filter.locationFilter || []
      },
      deep: true
    },
    search () {
      this.expanded = []
    },
    headers: {
      immediate: true,
      handler (value) {
        value.forEach((item) => {
          if (item.customFilter) {
            this.hasFilters = true
            const value = item.customFilter.value || null
            // console.log('register filter:', item.value)
            this.$set(this.filters, item.value, value)
            // this.filters[item.value] = []
          }
        })
      }
    }
  },
  mounted () {
    this.handleResize()
    // this.alarming = new ApiAlarm(this)
  },
  destroyed () {
  },
  methods: {
    openDisplay (display, args, iframe) {
      // top.webMI.display.openDisplay(display, args, iframe)
      const base = display.split('.').slice(0, -1).join('.')
      this.$router.push({ query: { display, base } })
      this.$emit('close')
      // this.$router.push({ query: { display, args: JSON.stringify({}), iframe: 'content' } })
    },
    getPriorityText (item) {
      if (item.Abbreviation) {
        return item.Abbreviation
      }
      switch (item.priority) {
        case 201:
          return 'Info'
        case 401:
          return 'Warn'
        case 601:
          return 'Alarm'
        case 701:
          return '!Err'
        default:
          return '!'
      }
    },
    handleResize () {
      this.computedHeight = this.fillHeight ? window.innerHeight - 135 : this.height
    },
    itemRowBackground (item) {
      return item.priority > 700 ? 'alarmStyle' : 'warnStyle'
    },
    getFlash (item) {
      if (item.stateText === 'ACTIVE!' && item.Flashtimeack) {
        return true
      }
      return false
    },
    getColor (item) {
      const defaultColor = this.$lodash.get(item, 'Fontcolor', '#ff671f')
      if (item.stateText === 'ACTIVE!') {
        return this.$lodash.get(item, 'State1FontColor', defaultColor)
      }
      if (item.stateText === 'active') {
        return this.$lodash.get(item, 'State2FontColor', defaultColor)
      }
      if (item.stateText === 'INACTIVE!') {
        return this.$lodash.get(item, 'State3FontColor', defaultColor)
      }
      return defaultColor
    },
    clickAction (e) {
      alert('clicked')
    },
    showDetail (alarm) {
      this.selectedAlarm = alarm
      this.showDialogDetail = true
    },
    show (e, item) {
      this.selectedAlarm = item
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    },
    async acknowledge (alarm) {
      let address
      if (Array.isArray(alarm)) {
        address = alarm.map((alm) => { return alm.address })
      } else {
        address = alarm.address
      }
      this.selected = []
      const comment = await this.$refs.comment.open('Acknowledge')
      if (comment) {
        // this.alarming.acknowledge(address, { comment }).then((data) => {
        //   this.$emit('update')
        // })
        this.$store.dispatch('alarming/acknowledge', { address, comment })
        this.$emit('update')
      } else {
        // console.log('ack canceled')
      }
    },
    async shelve (alarm) {
      let address
      const time = await this.$refs.shelve.open('Shelve')
      console.log(time)
      if (time >= -1) {
        if (Array.isArray(alarm)) {
          address = alarm.map((alm) => { return alm.address })
        } else {
          address = alarm.address
        }
        this.selected = []
        this.$store.dispatch('alarming/shelve', { address, time })
        this.$emit('update')
      }
      // this.alarming.shelve(address, {}).then((data) => {
      //   this.$emit('update')
      // })
    },
    unshelve (alarm) {
      let address
      if (Array.isArray(alarm)) {
        address = alarm.map((alm) => { return alm.address })
      } else {
        address = alarm.address
      }
      this.selected = []
      this.$store.dispatch('alarming/unshelve', { address })
      this.$emit('update')
      // this.alarming.unshelve(address, {}).then((data) => {
      //   this.$emit('update')
      // })
    },
    async comment (alarm) {
      // if (Array.isArray(address)) {
      //   address = address.map((adr) => { return adr.address })
      // }
      this.selected = []
      const comment = await this.$refs.comment.open('Add comment')
      // console.log('Comment:', comment)
      if (comment) {
        this.alarming.comment(alarm.address, { comment })
      } else {
        // console.log('comment canceled')
      }
    },
    async addTicket (alarm) {
      this.selected = []
      const comment = await this.$refs.comment.open('Add comment')
      if (comment) {
        // const res =
        await this.alarming.addTicket(alarm, { comment })
        // console.log(res)
      } else {
        // console.log('add ticket canceled')
      }
    },
    getState (state) {
      switch (state) {
        case 0:
          return 'Inactive'
        case 1:
          return 'ACTIVE!'
        case 2:
          return 'active'
        case 3:
          return 'INACTIVE!'
        case 5:
          return '(IN)ACTIVE!'
      }
      return 'undefined'
    },
    getFilterItems (key) {
      const temp = this.sortedAlarms.map((item) => { return this.$lodash.get(item, key, '') })
      return this.$lodash(temp).uniq().compact().sort().value()
    },
    formatTimestamp (timestamp) {
      const useUTC = this.$lodash.get(top.webMIConfig, 'nuxt.useUTC', false)
      if (useUTC) {
        return new Date(timestamp).toISOString().split('.')[0] + 'Z'
      } else {
        return new Date(timestamp).toLocaleString()
      }
    }
  }
}
</script>

<style>
.blink_me {
  animation: blinker 1s linear infinite;
  /* animation: blinker 1000ms cubic-bezier(1, 0, 0, 1) infinite; */
}

@keyframes blinker {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1
  }
}
</style>
