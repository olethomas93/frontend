<template>
  <div>
    <v-btn
      dark
      :color="status ? onColor : offColor"
      :loading="loading"
      v-bind="$attrs"
      :disabled="status"
      @click.stop="dialog = true"
    >
      <slot />
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card color="primary">
        <v-card-title color="green-darken-1">
           {{ `${$T(title)}` }}
        </v-card-title>
        <v-card-subtitle>
          {{ `${$T(promtText)}` }}
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer />

          <v-btn

            variant="text"
            @click="dialog = false"
          >
            {{ $T('No') }}
          </v-btn>

          <v-btn

            variant="text"
            @click="fireEvent($event)"
          >
            {{ $T('Yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: ''
    },
    setValue: {
      type: [Number],
      default: 0
    },
    statusNode: {
      type: String,
      default: undefined
    },
    onColor: {
      type: String,
      default: 'success'
    },
    offColor: {
      type: String,
      default: undefined
    },
    timeoutMs: {
      type: Number,
      default: 5000
    },
    promtText: {
      type: String,
      default: 'Er du sikker?'
    },
    title: {
      type: String,
      default: 'Advarsel'
    }
  },
  data: () => ({
    status: false,
    loading: false,
    timeout: undefined,
    dialog: false,
    sub: []
  }),
  watch: {
    loading (val) {
      if (val) {
        this.timeout = setTimeout(() => {
          this.reset()
          // TODO: trigger fault message on screen
        }, this.timeoutMs)
      }
    },
    statusNode () {
      const sub = top.webMI.data.subscribe(this.statusNode, (e) => {
        setTimeout(() => {
          this.reset()
          clearTimeout(this.timeout)
          this.status = Boolean(e.value)
        }, 500)
      })

      this.sub.push(sub)
    }
  },
  mounted () {
    if (this.statusNode) {
      const sub = top.webMI.data.subscribe(this.statusNode, (e) => {
        setTimeout(() => {
          this.reset()
          clearTimeout(this.timeout)
          this.status = e.value
        }, 500)
      })

      this.sub.push(sub)
    }
  },
  destroyed () {
    top.webMI.data.unsubscribe(this.sub)
  },
  methods: {
    reset () {
      // Clear loading state and reset command
      this.loading = false
      // top.webMI.data.write(this.base, !this.setValue)
    },
    fireEvent (e) {
      this.dialog = false
      this.writeData()
    },
    writeData () {
      this.loading = true
      top.webMI.data.write(this.base, this.setValue, (data) => {
        // if (data.errorstring) {
        //   alert(data.errorstring + ' ' + this.base)
        //   this.reset()
        // }
      })
    }
  }
}
</script>

<style>

</style>
