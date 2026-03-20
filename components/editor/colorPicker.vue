<template>
  <v-color-picker
    :value="value"
    show-swatches
    :swatches="swatches"
    mode="hexa"
    @input="$emit('input', $event)"
  />
  <!-- <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="color"
    persistent
    width="290px"
    @update:return-value="setValue"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="color"
        label="value"
        readonly
        variant="filled"
        outlined
        :color="color"
        v-bind="props"
      >
        <template #append>
          <v-icon :color="color" v-bind="props">
            mdi-palette
          </v-icon>
        </template>
      </v-text-field>
    </template>
    <v-card>
      <v-card-title>
        Edit
      </v-card-title>
      <v-card-text>
        <v-color-picker
          v-model="color"
          show-swatches
          :swatches="swatches"
          mode="hexa"
        />
        <v-spacer />
        <v-btn
          variant="text"
          color="primary"
          @click="modal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          color="primary"
          @click="$refs.dialog.save(color)"
        >
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog> -->
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '#ffffff'
    }
    // item: {
    //   type: Object,
    //   default: () => { return {} }
    // }
  },
  data () {
    return {
      // modal: false,
      // color: '#ffffff',
      swatches: [
        [this.$vuetify.theme.currentTheme.primary],
        [this.$vuetify.theme.currentTheme.success],
        [this.$vuetify.theme.currentTheme.warning],
        [this.$vuetify.theme.currentTheme.error],
        [this.$vuetify.theme.currentTheme.critical]
      ]
    }
  }
  // watch: {
  //   base: {
  //     immediate: true,
  //     handler (val) {
  //       top.webMI.data.read(this.base, (e) => {
  //         this.color = e.value
  //       })
  //     }
  //   }
  // },
  // methods: {
  //   setValue (val) {
  //     // console.log(val)
  //     top.webMI.data.write(this.base, val)
  //   }
  // }
}
</script>

<style>

</style>
