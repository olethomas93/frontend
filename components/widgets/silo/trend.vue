<template>
  <v-container fluid>
    <plotly-trend
      :data="data"
      :loading="loading"
      :config="config"
      :timespan="timespan"
      @loadData="loadPlots($event.from, $event.to)"
      @click="click($event)"
    />
  </v-container>
</template>

<script>
import { APIservice } from '@/global/APIService.js'
import plotlyTrend from '@/components/common/trend/plotlyTrend'
import { webMI } from '@/global/webMI_mixin'

export default {
  components: {
    plotlyTrend
  },
  mixins: [webMI],
  props: {
    timespan: {
      type: Array,
      default () {
        return [
          this.$moment().subtract(7, 'days').endOf('day'),
          this.$moment().endOf('day')
        ]
      }
    },
    base: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    loading: true,
    data: [
      {
        type: 'scatter',
        name: '',
        x: [],
        y: [],
        hoverinfo: 'x+y',
        hovertemplate: 'Beholdning: %{y:.0f} kg'
      },
      {
        type: 'bar',
        name: '',
        x: [],
        y: [],
        width: 30000000,
        yaxis: 'y2',
        hoverinfo: 'y+name',
        hovertemplate: 'Forbruk: %{y:.0f} kg'
      },
      {
        type: 'bar',
        name: '',
        x: [],
        y: [],
        width: 30000000,
        yaxis: 'y3',
        hoverinfo: 'y+name',
        hovertemplate: 'Fylling: %{y:.0f} kg'
      }
    ],
    config: {
      height: 500,
      margin: {
        t: 20
      },
      dragmode: 'pan',
      title: null,
      grid: { rows: 3, columns: 1 },
      showlegend: false,
      yaxis: {
        fixedrange: true,
        range: [0, 80000],
        domain: [0.52, 1],
        ticksuffix: ' kg'
      },
      yaxis2: {
        fixedrange: true,
        domain: [0.27, 0.5],
        ticksuffix: ' kg'
      },
      yaxis3: {
        fixedrange: true,
        domain: [0, 0.25],
        ticksuffix: ' kg'
      }
    },
    apiService: undefined,
    test: '',
    startDate: undefined,
    endDate: undefined
  }),
  watch: {
    timespan (val) {
      if (val.length === 2) {
        this.startDate = val[0].format()
        this.endDate = val[1].format()
        this.loadPlots(this.startDate, this.endDate)
      }
    }
  },
  mounted () {
    this.startDate = this.timespan[0]
    this.endDate = this.timespan[1]
    this.apiService = new APIservice(this)
    this.loadPlots(this.startDate.format(), this.endDate.format())
  },
  methods: {
    click (data) {
      // Sjekker om klikk er på beholdning kurven
      if (data[0].curveNumber === 0) {
        this.$emit('pointClick', { time: data[0].x })
      }
    },
    async loadPlots (from, to) {
      const res = await this.getData(from, to)
      this.data[0].x = res.kg.x
      this.data[0].y = res.kg.y
      this.data[1].x = res.consumption.x
      this.data[1].y = res.consumption.y
      this.data[2].x = res.fill.x
      this.data[2].y = res.fill.y
      // this.$refs.plot.schedule({ replot: false })
    },
    async getData (from, to) {
      this.loading = true
      // const { data } = await this.apiService.getHistoryNumeric({ node: this.base, variable: 'kg', from, to })
      let data = await this.webMI.data.call('JMH_getHistory', { nodes: [this.base + '.kg'], from, to })
      data = data.kg
      const cons = this.consumption(this.groupDay(data.reverse()))
      this.loading = false
      const kg = this.parseData(data)
      // console.log(kg)
      // console.log(data[0].sourceTimestamp)
      this.$emit('pointClick', { time: data[data.length - 1].sourceTimestamp })
      // const consumption = this.parseData(data[2].series[0].data)
      // const fill = this.parseData(data[1].series[0].data)
      return { kg, consumption: this.parseData_arr(cons.consumption), fill: this.parseData_arr(cons.fill) }
    },
    parseData (data) {
      const xData = []
      const yData = []
      for (const i in data) {
        xData.push(new Date(data[i].sourceTimestamp))
        if (typeof data[i].value === 'object') {
          yData.push(data[i].value.avg)
        } else {
          yData.push(data[i].value)
        }
      }
      return { x: xData, y: yData }
    },
    parseData_arr (data) {
      const xData = []
      const yData = []
      for (const i in data) {
        xData.push(new Date(data[i][0]))
        // yData.push(data[i].total / 1000)
        yData.push(data[i][1])
      }
      return { x: xData, y: yData }
    },
    groupDay (data) {
      const faktor = 24 * 60 * 60 * 1000
      const obj = {}
      for (const i in data) {
        let d = new Date(data[i].sourceTimestamp)
        d = Math.floor(d.getTime() / faktor)
        obj[d * faktor] = obj[d * faktor] || []
        obj[d * faktor].push(data[i].value)
      }
      return obj
    },
    // finn forbruk pr dag
    consumption (data) {
      const cons = []
      const fill = []

      for (const i in data) {
        const length = data[i].length
        // data[i] = data[i].reverse()
        // Sjekker om det er fylling eller forbruk
        if (data[i][0] - 300 > data[i][length - 1]) {
          const consumption = data[i][0] - data[i][length - 1]
          if (consumption > 300) {
            cons.push([Number(i) - 60 * 60 * 1000, consumption])
          } else {
            cons.push([Number(i) - 60 * 60 * 1000, 0])
          }
          fill.push([Number(i) - 60 * 60 * 1000, 0])
        } else {
          // fill.push(data[i]);
          const min = this.arrayMin(data[i])
          const max = this.arrayMax(data[i])
          // const start = data[i][0]
          // const stop = data[i][length - 1]
          // cons.push([Number(i) - 60 * 60 * 1000, (start - min) + (max - stop)])
          const temp = (max - min) > 900 ? max - min : 0
          fill.push([Number(i) - 60 * 60 * 1000, temp])
        }
      }
      return { consumption: cons, fill }
    },
    // Finner min-verdi i et array
    arrayMin (arr) {
      let len = arr.length; let min = Infinity
      while (len--) {
        if (arr[len] < min) {
          min = arr[len]
        }
      }
      return min
    },
    // Finner max-verdi i et array
    arrayMax (arr) {
      let len = arr.length; let max = -Infinity
      while (len--) {
        if (arr[len] > max) {
          max = arr[len]
        }
      }
      return max
    }
  }
}
</script>
