<template>
  <div v-if="Number.isInteger(value) ">
    {{ value.toFixed(0) }} {{ item.childs.unit.value }}
  </div>
  <data-table-widget-lamp v-else :value="value" :normally-close="normallyClose" :colors="colors" :tooltip-text="tooltipText" />
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => { return {} }
    },
    value: {
      type: [Number, Boolean],
      default: 0
    },
    unit: {
      type: String,
      default: '%'
    },
    decimals: {
      type: Number,
      default: 0
    },
    colors: {
      type: Object,
      default: () => { return { success: 'green', error: 'grey' } }

    },
    normallyClose: {
      type: Boolean,
      default: true
    },
    tooltipText: {
      type: Object,
      default: () => { return { success: 'Good', error: 'Error' } }

    }

  }
}
</script>

<style>

</style>
