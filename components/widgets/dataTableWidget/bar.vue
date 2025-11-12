<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-progress-linear :value="value" :color="color" v-bind="$attrs" height="25">
    {{ parseInt(value) }} {{ unit }}
  </v-progress-linear>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: '%'
    },
    color: {
      type: String,
      default: 'primary'
    }
  }
}
</script>

<style>

</style>
