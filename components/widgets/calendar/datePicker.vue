<template>
  <div class="d-flex">
    <CommonDatePicker :label="label" :value="date" class="ma-2" v-bind="$attrs" @input="emitDate" />
    <v-spacer />
    <div v-if="!hideTime" style="width:70px">
      <calendar-time-picker :value="time" v-bind="$attrs" @input="emitTime" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String, Date],
      default: 0
    },
    label: {
      type: String,
      default: undefined
    },
    hideTime: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      date: '',
      time: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        const temp = new Date(val)
        this.date = temp.toISOString().split('T')[0]
        this.time = temp.toTimeString().slice(0, 5)
      }
    }
  },
  methods: {
    emitDate (val) {
      this.date = val
      this.emit()
    },
    emitTime (val) {
      this.time = val
      this.emit()
    },
    emit () {
      // const temp = new Date(JSON.parse(JSON.stringify(this.date)))
      const temp = new Date(this.date)
      temp.setHours(Number(this.time.split(':')[0]), Number(this.time.split(':')[1]))
      this.$emit('input', temp.getTime())
    }
  }
}
</script>

<style>

</style>
