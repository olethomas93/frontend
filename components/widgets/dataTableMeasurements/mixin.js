export default {
  props: {
    item: {
      type: Object,
      default: undefined
    },
    maxWidth: {
      type: String,
      default: '200px'
    }
  },
  watch: {
    item: {
      deep: true,
      handler (value) {
        top.webMI.data.unsubscribe(this.sub)
        this.subscribe()
      }
    }
  },
  data () {
    return {
      value: undefined,
      sub: undefined,
      status: undefined
    }
  },
  mounted () {
    this.subscribe()
  },
  destroyed () {
    top.webMI.data.unsubscribe(this.sub)
  },
  methods: {
    subscribe () {
      this.sub = top.webMI.data.subscribe(this.item.nodeid, (data) => {
        // debugger
        this.value = data.value
        this.status = data.status
      })
    }
  }
}
