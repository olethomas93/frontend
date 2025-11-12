<template>
  <v-progress-linear :value="value" :color="color" v-bind="$attrs" :height="height" :style="{maxWidth: maxWidth}">
    <template v-if="showValue">
      {{ value.toFixed(decimals) }} {{ unit }}
    </template>
  </v-progress-linear>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [
    mixin
  ],
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    height: {
      type: Number,
      default: 25
    },
    showValue: {
      type: Boolean,
      default: true
    },
    decimals: {
      type: Number,
      default: 0
    }
  },
  computed: {
    unit () {
      return this.$lodash.get(this.item, 'childs.unit.value') || ''
    }
  }
}
</script>

<style>

</style>
