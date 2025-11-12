<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="color"
    persistent
    width="290px"
    @update:return-value="setValue"
  >
    <template #activator="{ on }">
      <v-text-field
        _v-model="color"
        :value="color"
        :label="label"
        filled
        outlined
        dense
        clearable
        :color="color"
        @change="setValue"
        @keydown.stop=""
      >
        <template #prepend>
          <v-icon v-on="on">
            mdi-palette
          </v-icon>
        </template>
        <template #prepend-inner>
          <v-icon :color="color" v-on="on">
            mdi-square-rounded
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
          v-if="modal"
          v-model="color"
          show-swatches
          :swatches="swatches"
          mode="hexa"
        />
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="modal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="$refs.dialog.save(color)"
        >
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: undefined
    },
    item: {
      type: Object,
      default: () => { return {} }
    },
    value: {
      type: String,
      default: '#ffffff'
    },
    label: {
      type: String,
      default: 'Value'
    }
  },
  data () {
    return {
      modal: false,
      color: '#ffffff',
      swatches: [
        [this.$vuetify.theme.currentTheme.primary],
        [this.$vuetify.theme.currentTheme.success],
        [this.$vuetify.theme.currentTheme.warning],
        [this.$vuetify.theme.currentTheme.error],
        [this.$vuetify.theme.currentTheme.critical]
      ]
    }
  },
  watch: {
    modal (val) {
      if (val && this.color === null) {
        this.color = '#26D07C7C'
      }
    },
    base: {
      immediate: true,
      handler (val) {
        if (this.base) {
          top.webMI.data.read(this.base, (e) => {
            this.color = e.value
          })
        }
      }
    },
    value: {
      immediate: true,
      handler (val) {
        this.color = val
      }
    }
  },
  methods: {
    setValue (val) {
      this.$emit('input', val)
      if (this.base) {
        top.webMI.data.write(this.base, val)
      }
    }
  }
}
</script>

<style>

</style>
