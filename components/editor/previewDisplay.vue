<template>
  <div>
    <atvise-visu-v3 :base="base" :settings="item.nodeid" />
  </div>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    item: {
      type: Object,
      default: () => { return {} }
    }
  }
}
</script>

<style>

</style>
