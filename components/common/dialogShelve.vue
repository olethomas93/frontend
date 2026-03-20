<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    persistent
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar theme="dark" :color="options.color" density="compact" flat>
        <v-toolbar-title class="text-white">
          {{ $T(title) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-4">
        <v-radio-group v-model="type">
          <v-radio :value="0" :label="$T('One shot')" />
          <v-radio :value="1" :label="$T('Timed')" />
        </v-radio-group>
        {{ $T(message || '') }}
        <v-container fluid>
          <v-row>
            <v-col cols="6">
              <v-text-field
                ref="time"
                v-model="time"
                :disabled="type === 0"
                :label="$T('Time')"
                type="number"
                :min="1"
                @keydown.stop=""
                @keydown.esc.stop="cancel"
                @keydown.enter.stop="agree"
              />
            </v-col>
            <v-col cols="6">
              <v-select v-model="timeUnit" :disabled="type === 0" :items="timeUnits" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer />
        <v-btn color="primary-darken-1" variant="text" @click="agree" @keydown.stop="">
          Ok
        </v-btn>
        <v-btn color="grey" variant="text" @click="cancel" @keydown.stop="">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    time: 1,
    type: 0,
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: 'primary',
      width: 290,
      zIndex: 200
    },
    timeUnit: 1000 * 60
  }),
  computed: {
    timeUnits () {
      return [
        {
          text: this.$T('minute(s)'),
          value: 1000 * 60
        },
        {
          text: this.$T('hour(s)'),
          value: 1000 * 60 * 60
        },
        {
          text: this.$T('day(s)'),
          value: 1000 * 60 * 60 * 24
        }
      ]
    }
  },
  watch: {
    dialog (val) {
      if (val === true) {
        this.$nextTick(() => {
          console.log('focus!!')
          setTimeout(() => {
            this.$refs.time.$refs.input.focus()
          }, 300)
        })
      }
    }
  },
  mounted () {
  },
  methods: {
    open (title, message, options) {
      this.time = 1
      this.dialog = true
      this.title = title
      this.message = message
      this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree () {
      if (this.type === 0) {
        this.resolve(-1)
      } else {
        this.resolve(Number(this.time) * this.timeUnit)
      }
      this.dialog = false
    },
    cancel () {
      this.resolve(undefined)
      this.dialog = false
    }
  }
}
</script>
