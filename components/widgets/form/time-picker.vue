<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog
    ref="dialog"
    v-model="modal2"
    :return-value.sync="time"
    persistent
    width="290px"
    @input="save(time)"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="time"
        _label="Picker in dialog"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="$attrs"
        v-bind="props"
      />
    </template>
    <v-time-picker
      v-if="modal2"
      v-model="time"
      format="24hr"
      :allowed-minutes="allowedMinutes"
      full-width
    >
      <v-spacer />
      <v-btn
        variant="text"
        color="primary"
        @click="modal2 = false"
      >
        Cancel
      </v-btn>
      <v-btn
        variant="text"
        color="primary"
        @click="$refs.dialog.save(value)"
      >
        OK
      </v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: [String],
      default: '00:00'
    },
    allowedMinutes: {
      type: Array,
      default: () => { return undefined }
    }
  },
  data: () => ({
    time: '00:00',
    modal2: false
  }),
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.time = val
      }
    },
    time: {
      handler (val) {
        this.$emit('input', val)
      }
    }
  },
  mounted () {
    // this.time = this.value
  },
  methods: {
    save (val) {
      // this.time = val
      // this.$emit('input', val)
    }
  }
}
</script>

<style>

</style>
