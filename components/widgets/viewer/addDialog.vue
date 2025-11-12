<template>
  <v-dialog :value="value" :width="600" @input="$emit('input', $event)">
    <atvise-visu-v-3 :settings="typeDefinition + '.ux._add'" @close="$emit('close')" />
  </v-dialog>
</template>

<script>

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    typeDefinition: {
      type: String,
      default: 'ObjectTypes.PROJECT.AVJU.customer'
    }
  }
}
</script>

<style>

</style>
