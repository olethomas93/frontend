<template>
  <v-text-field v-model="duration" :label="$T('Duration (minutes)')" @keypress.stop="" />
</template>

<script>
export default {
  props: {
    value: {
      type: [String],
      default: '3600'
    }
  },
  data () {
    return {
      duration: 0
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.duration = Number(val) / 60
      }
    },
    duration (val) {
      this.$emit('input', (val * 60).toString())
    }
  }
}
</script>

<style>

</style>
