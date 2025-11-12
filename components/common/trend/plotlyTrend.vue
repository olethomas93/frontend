
<template>
  <div class="center">
    <resize-observer @notify="handleResize" />
    <loadingIcon v-if="loading || innerLoading" style="position:absolute;z-index:10;" />
    <plotly
      ref="plot"
      :data="data"
      :layout="innerLayout"
      :display-mode-bar="innerLayout.displayModeBar"
      :mode-bar-buttons-to-add="innerLayout.modeBarButtonsToAdd || []"
      :scroll-zoom="true"
      :displaylogo="false"
      style="width:100%;"
      @relayout="relayout($event)"
      @click="$emit('click', $event.points )"
    />
  </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props */

import loadingIcon from '@/components/loadingIcon.vue'
import { APIservice } from '@/global/APIService.js'

const debounce = (func, delay) => {
  let inDebounce
  return function () {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() =>
      func.apply(context, args)
    , delay)
  }
}

export default {
  components: {
    loadingIcon
  },
  inject: ['theme'],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => { return [] }
    },
    config: {
      type: Object,
      default: () => { return {} }
    },
    timespan: {
      type: Array,
      default () {
        return [
          this.$moment().subtract(7, 'days').endOf('day'),
          this.$moment().endOf('day')
        ]
      }
    }
  },
  data: () => ({
    // innerLoading: () => { return this.loading },
    apiService: undefined,
    startDate: undefined,
    endDate: undefined,
    height: 200,
    width: 200,
    innerLoading: false
  }),
  computed: {
    innerLayout () {
      return this.$lodash.merge(this.defaultLayout, this.config)
    },
    defaultLayout () {
      return {
        displaylogo: false,
        height: this.height,
        width: this.width,
        autosize: true,
        margin: {
          l: 50,
          r: 50,
          t: 30,
          b: 40
        },
        modebar: {
          visible: false,
          orientation: 'v'
        },
        locale: 'no',
        dragmode: 'pan',
        title: 'Set title in config.title',
        plot_bgcolor: '#88888822',
        paper_bgcolor: 'transparent',
        template: { layout: { colorway: ['#00a3e0', '#26d07c', '#282828', '#ff671f', '#ffc72c'] } },
        font: { color: this.theme.isDark ? 'white' : 'black' },
        hoverlabel: { font: { size: 16 } }
      }
    }
  },
  watch: {
    loading (val) {
      this.innerLoading = val
    },
    data: {
      async handler (val) {
        await this.$nextTick()
        this.$refs.plot.schedule({ replot: false })
      },
      deep: true
    },
    config: {
      async handler (val) {
        // console.log('config changed')
        this.$refs.plot.innerLayout = JSON.parse(JSON.stringify(val))
        await this.$nextTick()
        this.$refs.plot.schedule({ replot: false })
      },
      deep: true
    },
    timespan (val) {
      if (val.length === 2) {
        this.startDate = val[0]
        this.endDate = val[1]
        // this.loadPlots(this.startDate, this.endDate)
      }
    }
  },
  mounted () {
    this.startDate = this.timespan[0]
    this.endDate = this.timespan[1]
    this.apiService = new APIservice(this)
    this.$nextTick(function () {
      this.handleResize()
    })
    setTimeout(this.handleResize, 1000)
    this.loadPlots(this.startDate.format(), this.endDate.format())
  },
  methods: {
    handleResize () {
      this.height = this.$el.clientHeight
      this.width = this.$el.clientWidth
      this.$refs.plot.schedule({ replot: false })
    },
    update () {
      this.$refs.plot.schedule({ replot: false })
    },
    relayout (value) {
      this.$emit('relayout', value)
      if (value['xaxis.range[0]'] && value['xaxis.range[1]']) {
        const from = this.$moment(value['xaxis.range[0]'])
        const to = this.$moment(value['xaxis.range[1]'])
        // Check if more data is needed from the server
        let loadPlots = false
        if (from.isBefore(this.startDate)) {
          this.startDate = from
          loadPlots = true
        }
        if (to.isAfter(this.endDate)) {
          this.endDate = to
          loadPlots = true
        }
        if (loadPlots) {
          this.$emit('loadData', { from: this.startDate.format(), to: this.endDate.format() })
          this.deBounce(value, this)
        }
      }
      // var update = {‘xaxis.range’: [min_val, max_val]};
      // Plotly.relayout(“placeholder”, update);
    },
    deBounce: debounce((value, self) => {
      // console.log(value['xaxis.range[0]'])
      // self.loadPlots(value['xaxis.range[0]'], value['xaxis.range[1]'])
      self.loadPlots(self.startDate.format(), self.endDate.format())
    }, 350),
    async loadPlots (from, to) {
      for (const i in this.data) {
        if (this.data[i].meta) {
          const node = this.data[i].meta.node
          const res = await this.getData(node, from, to)

          this.data[i].x = res.x
          this.data[i].y = res.y
          this.data[i].x.push(this.$moment().endOf('day').format())
          this.data[i].y.push(null)
        }
      }
      this.$refs.plot.schedule({ replot: false })
    },
    async getData (node, from, to) {
      try {
        const arr = node.split('.')
        const variable = arr.pop()
        const _node = arr.join('.')
        this.innerLoading = true
        const res = await this.apiService.getHistory({ node: _node, variable, from, to })
        this.innerLoading = false
        const x = res.data.map(data => this.$moment(data.sourceTimestamp).format())
        const y = res.data.map(data => data.value)
        // x.push(this.$moment().endof('day').format())
        // y.push(null)
        return { x, y }
      } catch (error) {
        this.innerLoading = false
        return { x: [], y: [] }
      }
    }
  }
}
</script>

<style >
  .center{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
