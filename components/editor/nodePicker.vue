<template>
  <div>
    <v-text-field v-model="textFieldValue" :label="label" @click="openDialog" />

    <v-dialog v-model="dialog" max-width="400">
      <!-- <template v-slot:activator="{ props }">
          <v-btn color="primary" dark v-bind="props">Åpne popup</v-btn>
        </template> -->
      <v-card>
        <v-card-title>
          Popup med TreeView
        </v-card-title>
        <v-card-text style="height:400px;max-height:400px;overflow:auto">
          <tree-view :show-alarm="false" @click="click" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeDialog">
            Lukk
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Klikk her for å åpne popup'
    }
  },
  data () {
    return {
      dialog: false,
      textFieldValue: ''
    }
  },
  methods: {
    click (data) {
      this.textFieldValue = data.nodeid
      this.$emit('input', data.nodeid)
    },
    openDialog () {
      this.dialog = true
    },
    closeDialog () {
      this.dialog = false
    }
  }
}
</script>
