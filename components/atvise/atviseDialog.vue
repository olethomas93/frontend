<template>
  <v-dialog
    v-if="dialog"
    v-model="dialog"
    :fullscreen="fullscreen || $vuetify.breakpoint.smAndDown || config.fullscreen"
    :width="width"
    :persistent="config.modal"
  >
    <v-card :style="{height: fullscreen ? '85vh' : `${height + 68}px`}" style="overflow-x:hidden;">
      <v-card-title class="headline">
        {{ config.title || "" }}
        <v-spacer />
        <alarm-icon :node-id="base" overlap />
        <v-btn icon @click="fullscreen = !fullscreen">
          <v-icon>{{ fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }} </v-icon>
        </v-btn>
        <v-btn icon @click="dialog = false">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height:calc(100% - 104px)">
        <div style="height: 100%">
          <atviseVisuV3
            v-if="config.advanced === true"
            :settings="config.display"
            :base="config.base"
            :query="config.query"
            @closeDialog="dialog=false"
          />
          <iframe
            v-else
            id="popup_iframe"
            frameborder="0"
            class="pa-0"
            style="display:block;margin:auto;height:100%"
            _style="`width: ${width-20}px; height: ${height}px; overflow: hidden;`"
            :style="`width: ${width-20}px;overflow: hidden;`"
            scrolling="no"
            :src="`/${config.language || 'en'}/xhtml/${config.display}?base=${config.base}&amp;language=${config.language || 'en'}`"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import alarmIcon from '@/components/common/alarm/iconButton'
export default {
  components: {
    alarmIcon
  },
  data: () => ({
    dialog: false,
    config: {},
    drop: false,
    fullscreen: false
  }),
  computed: {
    base () {
      return this.config.base || ''
    },
    width () {
      return Number(this.config.width) || 500
    },
    height () {
      return Number(this.config.height) || ''
    }
  },
  mounted () {
    top.webMI.trigger.connect('showPopup', (e) => {
      // console.log('popup event', e)
      this.dialog = true
      this.config = e.value
    })

    top.webMI.trigger.connect('hidePopup', (e) => {
      this.dialog = false
    })
    top.webMI.trigger.connect('closePopup', (e) => {
      this.dialog = false
    })
  }
}
</script>

<style>
</style>
