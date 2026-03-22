<template>
  <div>
    <v-btn v-show="alarmCount.alarms > 0 || always" text icon @click.stop="$eventBus.$emit('alarmDialog',{cmd: 'open', filter: {search: base }})">
      <v-badge :overlap="overlap" :color="alarmCount.alarms > 0 ? alarmCount.color : 'transparent'">
        <span slot="badge">{{ alarmCount.alarms > 0 ? alarmCount.alarms : '' }}</span>
        <v-icon v-if="alarmCount.unacked > 0" _color="error" :class="alarmCount.flash ? 'blink_me' : null">
          mdi-bell-ring
        </v-icon>
        <v-icon v-else>
          mdi-bell-outline
        </v-icon>
      </v-badge>
    </v-btn>
    <v-icon v-if="alarmCount.alarms === 0 && noAlarmIcon">
      {{ noAlarmIcon }}
    </v-icon>
  </div>
</template>

<script>
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
    base: {
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
    }
  },
  data () {
    return {
      interval: undefined
    }
  },
  computed: {
    getAlarmCount () { return this.$store.getters['alarming/getAlarmCount'] },
    alarmCount () {
      return this.getAlarmCount(this.base, this.showShelved)
    }
  }
}
</script>

<style>

</style>
