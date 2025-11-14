<template>
  <div class="location-map-placeholder">
    <p class="title">
      Location map is temporarily unavailable in the Nuxt 3 build.
    </p>
    <p class="caption">
      The previous implementation depended on Vue 2 specific Google Maps components and
      must be replaced with a Vue 3 compatible map solution.
    </p>
  </div>
</template>

<script>
export default {
  name: 'LocationMap',
  emits: ['ready'],
  props: {
    locations: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    if (process.client) {
      console.warn('[location-map] This component is a placeholder. Please implement a Vue 3 compatible map widget.')
    }
    this.$emit('ready')
  }
}
</script>

<style scoped>
.location-map-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed var(--v-primary-base, #4caf50);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  min-height: 240px;
  background-color: rgba(76, 175, 80, 0.05);
}
.location-map-placeholder .title {
  font-weight: 600;
  margin-bottom: 8px;
}
.location-map-placeholder .caption {
  max-width: 480px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
