<template>
  <v-dialog :value="value" fullscreen height="600" width="800" @input="$emit('input', !value)">
    <v-card>
      <v-card-title>
        Add
        <v-spacer />
        <v-btn icon @click="$emit('input', false)">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height:700px;overflow-y:scroll;">
        <editor-editor v-model="selected" :types="types" v-on="$listeners" />
        <!-- <tree-view base="AGENT.OBJECTS" :types="['i=61','ObjectTypes.PROJECT','VariableTypes.PROJECT.measurement']" @update:active="selected = $event[0]" /> -->
      </v-card-text>
      <v-card-actions>
        <v-btn>Close</v-btn>
        <v-btn @click="$emit('add', selected)">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: undefined,
      dialog: false,
      types: [
        'i=61',
        'ObjectTypes.PROJECT',
        'VariableTypes.PROJECT.measurement'
      ]
    }
  }
}
</script>

<style>

</style>
