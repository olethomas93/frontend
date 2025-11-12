<template>
  <div ref="container1" style="height:500px;width:100%;">1</div>
</template>

<script>
export default {
  data () {
    return {
      chart1: undefined
    }
  },
  async mounted () {
    const data = await this.getData()
    const data2 = data.map(function (data) {
      return [data.timestamp, parseInt(data.value)]
    })
    // Emit last measurement to update 3d scan view with latest scan
    this.$emit('pointClick', data2[data2.length - 1][0])
    const cons = this.consumption(this.groupDay(data2))
    this.createChart1(data2, cons.consumption, cons.fill)
  },
  methods: {
    getData () {
      const self = this
      return new Promise(function (resolve) {
        const to = new Date()
        const from = new Date().setDate(to.getDate() - 7)
        const filter = {
          nodes: [self.base + '.kg'],
          from: new Date(from).toISOString(),
          to: to.toISOString()
        }
        top.webMI.data.call('JMH_queryFilter', filter, function (data) {
          resolve(data.result.reverse())
        })
      })
    },
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
        xAxis: {
          type: 'datetime'
        },
        title: {
          text: undefined
        },
        tooltip: {
          shared: true,
          split: true,
          // formatter: undefined
          /* formatter: function () {
          return this.points.reduce(function (s, point) {
            return `<b>${new Date(point.x).toLocaleString()}</b><br>${point.series.name}: ${point.y} kg`
          }, `<b>${this.x}</b>`);
          } */
          formatter () {
            // The first returned item is the header, subsequent items are the
            // points
            return ['<b>' + new Date(this.x).toLocaleString() + '</b>'].concat(
              this.points
                ? this.points.map(function (point) {
                  return point.series.name + ': ' + point.y + 'kg'
                })
                : []
            )
          }
        },
        yAxis: [
          {
            title: {
              text: null
            },
            height: '45%',
            min: 0,
            max: 80000,
            offset: 0

          },
          {
            title: {
              text: null
            },
            top: '50%',
            height: '20%',
            offset: 0
          },
          {
            title: {
              text: null
            },
            offset: 0,
            top: '75%',
            height: '20%'
          }
        ],
        series: [
          {
            yAxis: 0,
            type: 'line',
            color: '#00a3e0',
            name: 'T{Stock}',
            data,
            point: {
              events: {
                click: (event) => {
                  this.$emit('pointClick', event.point.x)
                }
              }
            }
          },
          {
            yAxis: 1,
            type: 'column',
            color: '#26d07c',
            name: 'T{Consumption}',
            pointWidth: 20,
            data: data2
          },
          {
            yAxis: 2,
            type: 'column',
            color: '#282828',
            name: 'T{Filling}',
            pointWidth: 20,
            data: data3
          }

        ]
      })
    }
  }
}
</script>

<style>

</style>
