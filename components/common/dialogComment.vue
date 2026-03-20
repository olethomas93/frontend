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
        {{ $T(message || '') }}
        <v-text-field
          ref="comment"
          v-model="comment"
          :label="$T('Comment')"
          :placeholder="$T('Your comment here')"
          @keydown.stop=""
          @keydown.esc.stop="cancel"
          @keydown.enter.stop="agree"
        />
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
/**
 * Vuetify Confirm Dialog component
 *
 * Insert component where you want to use it:
 * <confirm ref="confirm"></confirm>
 *
 * Call it:
 * this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {})
 * Or use await:
 * if (await this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' })) {
 *   // yes
 * }
 * else {
 *   // cancel
 * }
 *
 * Alternatively you can place it in main App component and access it globally via this.$root.$confirm
 * <template>
 *   <v-app>
 *     ...
 *     <confirm ref="confirm"></confirm>
 *   </v-app>
 * </template>
 *
 * mounted() {
 *   this.$root.$confirm = this.$refs.confirm.open
 * }
 */
export default {
  data: () => ({
    comment: '',
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: 'primary',
      width: 290,
      zIndex: 200
    }
  }),
  watch: {
    dialog (val) {
      if (val === true) {
        this.$nextTick(() => {
          console.log('focus!!')
          setTimeout(() => {
            this.$refs.comment.$refs.input.focus()
          }, 300)
        })
      }
    }
  },
  mounted () {
  },
  methods: {
    open (title, message, options) {
      this.comment = ''
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
      this.resolve(this.comment.length > 0 ? this.comment : 'no comment')
      this.dialog = false
    },
    cancel () {
      this.resolve(null)
      this.dialog = false
    }
  }
}
</script>
