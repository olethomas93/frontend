<template>
  <v-card
    v-bind="$attrs"
    :hover="hover"
    :class="{disabled:disabled,editMode: editMode}"
    style="border-radius:5px;width:100%;height:100%;"
    :ripple="false"
    _click="$emit('click', $event)"
  >
    <v-hover>
      <v-card-title v-if="title.length > 0" class="px-2 py-0" style="height:36px;cursor:pointer;" @click="$emit('click', $event)">
        <slot name="titleIcon" />
        <span class="subtitle-2">{{ fullscreen ? $route.params.location + ' ' + title: title }}</span>
        <v-spacer />
        <slot name="icons" />
        <alarm-icon v-if="!disableAlarmBell" ref="alarmIcon" overlap :node-id="base" style="z-index:10;" />
      </v-card-title>
    </v-hover>
    <!-- <v-divider class="mx-4" /> -->
    <slot style="position:absolute;" />
  </v-card>
</template>

<script>
// import { mapGetters } from 'vuex'
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
    menuItems: {
      type: Array,
      default: () => { return [{ title: 'Edit', emit: 'edit' }, { title: 'Delete', emit: 'delete' }] }
    },
    showMenu: {
      type: Boolean,
      default: false
    },
    editMode: {
      type: Boolean,
      default: false
    },
    disableAlarmBell: {
      type: Boolean,
      default: false
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
    // ...mapGetters('alarming', [
    //   'getAlarmCount'
    // ]),
    // alarmCount () {
    //   return this.getAlarmCount(this.base, this.showShelved)
    // },
    // inAlarm () {
    //   return this.alarmCount.alarms > 0
    // }
  },
  mounted () {
    this.$root.$on('card', (e) => {
      if (e.config.base.includes(this.base)) {
        switch (e.cmd) {
          case 'addButton':
            this.buttons.push({ ...e.config })
        }
      }
    })
  },
  destroyed () {
    this.$root.$off('card')
  },
  methods: {
    showPopup (config) {
      // top.webMI.trigger.fire('showPopup', { base: this.base, title: this.title, width: 800 })
      top.webMI.trigger.fire('showPopup', { ...config, title: `${this.title} - ${config.title}` })
    }
    // hovering (event) {
    //   this.isHovering = event
    //   this.$emit('hovering', event)
    // }
  }
}
</script>

<style scoped>
.alarm {
  background-color: var(--v-error-base);
}

.editMode {
  border-color: #ff7331;
  border-style: solid;
  border-width: medium;
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
</style>
