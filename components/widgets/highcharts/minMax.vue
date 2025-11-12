<template>
  <div>
    <v-switch dense hide-details label="Min max" @change="showMinMax" />
  </div>
</template>

<script>
export default {
  props: {
    trendName: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      trend: undefined
    }
  },
  mounted () {
    setTimeout(() => {
      this.getTrend()
    }, 500)
  },
  methods: {
    getTrend () {
      this.trend = top.webMI.trendFactory.getTrendByName(this.trendName)
    },
    showMinMax (val) {
      if (val) {
        this.addMinMax()
      } else {
        this.removeMinMax()
      }
    },
    addMinMax () {
      const series = this.trend.chart.series
      series.forEach((item) => {
        const options = JSON.parse(JSON.stringify(item.userOptions))
        delete options.data
        delete options.id
        options.dashStyle = 'ShortDash'
        options.color = options.color + '99'
        const name = options.name
        if (options.aggregate.aggregate !== 'max' && options.aggregate.aggregate !== 'min') {
          setTimeout(() => {
            options.aggregate.aggregate = 'max'
            options.name = name + ' (max)'
            this.trend.chart.addSeries(options)
          }, 200)
          setTimeout(() => {
            options.aggregate.aggregate = 'min'
            options.name = name + ' (min)'
            this.trend.chart.addSeries(options)
          }, 200)
        }
      })
      setTimeout(() => {
        this.trend.control.updated()
      }, 500)
    },
    removeMinMax () {
      const series = this.trend.chart.series
      series.forEach((item) => {
        const options = item.userOptions
        if (options.aggregate.aggregate === 'max' || options.aggregate.aggregate === 'min') {
          // whitout timeout the forEach loop is broken when item.remove() executes
          setTimeout(() => {
            item.remove()
          }, 100)
        }
      })
    }
  }
}
</script>

<style>
</style>
