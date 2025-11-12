<template>
  <div>
    <v-badge v-if="badgeValue > 0" :overlap="overlap" :color="badgeColor">
      <span slot="badge">{{ badgeValue }}</span>
      <v-icon v-if="badgeValue > 0">
        {{ alarmIcon }}
      </v-icon>
    </v-badge>
    <v-icon v-else>
      {{ noAlarmIcon }}
    </v-icon>
  </div>
</template>
<script>
export default {
  props: {
    overlap: {
      type: Boolean,
      default: true
    },
    alarmIcon: {
      type: String,
      default: 'mdi-ticket'
    },
    noAlarmIcon: {
      type: String,
      default: 'mdi-ticket'
    },
    badgeColor: {
      type: String,
      default: '#532478'
    }
  },
  data () {
    return {
      interval: undefined,
      badgeValue: 0
    }
  },
  computed: {

  },
  mounted () {
    this.init()
    this.interval = setInterval(this.init, 10000)
  },
  methods: {
    init () {
      this.read('AGENT.OBJECTS.incidentCentral.numberOfIncidents').then((data) => {
        this.badgeValue = data.value.toFixed(0)
      })
    },
    read (node) {
      return new Promise((resolve) => {
        top.webMI.data.read(node, (data) => {
          resolve(data)
        })
      })
    }
  }
}
</script>
