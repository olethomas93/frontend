<template>
  <v-dialog
    v-model="dialog"
    width="500"
    persistent
    overlay-opacity="0.5"
  >
    <v-card color="error">
      <v-card-title>
        Offline
      </v-card-title>
      <v-list-item>
        <v-list-item-avatar
          tile
          size="80"
        >
          <v-icon size="80" color="white">
            mdi-alert-outline
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6 mb-1">
            Lost connection with server!
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions>
        <v-spacer />
        <v-btn outlined @click="refresh">
          Reload page
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data () {
    return {
      dialog: false,
      error: null
    }
  },
  computed: {
  },
  mounted () {
    top.webMI.data.addEventListener('statechange', (e) => {
      if (e === -1) {
        this.dialog = true
      }
    })
    // top.webMI.addEvent(top.webMI.data, 'statechange', function (state) {
    //   // document.getElementById('errorscreen').style.display = state < 0 ? 'block' : 'none'
    //   if (state < 0) {
    //     this.dialog = true
    //   }
    // })
  },
  methods: {
    refresh () {
      location.reload()
    }
  }
}
</script>
