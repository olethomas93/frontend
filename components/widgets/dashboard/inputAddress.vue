<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="value"
    persistent
    width="800px"
    @update:return-value="$emit('input', value)"
  >
    <template #activator="{ props }">
      <v-text-field
        :value="value"
        :label="label"
        :readonly="false"
        outlined
        variant="filled"
        density="compact"
        @change="$emit('input', $event)"
        @keydown.stop=""
      >
        <template #prepend>
          <v-icon v-bind="props">
            mdi-file-tree
          </v-icon>
          <!-- <v-icon @click="relative = !relative">
            mdi-alpha-r-box-outline
          </v-icon>
          <v-select
            v-if="relative"
            :items="queryItems"
            density="compact"
            variant="outlined"
            hide-details
            style="width:100px"
          /> -->
        </template>
      </v-text-field>
    </template>
    <v-card>
      <v-card-title>
        Edit
      </v-card-title>
      <v-card-text style="overflow:scroll;height:600px">
        <tree-view :base="base" :types="types" @update:active="val1 = $event[0].nodeid" />
        <!-- <v-text-field
          v-model="value"
          :label="item.displayname"
          :hint="item.description"
          persistent-hint
          @keydown.stop=""
        /> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          color="primary"
          @click="modal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          color="primary"
          @click="$refs.dialog.save(val1)"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    // item: {
    //   type: Object,
    //   default: () => { return {} }
    // },
    label: {
      type: String,
      default: 'Value'
    },
    value: {
      type: String,
      default: undefined
    },
    types: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      modal: false,
      val1: undefined,
      relative: false
    }
  },
  computed: {
    queryItems () {
      return Object.keys(this.$route.query).map((i) => {
        return { text: i, value: this.$route.query[i] }
      })
    }
  }
}
</script>

<style>
/* .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-outer, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-inner, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer, .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-outer, .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-inner, .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner, .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer{
  margin-top: 0px
} */
</style>
