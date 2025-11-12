<template>
  <time-range v-model="fromTo" @input="update" />
</template>

<script>
import timeRange from '@/components/common/fromToPicker.vue'

export default {
  components: {
    timeRange
  },
  props: {
    trendName: {
      type: String,
      default: 'trend1'
    }
  },
  data () {
    return {
      trend: undefined,
      fromTo: {}
    }
  },
  watch: {
    fromTo: {
      deep: true,
      handler (value) {
        // this.update(value)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.getTrend()
      this.getCurrentTimerange()
    }, 500)
  },
  methods: {
    getCurrentTimerange () {
      const { min, max } = this.trend.chart.xAxis[0].getExtremes()
      const from = new Date(min).toISOString().substr(0, 10)
      const to = new Date(max).toISOString().substr(0, 10)
      this.fromTo = { from, to }
      console.log(min, max)
    },
    getTrend () {
      this.trend = top.webMI.trendFactory.getTrendByName(this.trendName)
    },
    update (val) {
      this.getTrend()
      const from = new Date(val.from).getTime()
      let to = new Date(val.to).setHours(23, 59, 59)
      const now = new Date().getTime()
      to = to > now ? now : to
      this.trend.chart.xAxis[0].setExtremes(from, to)
      this.trend.chart.xAxis[0].options.min = from
      this.trend.chart.xAxis[0].options.max = to
      if (this.trend.control.isLiveModeRunning()) {
        this.trend.control.stopLiveMode()
      }
      const oldMode = this.trend.chart.options.atviseOptions.mode
      this.trend.control.setMode('history')
      this.trend.control.updated(function () {
        this.trend.control.setMode(oldMode)
      })
    }
  }

}
</script>

<style>

</style>
