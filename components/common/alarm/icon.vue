<template>
  <div>
    <v-badge :overlap="overlap" :color="badgeColor">
      <!-- <span slot="badge">{{ alarmCount.alarms > 0 ? alarmCount.alarms : '' }}</span> -->
      <span slot="badge">{{ badgeValue }}</span>
      <v-icon v-if="alarmCount.unacked > 0 && mode == 'alarms'" :class="alarmCount.flash ? 'blink_me' : null">
        {{ alarmIcon }}
      </v-icon>
      <v-icon v-else>
        {{ noAlarmIcon }}
      </v-icon>
    </v-badge>
    <!-- <v-icon v-if="alarmCount.alarms === 0 && noAlarmIcon && !always">
      {{ noAlarmIcon }}
    </v-icon> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import trendVue from '../widgets/trend.vue'

export default {
  props: {
    always: {
      type: Boolean,
      default: false
    },
    overlap: {
      type: Boolean,
      default: true
    },
    nodeId: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    alarmIcon: {
      type: String,
      default: 'mdi-bell-ring'
    },
    noAlarmIcon: {
      type: String,
      default: 'mdi-bell-outline'
    },
    priorityFrom: {
      type: Number,
      default: 0
    },
    priorityTo: {
      type: Number,
      default: 999
    },
    onlyActive: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'alarms'
    }
  },
  data () {
    return {
      interval: undefined
    }
  },
  computed: {
    ...mapGetters('alarming', [
      'getAlarmCount'
    ]),
    alarmCount () {
      return this.getAlarmCount(this.nodeId, this.mode, this.priorityFrom, this.priorityTo, this.onlyActive)
    },
    badgeValue () {
      // if (this.mode === 'shelved') {
      //   return this.alarmCount.shelved > 0 ? this.alarmCount.shelved : ''
      // } else {
      return this.alarmCount.alarms > 0 ? this.alarmCount.alarms : ''
      // }
    },
    badgeColor () {
      return this.alarmCount.alarms > 0 ? this.alarmCount.color : 'transparent'
      // if (this.mode === 'shelved') {
      //   return this.alarmCount.shelved > 0 ? this.alarmCount.color + 'aa' : 'transparent'
      // } else {
      // }
    }
  },
  methods: {
    // openDialog () {
    //   this.$eventBus.$emit('alarmDialog', { cmd: 'open', filter: { search: this.nodeId } })
    // }
  }
}
</script>

<style>
</style>
