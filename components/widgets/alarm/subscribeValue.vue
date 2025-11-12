<template>
  <v-text-field
    v-bind="$attrs"
    :value="value"
    class="pa-2"
    type="number"
    width="60"
    style="width:50px"
    @keydown.stop=""
    @change="write"
  />
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      sub: undefined,
      value: 0
    }
  },
  watch: {
    base: {
      handler () {
        this.subscribe()
      },
      immediate: false
    }
  },
  mounted () {
    // this.subscribe()
  },
  destroyed () {
    top.webMI.data.unsubscribe(this.sub)
  },
  methods: {
    subscribe () {
      this.sub = top.webMI.data.subscribe(this.base, (data) => {
        this.value = data.value
      })
    },
    write (val) {
      console.log('write:', val)
      top.webMI.data.write(this.base, val)
    }
  }
}
</script>

<style>

</style>
