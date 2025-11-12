<template>
  <v-btn
    :color="status === setValue ? onColor : offColor"
    :loading="loading"
    v-bind="$attrs"
    @click="fireEvent"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: ''
    },
    setValue: {
      type: [Number],
      default: 0
    },
    statusNode: {
      type: String,
      default: undefined
    },
    onColor: {
      type: String,
      default: 'success'
    },
    offColor: {
      type: String,
      default: undefined
    },
    timeoutMs: {
      type: Number,
      default: 5000
    }
  },
  data: () => ({
    status: -1,
    loading: false,
    timeout: undefined,
    subs: []
  }),
  watch: {
    loading (val) {
      if (val) {
        this.timeout = setTimeout(() => {
          this.reset()
          // TODO: trigger fault message on screen
          console.log('Timeout')
        }, this.timeoutMs)
      }
    },
    statusNode () {
      const sub = top.webMI.data.subscribe(this.statusNode, (e) => {
        setTimeout(() => {
          this.reset()
          clearTimeout(this.timeout)
          this.status = e.value
        }, 500)
      })
      this.subs.push(sub)
    }
  },
  mounted () {
    if (this.statusNode) {
      const sub = top.webMI.data.subscribe(this.statusNode, (e) => {
        setTimeout(() => {
          this.reset()
          clearTimeout(this.timeout)
          this.status = e.value
        }, 500)
      })
      this.subs.push(sub)
    }
  },
  destroyed () {
    top.webMI.data.unsubscribe(this.subs)
  },
  methods: {
    reset () {
      // Clear loading state and reset command
      this.loading = false
      // top.webMI.data.write(this.base, !this.setValue)
    },
    fireEvent () {
      this.loading = true
      top.webMI.data.write(this.base, this.setValue, (data) => {
        // if (data.errorstring) {
        //   alert(data.errorstring + ' ' + this.base)
        //   this.reset()
        // }
      })
    }
  }
}
</script>

<style>

</style>
