<template>
  <v-dialog
    v-if="dialog"
    v-model="dialog2"
    :dark="$lodash.get(config, 'dark')"
    :fullscreen="smAndDown || fullscreen"
    :width="width"
    :persistent="config.modal"
  >
    <v-card :style="{height: fullscreen ? '85vh' : `${height}px`}" :color="$lodash.get(config, 'color')">
      <v-card-title class="headline">
        {{ config.title || '' }}
        <v-spacer />
        <v-btn icon @click="fullscreen = !fullscreen">
          <v-icon>
            {{ fullscreen ? 'mdi-fullscreen' : 'mdi-fullscreen-exit' }}
          </v-icon>
        </v-btn>
        <v-btn icon @click="$emit('close')">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height:calc(100% - 62px)">
        <!-- <div :style="{width:`100%`, height:`${height}px`}" /> -->
        <atviseVisuV3
          :settings="config.display"
          :base="$lodash.get(config, 'query.base') || ''"
          _style="{height: fullscreen ? '100%' : `${height}px`}"
          :query="config.query"
        />
      </v-card-text>
      <!-- <v-divider /> -->
      <!-- <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="$emit('close')">
          Lukk
        </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script>
import { useDisplay } from 'vuetify'

export default {
  setup () {
    const { smAndDown } = useDisplay()
    return { smAndDown }
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: () => ({
    dialog2: true,
    fullscreen: false
  }),
  computed: {
    width () {
      return this.config.width || 500
    },
    height () {
      return this.config.height || 500
    }
  }
}
</script>

<style>
</style>
