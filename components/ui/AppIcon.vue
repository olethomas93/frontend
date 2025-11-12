<template>
  <svg
    v-if="name === 'menu'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
  <svg v-else-if="name === 'sunny'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" v-bind="$attrs">
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
  <svg v-else-if="name === 'moon'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" v-bind="$attrs">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
  <svg v-else-if="name === 'dashboard'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" v-bind="$attrs">
    <path d="M12 3v18M3 12h18" stroke-linecap="round" />
  </svg>
  <svg v-else-if="name === 'editor'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" v-bind="$attrs">
    <path d="M4 17.5V20h2.5L18.81 7.69l-2.5-2.5L4 17.5z" />
    <path d="M13.5 6.5l2.5 2.5" />
  </svg>
  <svg v-else-if="name === 'access'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" v-bind="$attrs">
    <path d="M7 11V7a5 5 0 1110 0v4" stroke-linecap="round" />
    <rect x="5" y="11" width="14" height="10" rx="2" />
  </svg>
  <svg v-else-if="name === 'chevron-down'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" v-bind="$attrs">
    <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name: 'menu' | 'sunny' | 'moon' | 'dashboard' | 'editor' | 'access' | 'chevron-down'
}>()
</script>
