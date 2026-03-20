<template>
  <v-dialog v-model="dialog" persistent max-width="1200px" :fullscreen="$vuetify.breakpoint.smAndDown">
    <v-card>
      <v-card-title>
        <span class="headline">{{ $lodash.upperFirst(base.split('.').pop()) }}</span>
        <v-spacer />
        <v-btn variant="text" icon @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class="mx-0" />
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="7">
              <atvise-visu-v-3 :base="base" settings="ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType.Unit_Silo_v2.trend" @pointClick="setTime" />
            </v-col>
            <v-col cols="12" md="5" style="height:480px">
              <silo-point-cloud-3 :base="base" :time="time" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider class="mx-0" />
      <v-card-actions>
        <!-- <from-to-picker @update="changeFromTo" /> -->
        <v-spacer />
        <!-- <v-btn @click="startScan()">Start scan</v-btn> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import cloud from '../widgets/SiloPointCloud3'
// import siloTrend from './siloTrend'
// import fromToPicker from '@/components/common/fromToPicker'
import { APIservice } from '@/global/APIService.js'

export default {
  components: {
    // cloud,
    // fromToPicker,
    // siloTrend
  },
  props: {
    // show: {
    //   type: String,
    //   default: ''
    // },
    base: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    dialog: true,
    charts: [],
    from: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' '),
    to: new Date().toISOString().replace('T', ' '),
    time: 0
  }),
  computed: {},
  watch: {
    show (val) {
      if (!val) {
        this.$emit('close')
      }
    }
  },
  mounted () {
    this.apiService = new APIservice(this)
    // this.loadCharts()
  },
  methods: {
    setTime (val) {
      this.time = val
    },
    // async loadCharts () {
    //   this.charts = await this.apiService.getSiloHistoryTrend(this.base, this.from, this.to)
    // },
    close () {
      this.$emit('close')
    },
    changeFromTo (value) {
      this.from = new Date(value.from).toISOString().replace('T', ' ')
      this.to = new Date(value.to).toISOString().replace('T', ' ')
      // this.loadCharts()
    }
  }
}
</script>
