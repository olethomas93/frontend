<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-chip @click.stop="openDisplay">
    {{ value }}
  </v-chip>
  <!-- <v-btn icon :href="value" :target="openInNew ? '_blank' : ''">
    <v-icon>
      {{ openInNew ? 'mdi-open-in-new' : 'mdi-open-in-app' }}
    </v-icon>
  </v-btn> -->
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: undefined
    },
    value: {
      type: String,
      default: ''
    },
    display: {
      type: String,
      default: undefined
    }
  },
  methods: {
    openDisplay () {
      const query = { base: this.item.projectId, display: this.display }
      console.log(query)
      this.$router.push({ query })
    }
  }
}
</script>

<style>

</style>
