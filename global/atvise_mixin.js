// Legges til på widgets for å ta seg av abbonering av verdier
export default {
  props: {
    base: {
      type: String,
      default: ''
    },
    activeNode: {
      type: String,
      default: undefined
    },
    activeValue: {
      type: [String, Boolean, Number],
      default: false
    },
    right: {
      type: String,
      default: undefined
    },
    showDuration: {
      type: Boolean,
      default: false
    },
    durationLimit: {
      type: [Number, String],
      default: 60
    }
    // eventBus: [Object]
  },
  data: () => ({
    value: undefined,
    timestamp: undefined,
    status: 0,
    duration: undefined,
    message: [],
    errors: {
      duration: undefined,
      errorString: undefined,
      status: undefined
    },
    errorMessages: [],
    subs: [],
    activeNodeValue: false,
    hasRight: false
  }),
  mounted () {
    setTimeout(() => {
      if (this.right) {
        this.hasRight = top.webMI.hasRight(this.right.replace('SYSTEM.SECURITY.RIGHTS.', ''))
      } else {
        this.hasRight = true
      }
    }, 500)
    // console.log(this.activeNode)
    // if (this.activeNode) {
    //   console.log('Active node detected')
    //   const sub = top.webMI.data.subscribe(this.activeNode, (e) => {
    //     this.activeNodeValue = e.value
    //   })
    //   this.subs.push(sub)
    // }
  },
  destroyed () {
    top.webMI.data.unsubscribe(this.subs)
  },
  watch: {
    errors: {
      handler (val) {
        // Sets the error message in prioritized order
        if (val.errorString) {
          this.errorMessages = [val.errorString]
        } else if (val.status) {
          this.errorMessages = [val.status]
        } else if (val.duration) {
          this.errorMessages = [val.duration]
        } else {
          this.errorMessages = []
        }
      },
      deep: true
    },
    activeNode () {
      if (this.activeNode) {
        const sub = top.webMI.data.subscribe(this.activeNode, (e) => {
          // console.log(e)
          this.activeNodeValue = e.value
        })
        this.subs.push(sub)
      }
    },
    '$store.state.auth.user' () {
      // console.log('user changed')
      if (this.right) {
        this.hasRight = top.webMI.hasRight(this.right.replace('SYSTEM.SECURITY.RIGHTS.', ''))
      }
    }
  },
  computed: {
    enabled () {
      if (typeof this.activeValue === 'string') {
        if (this.activeValue.match(/[>,<,=,!]/g)) {
          // eslint-disable-next-line no-eval
          return eval(this.activeNodeValue + this.activeValue)
        } else {
          return (this.activeValue === 'true') === this.activeNodeValue
        }
      } else {
        return this.activeValue === this.activeNodeValue
      }
    }
  },
  methods: {
    write (base, value) {
      top.webMI.data.write(base, value, (e) => {
        if (e.errorstring) {
          alert(e.errorstring)
        }
      })
    },
    subscribe (base, callback) {
      const sub = top.webMI.data.subscribe(base, (data) => {
        this.checkErrors(data)
        if (!data.errorstring) {
          this.timestamp = new Date(data.timestamp).getTime()
          this.$moment.locale(this.$store.getters['atvise/getLanguage'])
          this.duration = this.$moment(data.timestamp).fromNow()
          if (this.showDuration) {
            this.message = [this.duration]
          }
          callback(data)
        }
      })
      this.subs.push(sub)
    },
    checkErrors (data) {
      if (data.errorstring) {
        this.errors.errorString = data.errorstring
      } else {
        this.errors.errorString = undefined
      }
      if (data.status > 0) {
        this.errors.status = this.getOPCUAerror(data.status)
      } else {
        this.errors.status = undefined
      }
      // Viser tid siden siste sample som en feil, hvis man overstiger x antall minutt
      if (this.durationLimit > 0) {
        const diff = this.$moment().diff(this.$moment(data.timestamp)) / (1000 * 60)
        if (diff > this.durationLimit) {
          this.errors.duration = this.$moment(data.timestamp).fromNow()
        }
      }
    },
    getOPCUAerror (status) {
      switch (status) {
        case 2148335616:
          return 'Datakilde offline' // 'BadServerNotConnected'
        case 2157838336:
          return 'BadDataUnavailable'
        default:
          return 'error:' + status
      }
    }
  }
}
