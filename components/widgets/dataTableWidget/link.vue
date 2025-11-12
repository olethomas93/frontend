<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-btn icon :href="value" :target="openInNew ? '_blank' : ''">
    <v-icon>
      {{ openInNew ? 'mdi-open-in-new' : 'mdi-open-in-app' }}
    </v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    openInNew: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>

</style>
