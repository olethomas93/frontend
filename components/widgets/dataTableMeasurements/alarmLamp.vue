<template>
  <div>
    <v-tooltip open-delay="500" :right="true" :color="alarmCount.alarms ? alarmCount.color : defaultColor">
      <template #activator="{ props }">
        <v-avatar v-if="alarmCount.alarms > 0" :class="alarmCount.flash ? 'blink_me' : null" :color="alarmCount.color" :size="size" v-bind="props">
        </v-avatar>
        <v-avatar v-else :class="alarmCount.flash ? 'blink_me' : null" :color="defaultColor" :size="size" v-bind="props">
        </v-avatar>
      </template>
      <span>{{ alarmCount.alarms ? tooltipText.on : tooltipText.off }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    showShelved: {
      type: Boolean,
      default: false
    },
    tooltipText: {
      type: Object,
      default: () => { return { on: 'Alarm', off: 'No alarm' } }
    },
    defaultColor: {
      type: String,
      default: 'grey'
    },
    size: {
      type: Number,
      default: 25
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
      return this.getAlarmCount(this.$attrs.item.nodeid, this.showShelved)
    }
  }
}
</script>

<style>

</style>
