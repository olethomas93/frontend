<!--- En marker som viser en lokasjon --->

<template>
  <div :class="{markerTitle:seamap}">
    <h3 class="text-subtitle-2" style="white-space: nowrap">
      {{ title }}
    </h3>
    <div
      :style="{'background':
        color}"
      class="blob"
      :class="{ pulse : alarmCount.unacked > 0}"
      @click="navigate"
      @mouseenter="showInfo"
    >
      {{ alarmCount.alarms }}
    </div>
    <!-- <div v-if="hovered" class="fade" @mouseleave="showInfo">
      <div class="btns">
        <v-btn @click="navigate">
          Til Lokasjon
        </v-btn>
        <v-btn @click="openAlarmDialog">
          Alarmliste
        </v-btn>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    title: { type: String, default: 'title' },
    nodeid: { type: String, default: 'id' },
    connected: { type: Boolean, default: true },
    seamap: { type: Boolean, default: false },
    display: { type: String, default: '' }
  },
  data () {
    return {
      hovered: false
    }
  },

  computed: {
    ...mapGetters('alarming', [
      'getAlarmCount',
      'getAlarms'
    ]),
    alarms () {
      const node = this.nodeid
      return this.getAlarms(node) // this.$store.state.alarming.alarms.filter((alarm) => { return alarm.base.includes(this.item.id) })
    },
    alarmCount () {
      const node = this.nodeid
      return this.getAlarmCount(node)
    },
    color () {
      if (!this.connected) {
        return '#505050'
      }
      if (this.alarmCount.alarms > 0) {
        return this.alarmCount.color
      } else {
        return this.$vuetify.theme.currentTheme.success
      }
    }
  },
  watch: {

  },
  mounted () {
  },
  methods: {
    navigate () {
      this.$emit('_click', '')
    },
    showInfo () {
      this.hovered = !this.hovered
    },
    openAlarmDialog (item) {
      const node = this.nodeid.split('=')[2]
      this.$eventBus.$emit('alarmDialog', { cmd: 'open', filter: { search: node, locationFilter: [this.title] } })
      // this.$router.push({ query: { showAlarmDialog: true, alarmDialogFilter: filter } })
    }
  }
}

</script>

<style scoped>
.blob {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  margin: 10px;
  height: 3em;
  width: 3em;
  opacity: 0.8;
  transform: scale(1);
}

.btns{
    display: flex;
    flex-direction: row;
}

.pulse {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(0.95);
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    transform: scale(1);
     box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(0.95);
     box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
.fade { animation: fadeIn 1s;
    display: flex;
    flex-direction: column;
    align-items: center;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.markerTitle{
  color: black;
}
</style>
