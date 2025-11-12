<template>
  <v-hover>
    <v-container fluid style="height:100%;">
      <plotly-trend
        :loading="loading"
        :data="data"
        :config="config"
        @loadData="loadPlots($event.from, $event.to)"
      />
    </v-container>
  </v-hover>
</template>

<script>
import plotlyTrend from '@/components/common/trend/plotlyTrend'
import { widget } from '@/global/mixin'

export default {
  components: {
    plotlyTrend
  },
  mixins: [widget],
  props: {
    fullscreen: Boolean,
    time: {
      type: [Number, String],
      default: 0
    }
  },
  data: () => ({
    loading: false,
    showPlot: false,
    pointCloud: undefined,
    showCloud: true,
    values: ['kg'],
    kg: 0,
    rotertSky: undefined,
    grid: undefined,
    data: [
      {
        x: [],
        y: [],
        z: [],
        name: 'cloud',
        showlegend: false,
        mode: 'markers',
        type: 'scatter3d',
        marker: {
          color: 'rgb(38,208,124)',
          size: 0.7
        },
        opacity: 1
      },
      {
        name: 'grid',
        opacity: 1,
        showlegend: false,
        type: 'surface',
        colorscale: [
          [0, '#ffc72c'],
          [1, '#ff671f']
        ],
        lighting: { ambient: 0.6, roughness: 0.8, specular: 1 },
        lightposition: { },
        contours: {
          x: {
            show: true,
            usecolormap: true,
            highlightcolor: '#26d0c7'
          },
          y: {
            show: true,
            usecolormap: true,
            highlightcolor: '#26d0c7'
            // project: { y: true }
          },
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: '#26d0c7',
            project: { z: true }
          }
        },
        showscale: false
      }
    ],
    config: {
      autosize: true,
      height: 480,
      showlegend: true,
      margin: {
        t: 0,
        b: 0,
        l: 0,
        r: 0
      },
      scene: {
        hovermode: true,
        dragmode: 'turntable',
        aspectratio: {
          x: 1,
          y: 1,
          z: 1
        },
        camera: {
          projection: {
            type: 'orthographic' // perspective
          },
          center: {
            x: 0,
            y: 0,
            z: 0
          },
          eye: {
            x: 1.25,
            y: 1.25,
            z: 1.25
          },
          up: {
            x: 0,
            y: 0,
            z: 1
          }
        },
        xaxis: {
          showticklabels: false,
          type: 'linear',
          range: [-400, 400],
          zeroline: true
        },
        yaxis: {
          showticklabels: false,
          type: 'linear',
          range: [-400, 400],
          zeroline: false
        },
        zaxis: {
          showticklabels: false,
          range: [-800, 0],
          type: 'linear',
          zeroline: false
        }
      },
      title: null
      // width: 480
    }
  }),
  watch: {
    fullscreen () {
      this.onResize()
    },
    rotertSky (val) {
      const grid = val.scan_result
      this.data[0].x = this.unpack(grid, 0)
      this.data[0].y = this.unpack(grid, 1)
      this.data[0].z = this.unpack(grid, 2)
    },
    grid (val) {
      const xArr = []
      const yArr = []
      const zArr = []
      for (let x = 0; x < val.size.x; x++) {
        const _x = []
        const _y = []
        const _z = []
        for (let y = 0; y < val.size.y; y++) {
          _x.push(val.coord[(x * val.size.y) + y][0])
          _y.push(val.coord[(x * val.size.y) + y][1])
          _z.push(val.coord[(x * val.size.y) + y][2])
        }
        xArr.push(_x)
        yArr.push(_y)
        zArr.push(_z)
      }
      this.data[1].x = xArr
      this.data[1].y = yArr
      this.data[1].z = zArr
    },
    time (val) {
      this.getPointCloud(new Date(val).toISOString())
    }
  },
  mounted () {
    // this.getPointCloud('')
  },
  methods: {
    getPointCloud (time) {
      this.loading = true
      const timestamp = new Date(time)
      top.webMI.data.call('JMH_getHistory', { nodes: [this.base + '.ScanPoints'], timestamp: timestamp.toISOString(), binary: true }, (data) => {
        try {
          const base = this.base + '.ScanPoints'
          const scan = JSON.parse(data[base])
          this.rotertSky = scan
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      })
      top.webMI.data.call('JMH_getHistory', { nodes: [this.base + '.grid'], timestamp: timestamp.toISOString(), binary: true }, (data) => {
        try {
          const base = this.base + '.grid'
          const grid = JSON.parse(data[base])
          this.grid = grid
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      })
      // this.apiService.getHistoryBinary({ node: this.base, variable: 'ScanPoints', from: time }).then((data) => {
      //   console.log(data.data[0])
      //   this.rotertSky = JSON.parse(data.data[0].value)
      //   this.loading = false
      // })
      // this.apiService.getHistoryBinary({ node: this.base, variable: 'grid', from: time }).then((data) => {
      //   console.log(data.data[0])
      //   this.grid = JSON.parse(data.data[0].value)
      // })
    },
    unpack (grid, key) {
      return grid.map(function (gridLine) { return gridLine[key] })
    }
  }
}
</script>
