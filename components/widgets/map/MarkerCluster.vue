<template>
  <div style="display: none">
    <slot v-if="ready" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, provide, inject } from 'vue'
import { InjectionKeys } from '@vue-leaflet/vue-leaflet'

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['ready'])

const addLayer = inject(InjectionKeys.AddLayerInjection)
const removeLayer = inject(InjectionKeys.RemoveLayerInjection)

const ready = ref(false)
let clusterGroup = null

// Expose the cluster group object (replaces this.$refs.clusterRef.mapObject)
const mapObject = ref(null)
defineExpose({ mapObject })

// Allow child markers to add/remove themselves from the cluster group
provide(InjectionKeys.AddLayerInjection, (layer) => {
  clusterGroup?.addLayer(layer.leafletObject ?? layer)
})
provide(InjectionKeys.RemoveLayerInjection, (layer) => {
  clusterGroup?.removeLayer(layer.leafletObject ?? layer)
})

onMounted(async () => {
  const L = await import('leaflet').then(m => m.default ?? m)
  // leaflet.markercluster requires L on window before it is imported
  window.L = L
  await import('leaflet.markercluster')
  clusterGroup = new L.MarkerClusterGroup(props.options)
  mapObject.value = clusterGroup
  addLayer?.({ leafletObject: clusterGroup })
  ready.value = true
  emit('ready', clusterGroup)
})

onBeforeUnmount(() => {
  removeLayer?.({ leafletObject: clusterGroup })
  clusterGroup = null
})
</script>
