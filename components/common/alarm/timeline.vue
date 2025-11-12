<template>
  <v-timeline align-top light>
    <v-overlay absolute :value="loading" style="height:250px">
      <v-progress-circular indeterminate />
    </v-overlay>
    <v-timeline-item v-for="(item) in items" :key="item.EventId" :color="getColor(item)">
      <v-card :color="getColor(item)">
        <v-card-title class="text-h6">
          {{ $lodash.get(item.eventtext, language, '') }}
          <v-spacer />
          <v-icon>
            {{ getIcon(item) }}
          </v-icon>
        </v-card-title>
        <v-card-subtitle>
          <!-- {{ new Date(item.ReceiveTime).toLocaleString() }} -->
          {{ formatTimestamp(item.ReceiveTime) }}
        </v-card-subtitle>
        <!-- <v-card-text class="white text--primary"> -->
        <v-card-text>
          {{ $T('Alarm state') }}: {{ $lodash.get(item.ActiveState, language, '') }}
          <!-- <br>
          {{ $T('Acked state') }}: {{ $lodash.get(item.AckedState, 'nb', '') }} -->
          <div>
            {{ $T('User') }}: {{ item.username }}
          </div>
          <div v-if="getComment(item)">
            {{ $T('Group') }}: {{ $lodash.get(getComment(item), 'group',) }}
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
import treeViewVue from '~/components/widgets/treeView.vue'
export default {
  inject: [
    'theme'
  ],
  props: {
    alarm: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      loading: treeViewVue,
      items: []
    }
  },
  computed: {
    language () {
      return this.$lodash.get(this.$store.state, 'atvise.language', 'en')
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getColor (alarm) {
      return this.$lodash.get(alarm, `State${alarm.state}FillColor`) || alarm.Fontcolor // || this.theme.isDark ? '#303030' : 'white'
    },
    getIcon (alarm) {
      const test = this.getComment(alarm)
      if (this.$lodash.get(test, 'sendt', false) === true) {
        return 'mdi-email-alert-outline'
      }

      switch (alarm.state) {
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
    getData () {
      const filter = {
        type: ['v:2'],
        // timestamp: ['n:>=1676934000000<1677020340000'],
        address: [`v:${this.alarm.address}`], // ['v:AGENT.OBJECTS.bas.360.101.RT403.alarm.alarm.alarm'],
        AlarmId: [`v:${this.alarm.AlarmId}`] // ['v:4B0100003B79F463']
      }
      top.webMI.data.queryFilter(filter, (data) => {
        this.loading = false
        this.items = data.result.filter((alarm) => {
          alarm = this.replaceEventText(alarm)
          return this.$lodash.get(alarm.Comment, 'en', '') !== 'Condition created.'
        })
      })
    },
    getComment (alarm) {
      if (alarm.Comment) {
        try {
          const temp = JSON.parse(this.$lodash.get(alarm.Comment, this.language, ''))
          return temp
        } catch (error) {
          return this.$lodash.get(alarm.Comment, this.language, undefined)
        }
      } else {
        return undefined
      }
    },

    replaceEventText (alarm) {
      const language = top.$nuxt.$store.state.atvise.language || 'nb'
      // eslint-disable-next-line no-useless-escape
      try {
        const toReplace = alarm.eventtext[language].match(/(?<=%\().+?(?=\))/g)
        if (toReplace) {
          toReplace.forEach((text) => {
            let replacementValue

            // Check if the placeholder text is an empty string.
            // If so, try to use the value of the empty string key ""
            if (text === '') {
              // Use Object.prototype.hasOwnProperty.call for the empty string key
              if (Object.prototype.hasOwnProperty.call(alarm, '')) {
                replacementValue = alarm['']
              } else {
                // Handle case where the empty string key doesn't exist
                replacementValue = '' // Or a different fallback
              }
              // eslint-disable-next-line brace-style
            }
            // Otherwise, try to find a property on the alarm object that matches the extracted text
            // Use Object.prototype.hasOwnProperty.call for the 'text' key
            else if (Object.prototype.hasOwnProperty.call(alarm, text)) {
              replacementValue = typeof alarm[text] === 'object' ? alarm[text][language] : alarm[text]
              // eslint-disable-next-line brace-style
            }
            // If neither of the above matches, handle it (e.g., use an empty string)
            else {
              replacementValue = '' // Or perhaps text itself: `%(${text})`
            }

            // Ensure replacementValue is not undefined or null before replacing
            let newText = replacementValue !== undefined && replacementValue !== null ? replacementValue : ''
            newText = top.$nuxt.$store.getters['translation/translateText'](`T{${newText}}`)

            // Only replace if newText is not empty (unless replacementValue was explicitly '')
            if (newText !== '' || (newText === '' && replacementValue !== undefined)) {
              alarm.eventtext[language] = alarm.eventtext[language].replace(`%(${text})`, newText)
            }
          })
        }
      } catch (error) {
        console.error('Error during alarm text replacement:', error)
        return alarm // Return original alarm on error
      }
      return alarm
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
.v-timeline-item__dot {
  z-index: 1;
}
</style>
