<!-- eslint-disable vue/no-mutating-props -->
<template>
  <alarm-icon overlap :base="address" />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    address () {
      return this.value.split('=').pop()
    }
  }
}
</script>

<style>

</style>
