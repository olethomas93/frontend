<template>
  <v-btn icon @click="reload">
    <v-icon>
      mdi-reload
    </v-icon>
  </v-btn>
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
    reload (val) {
      // this.trend.control.updated()
      this.trend.chart.zoomOut()
      this.trend.control.loadHistory()
    }
  }
}
</script>

<style>
</style>
