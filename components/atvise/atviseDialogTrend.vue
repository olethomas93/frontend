<template>
  <trend name="atviseDialogTrend" :config="trendConfig" />
</template>

<script>
import Trend from '@/components/common/widgets/trend.vue'

export default {
  components: {
    Trend
  },
  props: {
    base: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    // nodes: [],
    trendConfig: {
      title: 'test',
      trendGroup: 'group2',
      yaxis: [
        {
          title_text: 'axis1',
          visible: true
        }
      ],
      xaxis: {
        title_text: '',
        timeSpan: 60,
        timeSpanUnit: 'minute(s)'
      },
      nodes: []
    }
  }),
  mounted () {
    // this.$nextTick(() => {
    //   this.$browse(this.base, ['i=68', 'i=62'], true, 1).then((data) => {
    //     if (data.trendViewSettings) {
    //       console.log(data.trendViewSettings.value)
    //       const ret = []
    //       data.trendViewSettings.value.forEach((item) => {
    //         ret.push({
    //           address: data[item].nodeid,
    //           name: data[item].displayname
    //         })
    //       })
    //       console.log(ret)
    //       this.trendConfig.nodes = ret
    //     }
    //   })
    // })
  }
}
</script>

<style>

</style>
