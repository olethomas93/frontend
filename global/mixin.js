// Legges til på widgets for å ta seg av abbonering av verdier
import { APIservice } from '@/global/APIService.js'

export const widget = {
  inject: ['theme'],
  // props: ["base", "eventBus","settings","preview"],
  props: {
    base: {
      type: String
    },
    eventBus: [Object],
    settings: [Object, String],
    preview: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    subId: 0,
    values: [],
    // args: {},
    nodeList: [],
    timestamp: '',
    interval: undefined,
    int: undefined,
    apiService: undefined,
    red: '#ff671f',
    green: '#26d07c',
    blue: '#00a3e0',
    orange: '#ffc72c'
  }),
  methods: {
    subscribe () {
      // Abbonerer på verdier fra Atvise
      if (!this.preview) {
        const self = this

        this.read()
        this.interval = setInterval(() => {
          this.read()
        }, 60000)

        // Connect to eventBus
        if (this.eventBus !== undefined) {
          this.eventBus.$on('widgetData', function (data) {
            // eslint-disable-next-line no-console
            console.log('eventBus data recived:', data)
            if (data.visning) {
              self.visning = data.visning
            }
          })
        }
      }
    },
    async write (nodes) {
      try {
        await this.apiService.write(nodes)
      } catch (error) {
        alert(error.error)
      }
    },
    async read () {
      // console.log(this.nodes)
      try {
        if (this.nodes.length > 0) {
          const nodes = this.nodes
          const data = await this.apiService.read(nodes)
          this.disabled = false
          this.nodeList = data
          for (const i in data) {
            let temp = this.values[i].split('.')
            temp = temp[temp.length - 1]
            if (data[i].value.value) {
              this[temp] = data[i].value.value
            }
          }
        }

        // this.$socket.emit('read', { nodes: this.nodes }, (test, data) => {
        //   // eslint-disable-next-line no-console
        //   console.log(data)
        //   this.disabled = false
        //   this.nodeList = data
        //   for (const i in data) {
        //     let temp = this.values[i].split('.')
        //     temp = temp[temp.length - 1]
        //     this[temp] = data[i].value.value
        //   }
        // })
      } catch (error) {
        return error
      }
    },
    unsubscribe () {
      // console.log("unsubscribe")
      // if (this.subId !== 0) {
      //   top.webMI.data.unsubscribe(this.subId)
      // }
      // console.log("unsub eventBus");
      if (this.eventBus !== undefined) {
        this.eventBus.$off()
      }
    },
    calcTimestamp () {
      // console.log('calcTimestamp')
      try {
        if (this.nodeList) {
          this.timestamp = 'undefined'// this.$moment(new Date(this.nodeList[0].sourceTimestamp)).fromNow()
          this.$emit('timestamp', this.timestamp)
        }
      } catch (error) {
        // console.error(error)
      }
    },
    startInterval () {
      this.calcTimestamp()
      this.int = setInterval(() => {
        // console.log('calc timestamp')
        this.calcTimestamp()
      }, 30000)
    }
  },
  computed: {
    nodes () {
      const temp = []
      for (const e in this.values) {
        // temp.push(this.base + this.item.index + this.values[e])
        // temp.push(this.base + this.values[e])
        // const customerId = 'leroy_aurora'
        // const locationId = this.$route.params.id
        // temp.push(`ns=1;s=AGENT.OBJECTS.customers.${customerId}.${locationId}.${this.base}.${this.values[e]}`)
        if (this.values[e].charAt(0) === '.') {
          temp.push(`${this.base}${this.values[e]}`)
        } else {
          temp.push(`${this.base}.${this.values[e]}`)
        }
      }
      return temp
    },
    darkColor () {
      return this.theme.isDark ? '#ffffff' : 'rgba(0,0,0,0.7)'
    },
    lightColor () {
      return this.theme.isDark ? 'rgba(0,0,0,0.7)' : '#ffffff'
    }
  },
  created () {
    // this.$moment.locale('nb')
    this.apiService = new APIservice(this)
    this.$nextTick(function () {
      this.subscribe()
    })
  },
  destroyed () {
    this.unsubscribe()

    // Stop utregning av timestamp
    if (this.int) { clearInterval(this.int) }

    // Stop lesing av verdier
    if (this.interval) { clearInterval(this.interval) }
  },
  mounted () {

  },
  watch: {
    base () {
      this.unsubscribe()
      this.subscribe()
    },
    nodeList () {
      if (!this.int) {
        this.startInterval()
      }
    }
  }
}
