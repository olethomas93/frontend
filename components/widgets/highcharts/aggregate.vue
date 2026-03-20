<template>
  <div style="width:150px">
    <v-select
      v-model="value"
      :label="$T('Aggregate')"
      :items="items"
      density="compact"
      width="100"
      hide-details
      @input="update"
    />
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
      trend: undefined,
      value: 5 * 60
    }
  },
  computed: {
    items () {
      return [
        { text: this.$T('None'), value: 0 },
        { text: `1 ${this.$T('second')}`, value: 1 },
        { text: `15 ${this.$T('seconds')}`, value: 15 },
        { text: `30 ${this.$T('seconds')}`, value: 30 },
        { text: `1 ${this.$T('minute')}`, value: 1 * 60 },
        { text: `5 ${this.$T('minutes')}`, value: 5 * 60 },
        { text: `10 ${this.$T('minutes')}`, value: 10 * 60 },
        { text: `15 ${this.$T('minutes')}`, value: 15 * 60 },
        { text: `30 ${this.$T('minutes')}`, value: 30 * 60 },
        { text: `1 ${this.$T('hour')}`, value: 1 * 60 * 60 },
        { text: `6 ${this.$T('hours')}`, value: 6 * 60 * 60 },
        { text: `12 ${this.$T('hours')}`, value: 12 * 60 * 60 },
        { text: `24 ${this.$T('hours')}`, value: 24 * 60 * 60 }
      ]
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
    update (value) {
      const series = this.trend.chart.series
      series.forEach((serie) => {
        serie.update({ aggregate: { interval: value, unit: 's' } })
      })
      this.trend.control.updated()
    }
  }
}
</script>

<style>
</style>
