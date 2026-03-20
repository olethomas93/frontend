<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        Delete reference
      </v-card-title>
      <v-card-text>
        Delete reference to: {{ selected.displayname }} ?
        <!-- <v-select v-model="selected" placeholder="Please select object to reference..." :items="unusedItems" item-title="displayname" item-value="nodeid" /> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel">
          Cancel
        </v-btn>
        <v-btn @click="deleteRef">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => { return {} }
    }
  },
  methods: {
    cancel () {
      this.$emit('close')
    },
    deleteRef () {
      top.webMI.data.call('JMH_deleteReference', { parentId: this.base, childId: this.selected.nodeid }, (e) => {
        if (e.error) {
          this.$store.commit('SET_CUSTOM_ALERT', { message: e.errorstring })
        } else {
          this.$emit('close')
        }
      })
    }
  }
}
</script>

<style>

</style>
