<template>
  <div>
    <!-- <v-layout row justify-center> -->
    <alarm-icon :node-id="base" :show-shelved="false" :overlap="true" :main="true" always />
    <v-dialog v-model="dialog" max-width="1600" :fullscreen="$vuetify.breakpoint.smAndDown">
      <v-card>
        <v-card-title class="headline">
          Events
          <v-spacer />
          <!-- <v-btn icon @click="openAlarmViewer">
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props">
                  mdi-open-in-new
                </v-icon>
              </template>
              <span>Åpne i eget vindu</span>
            </v-tooltip>
          </v-btn> -->
          <v-btn icon @click="dialog=false">
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-icon v-bind="props">
                  mdi-close
                </v-icon>
              </template>
              <span>Lukk</span>
            </v-tooltip>
          </v-btn>
        </v-card-title>
        <alarm-list-2 :filter="filter" :location-filter="locationFilter" @close="dialog=false" />
        <!-- <atvise-visu-v3 :query="{ filter }" settings="SYSTEM.LIBRARY.ATVISE.OBJECTDISPLAYS._jmhVue.alarming.list" /> -->
      </v-card>
    </v-dialog>
    <!-- </v-layout> -->
  </div>
</template>

<script>
import alarmList from '@/components/common/alarm/list'
// import listConditions from '@/components/common/alarm/listConditions'
// import alarmCfg from '@/components/common/alarm/listCfg'
import alarmIcon from '@/components/common/alarm/icon'

export default {
  components: {
    // alarmCfg,
    // listConditions,
    alarmList2: alarmList,
    alarmIcon
  },
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    }
  },
  data () {
    return {
      dialog: false,
      filter: '',
      locationFilter: [],
      childViewer: undefined,
      interval: undefined
    }
  },
  computed: {
    // alarms () {
    //   return this.$store.state.alarming.alarms
    // },
    alarmCount () {
      return this.$store.getters['alarming/alarmCount']
    }
  },
  watch: {
  },
  mounted () {
    this.listAlarms()
    this.getConditions()
    this.getCategories()
    // alarm subscription suddenly stops, so this is a fix to reinit subscription at intervals
    // Jørgen 06.03.2023
    this.refreshSub()

    this.$eventBus.$on('alarmDialog', (data) => {
      if (data.cmd) {
        if (data.cmd === 'open') {
          this.dialog = true
        }
        if (data.cmd === 'close') {
          this.dialog = false
        }
      }
      this.filter = data.filter || {}
    })
  },
  destroyed () {
    this.$eventBus.$off('alarmDialog')
    clearInterval(this.interval)
  },
  methods: {
    listAlarms () {
      this.$store.dispatch('alarming/list')
    },
    refreshSub () {
      this.interval = setInterval(this.listAlarms, 60 * 1000)
    },
    getConditions () {
      this.$store.dispatch('alarming/conditions')
    },
    getCategories () {
      this.$store.dispatch('alarming/getCategories')
    },
    openAlarmViewer () {
      if (!this.childViewer) {
        this.childViewer = window.open('/alarms', 'Alarm viewer', 'menubar=0, titlebar=0 ')
        this.childViewer.onunload = () => { this.childViewer = undefined }
      }
    }
  }
}
</script>

<style>
</style>
