<template>
  <v-timeline align-top light>
    <v-overlay absolute :value="loading" style="height:550px">
      <v-progress-circular indeterminate />
    </v-overlay>
    <v-timeline-item v-for="(item) in items" :key="item.Eventid" :color="getColor(item)">
      <v-card :color="getColor(item)">
        <v-card-title class="text-h6" :style="{ color: getFontColor(item) }">
          {{ getAction(item) }}
          <v-spacer />
          <v-icon :style="{ color: getFontColor(item) }">
            {{ getIcon(item) }}
          </v-icon>
        </v-card-title>
        <v-card-subtitle :style="{ color: getFontColor(item) }">
          {{ new Date(item.timestamp).toLocaleString() }}
        </v-card-subtitle>
        <v-card-text :style="{ color: getFontColor(item) }">
          {{ $T('Alarm state') }}: {{ $lodash.get(item.ActiveState, language, '') }}
          <div v-if="getComment(item)">
            {{ $T('User') }}: {{ item.username }}
          </div>
          <div v-if="getComment(item)">
            {{ $T('Comment') }}: {{ $lodash.get(getComment(item), 'message',) || getComment(item) }}
          </div>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: ''
    },
    event: {
      type: Object,
      default: undefined
    },
    SNCOLOR: {
      type: String,
      default: '#532478'
    }
  },
  data () {
    return {
      loading: true,
      items: []
    }
  },
  computed: {
    language () {
      return this.$lodash.get(this.$store.state, 'atvise.language', 'en')
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const address = this.base + '.' + this.event.ticketNumber
      const filter = {
        type: ['v:1'],
        address: [`v:${address}`]
      }
      top.webMI.data.queryFilter(filter, (data) => {
        this.loading = false
        data.result.forEach(a => this.items.push(JSON.parse(a.value)))
      })
    },
    getColor (event) {
      if (event.serviceNowAction) {
        return this.SNCOLOR
      }
      switch (event.state) {
        case 0:
          return '#303030'
        case 1:
          return event.State1FontColor
        case 2:
          return event.State2FontColor
        case 3:
          return event.State3FontColor
        default:
          return ''
      }
      // return this.$lodash.get(alarm, `State${alarm.state}FillColor`) || alarm.Fontcolor // || this.theme.isDark ? '#303030' : 'white'
    },
    getFontColor (event) {
      if (event.serviceNowAction) {
        return '#ffffff'
      }
      switch (event.state) {
        case 0:
          return '#ffffff'
        default:
          return '#303030'
      }
    },
    getIcon (event) {
      if (event.serviceNowAction) {
        return 'mdi-ticket'
      }

      switch (event.state) {
        case 0:
          return 'mdi-check'
        case 1:
          return 'mdi-alarm-light'
        case 2:
          return 'mdi-check'
        case 3:
          return 'mdi-alarm-light-off'
        default:
          return ''
      }
    },
    getAction (event) {
      if (event.serviceNowAction) {
        const message = 'Incident status: ' + event.serviceNow.ticket_status + ', ' + event.serviceNow.status_message
        return message
      }
      if (event.Comment) {
        if (event.Comment.en === 'One Shot Shelved' || event.Comment.en === 'Unshelved') {
          return event.Comment.en
        }
      }
      switch (event.state) {
        case 0:
          return 'Inactive and acknowledged'
        case 1:
          return 'Active unacknowledged'
        case 2:
          return 'Active acknowledged'
        case 3:
          return 'Inactive unacknowledged'
        default:
          return ''
      }
    },
    getComment (event) {
      if (event.Comment) {
        try {
          const temp = JSON.parse(this.$lodash.get(event.Comment, this.language, ''))
          return temp
        } catch (error) {
          return this.$lodash.get(event.Comment, this.language, undefined)
        }
      } else {
        return undefined
      }
    }
  }
}
</script>
