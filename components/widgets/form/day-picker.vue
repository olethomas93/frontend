<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-select
    v-model="value"
    multiple
    chips
    v-bind="$attrs"
    :items="items"
    @input="$emit('input', value)"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: [String],
      default: '00:00'
    }
  },
  data: () => ({
    items: [
      {
        text: 'Man',
        value: '1'
      },
      {
        text: 'Tirs',
        value: '2'
      },
      {
        text: 'Ons',
        value: '3'
      },
      {
        text: 'Tors',
        value: '4'
      },
      {
        text: 'Fre',
        value: '5'
      },
      {
        text: 'Lør',
        value: '6'
      },
      {
        text: 'Søn',
        value: '0'
      }
    ]
  })
}
</script>

<style>

</style>
