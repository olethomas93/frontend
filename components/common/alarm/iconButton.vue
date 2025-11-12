<template>
  <div>
    <v-btn v-show="alarmCount.alarms > 0 || always" text icon @click.stop="openDialog">
      <v-badge :overlap="overlap" :color="alarmCount.alarms > 0 ? alarmCount.color : 'transparent'">
        <span slot="badge">{{ alarmCount.alarms > 0 ? alarmCount.alarms : '' }}</span>
        <v-icon v-if="alarmCount.unacked > 0" _color="error" :class="alarmCount.flash ? 'blink_me' : null">
          mdi-bell-ring
        </v-icon>
        <v-icon v-else>
          mdi-bell-outline
        </v-icon>
      </v-badge>
    <!-- </div> -->
    </v-btn>
    <v-icon v-if="alarmCount.alarms === 0 && noAlarmIcon && !always">
      {{ noAlarmIcon }}
    </v-icon>
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
      default: false
    },
    nodeId: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    showShelved: {
      type: Boolean,
      default: false
    },
    noAlarmIcon: {
      type: String,
      default: ' '
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
      return this.getAlarmCount(this.nodeId, this.showShelved, this.priorityFrom, this.priorityTo, this.onlyActive)
    }
  },
  methods: {
    openDialog () {
      this.$eventBus.$emit('alarmDialog', { cmd: 'open', filter: { search: this.nodeId } })
    }
  }
}
</script>

<style>
</style>
