<template>
  <div>
    <div>
      <div
        v-if="showIcon === 'invisible'"
        style="width:100%;height:100%;"
      />
      <v-btn
        v-else
        :color="color"
        :icon="showIcon === 'icon'"
        :class="{'disable-events': !enabled || !hasRight}"
        :depressed="!enabled || !hasRight"
        :elevation="!enabled || !hasRight ? 0 : 5"
        v-bind="$attrs"
        _v-bind="attrs"
        @click.stop="dialog = true"
      >
        <v-icon v-if="showIcon === 'icon'">
          {{ icon }}
        </v-icon>
        <slot v-else />
      </v-btn>
    </div>
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :width="width"
      :persistent="modal"
    >
      <v-card>
        <v-card-title class="headline">
          {{ title || "" }}
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <atviseVisuV3
            v-if="dialog"
            :settings="display"
            :base="base"
            :style="{height: `${height}px`}"
            :query="query"
          />
        </v-card-text>
      <!-- <v-card-text
        :style="{
          height: height + 'px',
          maxHeight: height + 'px',
          overflow: 'auto',
          padding: 0
        }"
      >
        <v-container fluid style="height: 100%">
          <v-row>
            <v-col style="padding:0;">
              <atviseVisuV3
                v-if="dialog"
                :settings="display"
                :base="base"
                :style="{height: `${height}px`}"
                :query="query"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text> -->
      </v-card>
    </v-dialog>
  <!-- <v-btn
    :color="color"
    :class="{'disable-events': !enabled || !hasRight}"
    :depressed="!enabled || !hasRight"
    :elevation="!enabled || !hasRight ? 0 : 5"
    v-bind="$attrs"
    @click="fireEvent"
  >
    <slot />
  </v-btn> -->
  </div>
</template>

<script>
import atvise from '@/global/atvise_mixin'
export default {
  mixins: [atvise],
  props: {
    base: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: undefined
    },
    display: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 800
    },
    width: {
      type: Number,
      default: 800
    },
    modal: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'mdi-cog'
    },
    showIcon: {
      type: [Boolean, String],
      default: 'button'
    },
    query: {
      type: Object,
      default: () => { return {} }
    }
  },
  data: () => ({
    dialog: false
    // status: false,
    // loading: false,
    // timeout: undefined
  }),
  watch: {
  },
  mounted () {
    // if (this.statusNode) {
    // }
  },
  methods: {
    // fireEvent () {
    //   console.log('show popup')
    //   top.webMI.trigger.fire('showPopup', { base: this.base, display: this.display, title: this.title, width: this.width, height: this.height })
    // }
  }
}
</script>

<style>
  .disable-events {
    pointer-events: none
  }
</style>
