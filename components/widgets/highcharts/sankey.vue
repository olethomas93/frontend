<template>
  <div ref="container1" style="height:500px;width:100%;" />
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => { return [['HF1', 'UF1', 30], ['HF1', 'UF2', 25.2], ['UF2', 'UF3', 50]] }
    }
  },
  data () {
    return {
      chart1: undefined
    }
  },
  watch: {
    value (val) {
      if (this.chart1) {
        this.chart1.destroy()
      }
      this.createChart1(val)
    }
  },
  mounted () {
    top.webMI.libraryLoader.load('highcharts/modules/sankey.js')
    // const data = await this.getData()
    // const data2 = data.map(function (data) {
    //   return [data.timestamp, parseInt(data.value)]
    // })
    // // Emit last measurement to update 3d scan view with latest scan
    // this.$emit('pointClick', data2[data2.length - 1][0])
    // const cons = this.consumption(this.groupDay(data2))
    // this.createChart1(data2, cons.consumption, cons.fill)
    this.createChart1(this.value)
  },
  methods: {
    groupDay (data) {
      const faktor = 24 * 60 * 60 * 1000
      const obj = {}
      for (const i in data) {
        let d = new Date(data[i][0])
        d = Math.floor(d.getTime() / faktor)
        obj[d * faktor] = obj[d * faktor] || []
        obj[d * faktor].push(data[i][1])
      }
      return obj
    },
    groupHour (data) {
      const faktor = 60 * 60 * 1000
      const obj = {}
      for (const i in data) {
        let d = new Date(data[i][0])
        d = Math.floor(d.getTime() / faktor)
        const timestamp = d * faktor
        obj[timestamp] = obj[timestamp] || []
        obj[timestamp].push(data[i][1])
      }
      return obj
    },
    consumption (data) {
      const cons = []
      const fill = []

      for (const i in data) {
        const length = data[i].length

        // Sjekker om det er fylling eller forbruk
        if (data[i][0] + 200 > data[i][length - 1]) {
          const consumption = data[i][0] - data[i][length - 1]
          cons.push([Number(i) - 60 * 60 * 1000, consumption > 500 ? consumption : 0])
        } else {
          // fill.push(data[i]);
          const min = this.arrayMin(data[i])
          const max = this.arrayMax(data[i])
          const start = data[i][0]
          const stop = data[i][length - 1]
          const consumption = (start - min) + (max - stop)
          cons.push([Number(i) - 60 * 60 * 1000, consumption > 500 ? consumption : 0])
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
    },
    getMax (data) {
      const arr = []
      for (const e in data) {
        const max = this.arrayMax(data[e])
        arr.push([Number(e), max])
      }
      return arr
    },
    getFirst (data) {
      const arr = []
      for (const e in data) {
        const first = data[e][0]
        arr.push([Number(e), first])
      }
      return arr
    },
    createChart1 (data, data2, data3) {
      this.chart1 = top.Highcharts.chart(this.$refs.container1, {
        chart: {
          backgroundColor: 'transparent',
          type: 'line',
          panKey: 'shift',
          panning: {
            enabled: true,
            type: 'x'
          }
        },
        exporting: {
          enabled: true
        },
        title: {
          text: 'Sankey test'
        },
        plotOptions: {
          sankey: {
            colors: ['#26d07c'],
            tooltip: {
              nodeFormat: '{point.name}: <b>{point.sum} kWh</b><br/>',
              pointFormat: '{point.fromNode.name} → {point.toNode.name}: <b>{point.weight} kWh</b><br/>'
            }
          }
        },
        series: [
          {
            keys: ['from', 'to', 'weight'],
            data,
            // data: [
            //   ['HF1', 'UF1', 12.5],
            //   ['HF1', 'UF2', 6.8],
            //   ['HF2', 'UF1', 6],
            //   ['UF2', 'UPS1', 4.2],
            //   ['UF2', 'UMÅLT', 6.8 - 4.2 + 10]
            // ],
            type: 'sankey',
            name: 'Effektforbruk'
          }
        ],
        tooltip: {
          shared: false,
          split: false,
          formatter: undefined
          // eslint-disable-next-line object-shorthand
          // formatter: function () {
          //   return `<b>${this.point.sum}</b>`
          //   // return this.points.reduce(function (s, point) {
          //   //   return `<b>${new Date(point.x).toLocaleString()}</b><br>${point.series.name}: ${point.y} kg`
          //   // }, `<b>${this.x}</b>`)
          // }
        }
        // yAxis: [
        //   {
        //     title: {
        //       text: null
        //     },
        //     height: '45%',
        //     min: 0,
        //     max: 80000,
        //     offset: 0

        //   },
        //   {
        //     title: {
        //       text: null
        //     },
        //     top: '50%',
        //     height: '20%',
        //     offset: 0
        //   },
        //   {
        //     title: {
        //       text: null
        //     },
        //     offset: 0,
        //     top: '75%',
        //     height: '20%'
        //   }
        // ],
        // series: [
        //   {
        //     yAxis: 0,
        //     type: 'line',
        //     color: '#00a3e0',
        //     name: 'T{Stock}',
        //     data,
        //     point: {
        //       events: {
        //         click: (event) => {
        //           this.$emit('pointClick', event.point.x)
        //         }
        //       }
        //     }
        //   },
        //   {
        //     yAxis: 1,
        //     type: 'column',
        //     color: '#26d07c',
        //     name: 'T{Consumption}',
        //     pointWidth: 20,
        //     data: data2
        //   },
        //   {
        //     yAxis: 2,
        //     type: 'column',
        //     color: '#282828',
        //     name: 'T{Filling}',
        //     pointWidth: 20,
        //     data: data3
        //   }

        // ]
      })
    }
  }
}
</script>

<style>

</style>
