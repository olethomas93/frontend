<template>
  <v-sparkline :value="value" />
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      value: [],
      int: undefined
    }
  },
  computed: {
  },
  mounted () {
    this.getHistory()
    this.int = setInterval(this.getHistory, 30000)
  },
  unmounted () {
    clearInterval(this.int)
  },
  methods: {
    getHistory () {
      const filter = {
        nodes: [this.item.nodeid],
        from: this.$moment().subtract(0, 'days').toISOString().split('T')[0],
        to: this.$moment().add(1, 'days').toISOString().split('T')[0]
      }
      top.webMI.data.call('JMH_queryFilter', filter, (data) => {
        const value = data.result.reverse()
        this.value = value.slice(-100)
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

<style>

</style>
