<template>
  <plotly-trend :config="innerConfig" :data="data" />
</template>

<script>
import plotlyTrend from '@/components/common/trend/plotlyTrend.vue'

export default {
  name: 'Trend',
  components: {
    plotlyTrend
  },
  props: {
    config: {
      type: [Object, String],
      default: () => { return {} }
    },
    name: {
      type: String,
      default: 'trend'
    }
  },
  data: () => ({
    data: [],
    innerConfig: { height: 400 },
    nodes: [],
    from: undefined,
    to: undefined
  }),
  watch: {
    config: {
      handler () {
        this.setConfig()
      },
      deep: true
    },
    nodes: {
      handler () {
        console.log('nodes changed')
        // this.$delete(this.data, 0)
        this.data = []
        this.nodes.forEach((node, index) => {
          this.getData(node)
        })
      },
      deep: true
    }
  },
  mounted () {
    this.$nuxt.$on('trendChange', this.trendChange)
    this.$nuxt.$on('setTimespan', this.setTimespan)
    setTimeout(this.handleResize, 1000)
    // this.$nuxt.$on('trendChange', (e, f) => {
    //   if (f === this.name) {
    //     console.log(e, f)
    //     switch (e.cmd) {
    //       case 'addPen':
    //         this.nodes.push({
    //           address: e.data.nodeid,
    //           name: e.data.displayname
    //         })
    //         break
    //       case 'removePen':
    //         this.$delete(this.nodes, this.nodes.findIndex(item => item.address === e.data.nodeid))
    //         // this.$delete(this.data, this.nodes.findIndex(item => item.nodeid === e.data.nodeid))
    //     }
    //   }
    // })
    this.setConfig()
    // setInterval(() => {
    //   this.innerConfig.xaxis.range[1] = new Date()
    // }, 1000)
  },
  beforeDestroy () {
    this.$nuxt.$off('trendChange', this.trendChange)
    this.$nuxt.$off('setTimespan', this.setTimespan)
    // this.$nuxt.$off()
  },
  methods: {
    trendChange (e, f) {
      if (f === this.trendname) {
        switch (e.cmd) {
          case 'addPen':
            this.nodes.push({
              address: e.data.nodeid,
              name: e.data.displayname
            })
            break
          case 'removePen':
            this.$delete(this.nodes, this.nodes.findIndex(item => item.address === e.data.nodeid))
            // this.$delete(this.data, this.nodes.findIndex(item => item.nodeid === e.data.nodeid))
        }
      }
    },
    setTimespan (e, f) {
      console.log('setTimespan', e, f)
      if (f === this.trendname) {
        this.from = e.from
        this.to = e.to
        this.innerConfig.xaxis.range = [this.from, this.to]
        this.data = []
        this.nodes.forEach((node, index) => {
          this.getData(node, this.from, this.to, index)
        })
      }
    },
    handleResize () {
      this.height = this.$el.clientHeight
      this.width = this.$el.clientWidth
      this.$refs.plot.schedule({ replot: false })
    },
    setConfig () {
      const temp = JSON.parse(JSON.stringify(this.config))
      temp.margin = {
        l: 40,
        r: 40,
        t: 0,
        b: 0
      }
      const timeSpanMs = this.calcTimespanMs(temp.xaxis.timeSpan, temp.xaxis.timeSpanUnit)
      const yaxis = this.mapYaxisConfig(temp.yaxis[0])
      if (temp.yaxis[1]) {
        temp.yaxis2 = this.mapYaxisConfig(temp.yaxis[1])
        // temp.yaxis2.overlaying = 'y'
        // temp.margin.r = 0
      }
      if (temp.yaxis[2]) {
        temp.yaxis3 = this.mapYaxisConfig(temp.yaxis[2])
        // temp.yaxis3.overlaying = 'y'
      }
      if (temp.yaxis[3]) {
        temp.yaxis4 = this.mapYaxisConfig(temp.yaxis[3])
        // temp.yaxis4.overlaying = 'y'
      }
      temp.xaxis = this.mapXaxisConfig(temp.xaxis)
      temp.margin.b = temp.xaxis.visible ? 40 : 0
      temp.xaxis.autorange = true
      this.to = new Date()
      // to.setHours(23, 59, 59)
      this.from = new Date(this.to.getTime() - timeSpanMs)
      // from.setHours(0, 0, 0)
      temp.xaxis.range = [this.from, this.to]
      temp.showlegend = true
      temp.legend = { orientation: 'h', yanchor: 'top', xanchor: 'left', y: 0.99, x: 0.01, _bgcolor: '#888888' }
      temp.yaxis = yaxis
      this.innerConfig = temp
      this.config.nodes.forEach((node, index) => {
        this.nodes.push(node)
        // this.getData(node)
      })
      this.$nuxt.$on(this.config.trendGroup, (data) => {
        // console.log(data)
        if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
          this.from = new Date(data['xaxis.range[0]'])
          this.to = new Date(data['xaxis.range[1]'])
          this.data = []
          // this.config.nodes.forEach((node, index) => {
          //   this.getData(node, this.from, this.to, index)
          // })
          this.nodes.forEach((node, index) => {
            this.getData(node, this.from, this.to, index)
          })
        }
      })
    },
    eventTrigger (event) {
      // this.$lodash.debounce(this.delayedFunc, 300)
      this.$nuxt.$emit(this.config.trendGroup, event)
      // top.webMI.trigger.fire('group1', { id: 123 }, '123')
    },
    calcTimespanMs (time, unit) {
      switch (unit) {
        case 'second(s)':
          return time * 1000
        case 'minute(s)':
          return time * 1000 * 60
        case 'hour(s)':
          return time * 1000 * 60 * 60
        case 'day(s)':
          return time * 1000 * 60 * 60 * 24
        case 'week(s)':
          return time * 1000 * 60 * 60 * 24 * 7
        case 'month(s)':
          return time * 1000 * 60 * 60 * 24 * 31
        default:
          return time
      }
    },
    mapXaxisConfig (config) {
      return {
        visible: config.labels_enabled !== 'false',
        autorange: false,
        fixedrange: false,
        range: [this.from, this.to],
        linewidth: config.lineWidth,
        linecolor: config.lineColor,
        showline: config.lineWidth !== '0',
        side: config.opposite,
        showspikes: config.crosshair,
        spikemode: 'across',
        spikedash: config.crosshair_dashStyle ? config.crosshair_dashStyle.toLowerCase() : 'solid',
        spikethickness: config.crosshair_width || 2,
        spikecolor: config.crosshair_color || '#999999',
        gridcolor: config.gridLineColor,
        gridwidth: config.gridLineWidth,
        showgrid: config.gridLineWidth !== '0',
        title: {
          text: config.title_text
        }
      }
    },
    mapYaxisConfig (config) {
      return {
        autorange: !config.min && !config.max,
        fixedrange: true,
        range: [config.min || 0, config.max || 0],
        visible: config.visible !== 'false',
        linewidth: config.lineWidth,
        linecolor: config.lineColor,
        showline: config.lineWidth !== 0,
        side: config.opposite,
        showspikes: config.crosshair,
        spikemode: 'across',
        spikedash: config.crosshair_dashStyle ? config.crosshair_dashStyle.toLowerCase() : 'solid',
        spikethickness: config.crosshair_width || 2,
        spikecolor: config.crosshair_color || '#999999',
        gridcolor: config.gridLineColor,
        gridwidth: config.gridLineWidth,
        showgrid: config.gridLineWidth !== '0',
        title: {
          text: config.title_text
        }
      }
    },
    getData (node) {
      // const to = new Date()
      // let from = new Date()
      // // from.setHours(from.getHours() - 12)
      // from = new Date(from.getTime() - timespan)
      console.log('get data')
      const filter = {
        type: ['v:1'],
        address: [`v:${node.address}`],
        timestamp: ['n:>=' + this.from.getTime() + '<' + this.to.getTime()]
      }
      top.webMI.data.queryFilter(filter, (e) => {
        if (e.errors) {
          this.$store.commit('SET_CUSTOM_ALERT', { message: e.errors[0].errorstring })
          return
        }
        const x = []
        const y = []
        e.result.map((row) => {
          x.push(new Date(row.timestamp))
          y.push(this.$lodash.round(row.value, 3))
          return {}
        })
        this.data.push({
          name: node.name,
          nodeid: node.address,
          yaxis: node.yAxis,
          xaxis: node.xAxis,
          mode: node.marker_enabled === true ? 'lines+markers' : 'lines',
          line: {
            shape: node.interpolation === 'step' ? 'hv' : node.interpolation,
            width: node.lineWidth || 2,
            color: node.color || undefined,
            dash: node.dashStyle ? node.dashStyle.toLowerCase() : 'solid',
            smoothing: 0.5
          },
          x,
          y
        })
      })
    }
  }
}
</script>

<style>

</style>
