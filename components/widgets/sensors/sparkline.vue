<template>
  <div @click.stop="dialog = true">
    <v-sparkline
      v-if="!loading"
      :value="dataset"
      :gradient="gradient"
      :smooth="radius || false"
      :padding="padding"
      :line-width="width"
      :stroke-linecap="lineCap"
      :gradient-direction="gradientDirection"
      :fill="fill"
      :type="type"
      :auto-line-width="autoLineWidth"
      auto-draw
    />

    <v-progress-circular
      v-else-if="loading"
      indeterminate
      color="primary"
    />

    <div v-if="error" style="font-size:0.8em" color="warning">
      {{ $T('Error') }}
    </div>

    <div v-if="noData" style="font-size:0.8em">
      {{ $T('...no data') }}
    </div>
    <v-dialog v-if="dialog" v-model="dialog" width="80%">
      <v-card>
        <v-card-title>
          Trend
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <atvise-visu-v3 :query="{name: name, unit: unit}" :settings="`${vtype}.trend`" :base="nodeid" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea']
]
export default {
  name: 'Sparkline',
  props: {
    nodeid: {
      type: String,
      default: ''
    },
    vtype: {
      type: String,
      default: ''
    },
    update: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: 'Value'
    },
    unit: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    width: 3,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    gradient: gradients[4],
    dataset: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
    gradientDirection: 'top',
    gradients,
    fill: false,
    type: 'trend',
    autoLineWidth: true,
    loading: true,
    error: false,
    noData: false,
    dialog: false
  }),
  watch: {
    update (newval, oldval) {
      // console.log(newval)
      this.getHistory()
    }
  },

  async mounted () {
    try {
      this.dataset = await this.fetchData()
      this.loading = false
      if (this.dataset.length < 1) {
        this.noData = true
      }
    } catch (e) {
      this.dataset = []
      this.loading = false
      this.error = true
    }
  },
  methods: {
    async  getHistory () {
      this.loading = true
      this.error = false
      this.noData = false
      try {
        this.dataset = await this.fetchData()
        this.loading = false
        if (this.dataset.length < 1) {
          this.noData = true
        } else {
          this.error = false
        }
      } catch (e) {
        this.dataset = []
        this.loading = false
        this.error = true
      }
    },
    fetchData () {
      return new Promise((resolve, reject) => {
        const today = new Date()
        const lastDay = new Date(today.getTime())
        let arr = []
        lastDay.setDate(today.getDate() - 1)
        top.webMI.data.call('JMH_getHistory', { nodes: [this.nodeid], rollup: 'PT1H', from: lastDay.toISOString(), to: today.toISOString() }, function (data) {
          if (data.error === -1) {
            // console.log(data)
            reject(new Error(data))
          } else {
            const temp = Object.keys(data)
            if (temp.length > 0) {
              arr = data[temp[0]].map((i) => {
                return i.value.avg
              })
            }
            resolve(arr.reverse())
          }
        })
      })
    },
    trendDialog () {
      top.webMI.trigger.fire('showPopup', { display: `${this.vtype}.trend`, base: this.nodeid, width: 800, height: 600, query: { unit: 'kg/t' } })
    }
  }

}
</script>
