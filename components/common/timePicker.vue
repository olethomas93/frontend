<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="time"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="time"
        label="Velg Klokkeslett"
        _prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="{ ...$attrs, ...props }"
      />
    </template>
    <v-time-picker
      v-if="menu"
      v-model="time"
      format="24hr"
      full-width
      value="hh:mm"
      @change="setTime($event)"
    />
  </v-menu>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '00:00'
    }
  },
  data () {
    return {
      time: '', // this.$moment().format('HH:mm'),
      menu: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.time = this.value
      }
    }
  },
  mounted () {
    // this.time = this.value
  },
  methods: {
    setTime (time) {
      this.$emit('time', time)
      this.$emit('input', time)
      this.$refs.menu.save(time)
    }
  }
}
</script>

<style>

</style>
