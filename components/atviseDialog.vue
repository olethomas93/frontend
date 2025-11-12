<template>
  <v-dialog
    v-if="dialog"
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :width="width"
    :persistent="config.modal"
  >
    <v-card style="">
      <v-card-title class="headline">
        {{ config.title || '' }}
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <!-- <div :style="{width:`100%`, height:`${height}px`}" /> -->
        <atviseVisuV3
          :settings="config.display"
          :base="config.base"
          :style="{height: `${height}px`}"
          :query="config.query"
        />
      </v-card-text>
      <!-- <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="$emit('close')">
          Lukk
        </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    config: {}
  }),
  computed: {
    width () {
      return this.config.width || 500
    },
    height () {
      return this.config.height || 500
    }
  },
  mounted () {
    top.webMI.trigger.connect('showPopup', (e) => {
      this.dialog = true
      this.config = e.value
      // console.log(e)
    })
  }
}
</script>

<style>

</style>
