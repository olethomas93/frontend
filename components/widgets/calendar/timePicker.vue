<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="time"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
    @update:return-value="update"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="time"
        _label="Picker in dialog"
        _prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="{ ...$attrs, ...props }"
      />
    </template>
    <v-time-picker
      v-if="menu"
      v-model="time"
      format="24hr"
      :allowed-minutes="allowedMinutes"
      full-width
    >
      <v-spacer />
      <v-btn
        variant="text"
        color="primary"
        @click="menu = false"
      >
        Cancel
      </v-btn>
      <v-btn
        variant="text"
        color="primary"
        @click="save"
      >
        OK
      </v-btn>
    </v-time-picker>
  </v-menu>
  <!-- </v-dialog> -->
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
    menu: false
  }),
  watch: {
    value: {
      immediate: true,
      handler (val) {
        console.log('value changed !!', val)
        this.time = val
      }
    }
    // time: {
    //   handler (val) {
    //     this.$emit('input', val)
    //   }
    // }
  },
  mounted () {
    // this.time = this.value
  },
  methods: {
    save (val) {
      this.menu = false
      this.$refs.menu.save(this.time)
      // this.$emit('date', this.date)
      this.$emit('input', this.time)
    },
    update () {
      // this.$emit('input', this.time)
    }
  }
}
</script>

<style>

</style>
