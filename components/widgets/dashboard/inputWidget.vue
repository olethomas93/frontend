<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    persistent
    width="800px"
  >
    <template #activator="{ props }">
      <v-text-field
        :model-value="modelValue"
        :label="label"
        :readonly="false"
        density="compact"
        variant="outlined"
        @update:model-value="$emit('update:modelValue', $event)"
        @keydown.stop=""
      >
        <template #prepend>
          <v-icon v-bind="props">
            mdi-widgets
          </v-icon>
        </template>
      </v-text-field>
    </template>
    <v-card>
      <v-card-title>
        {{ $T('Select widget') }}
      </v-card-title>
      <v-card-text style="overflow:scroll;height:600px">
        <dashboard-widget-preview @add:widget="update" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          color="primary"
          @click="modal = false"
        >
          {{ $T('Cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  emits: ['update:modelValue'],
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    label: {
      type: String,
      default: 'Value'
    },
    modelValue: {
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
      modal: false
    }
  },
  methods: {
    update (val) {
      this.$emit('update:modelValue', val.nodeid)
      this.modal = false
    }
  }
}
</script>
