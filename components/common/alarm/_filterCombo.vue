<template>
  <v-combobox
    _v-model="filter"
    :items="items"
    :label="label"
    :multiple="true"
    dense
    clearable
    single-line
    @change="$emit('change', $event)"
  >
    <!-- Erstatter normal selection data, vil bare vise antall valgt ved flere valg -->
    <template v-slot:selection="data">
      <div v-if="data.index === 0 && filter.length < 2">
        {{ data.item }}
      </div>
      <div v-if="data.index === 0 && filter.length > 1">
        {{ filter.length }} valgt
      </div>
    </template>
  </v-combobox>
</template>

<script>
export default {
  props: {
    filter: {
      type: Array,
      default: () => { return [] }
    },
    label: {
      type: String,
      default: 'Label'
    },
    items: {
      type: Array,
      default: () => { return [] }
    }
  }
}
</script>

<style>

</style>
