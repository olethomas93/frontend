<template>
  <v-btn
    v-show="items.length > 0"
    text
    icon
    @click="click(item.nodeid + '.locations')"
  >
    <v-badge :color="items.length > 0 ? 'primary' : 'transparent'" :overlap="true">
      <template #badge>{{ items.length > 0 ? items.length: '' }}</template>
      <v-icon>{{ icon }}</v-icon>
    </v-badge>
  </v-btn>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => { return {} }
    },
    value: {
      type: Object,
      default: () => { return {} }
    },
    icon: {
      type: String,
      default: 'mdi-map-marker'
    }
  },
  computed: {
    items () {
      return this.value ? this.toArray(this.value) : []
    }
  },
  methods: {
    click (address) {
      this.$router.push({ query: { base: address, display: address + '.default' } })
    },
    toArray (data) {
      return Object.keys(data).map((i) => {
        return data[i]
      })
    }
  }
}
</script>

<style>

</style>
