<template>
  <v-toolbar v-if="trend" flat density="compact">
    <WidgetsHighchartsTimeRange :trend-name="trendName" />
    <v-spacer />
    <WidgetsHighchartsAggregate v-if="showAggregate" ref="aggregate" :trend-name="trendName" />
    <v-spacer v-if="showAggregate" />
    <WidgetsHighchartsMinMax :trend-name="trendName" />
    <!-- <v-spacer /> -->
    <WidgetsHighchartsReload :trend-name="trendName" />
  </v-toolbar>
</template>

<script>
export default {
  props: {
    trendName: {
      type: String,
      default: undefined
    },
    showAggregate: {
      type: Boolean,
      dafault: false
    },
    trend: {
      type: [Object, String],
      default: undefined
    },
    aggregateTime: {
      type: Number,
      default: 0
    }
  },
  watch: {
    aggregateTime (val) {
      if (this.showAggregate) {
        this.$refs.aggregate.value = val
      }
    }
  }
}
</script>

<style>
</style>
