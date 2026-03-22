<template>
  <v-card
    :hover="hover"
    :class="{disabled:disabled}"
    style="border-radius:5px;width:100%;heigth:100%;"
    :ripple="false"
    _click="$emit('click', $event)"
  >
    <v-hover>
      <v-card-title class="px-2 py-0" style="height:36px;">
        <span class="subtitle-1">{{ title }}</span>
        <v-icon v-if="defaultDisplay" medium style="cursor:pointer;margin-left:1%" @click="$emit('click', $event)">
          mdi-resize
        </v-icon>
        <v-spacer />
        <slot name="topicons" />
        <alarm-icon ref="alarmIcon" overlap :node-id="base" style="z-index:10;" />
      </v-card-title>
    </v-hover>
    <v-divider class="mx-4" />
    <!-- <v-card-text style="height:calc(100% - 70px)"> -->
    <slot style="position:absolute;" />
    <!-- </v-card-text> -->
    <v-card-actions class="px-2 py-0 footer-buttons">
      <slot name="icons" />
    </v-card-actions>
  </v-card>
</template>

<script>
import alarmIcon from '@/components/common/alarm/iconButton.vue'
export default {
  components: {
    alarmIcon
  },
  props: {
    base: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      dafeult: false
    },
    title: {
      type: String,
      default: ''
    },
    hideAlarm: {
      type: Boolean,
      dafeult: true
    },
    selected: Boolean,
    hover: Boolean,
    timestamp: {
      type: String,
      default: ''
    },
    defaultDisplay: {
      type: [String, Object],
      default: undefined
    }
  },
  data: () => ({
    fullscreen: false,
    mouseHover: false,
    subId: 0,
    buttons: [],
    isHovering: false
  }),
  computed: {
    getAlarmCount () { return this.$store.getters['alarming/getAlarmCount'] },
    alarmCount () {
      return this.getAlarmCount(this.base, this.showShelved)
    },
    inAlarm () {
      return this.alarmCount.alarms > 0
    }
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
  }
}
</script>

<style scoped>
.alarm {
  background-color: var(--v-error-base);
}

.offline {
  color: red;
  font-size: 3vh;
  font-weight: bold;
  /* transform:rotate(-45deg); */
  -webkit-text-stroke: 1px rgb(48, 46, 46);
}

.disabled {
  filter: grayscale(50%) blur(0px) contrast(0.5);
}

.v-sheet--offset {
  top: -16px;
  left: 16px;
  z-index: 1;
  /* height:48px;
  width:48px; */
  position: absolute;
  border-radius: inherit;
}

.footer-buttons{
  margin: 10px;
  position: absolute;
  right: 0;
  bottom: 0;
}
.v-card {
  margin-bottom: 50px;
}
</style>
