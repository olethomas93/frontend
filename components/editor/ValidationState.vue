<template>
  <n-card class="border border-white/5 bg-slate-900/60" size="small">
    <template #header>
      <h2 class="text-base font-semibold text-white">Validation</h2>
    </template>
    <p class="text-sm text-slate-300">
      {{ message }}
    </p>
  </n-card>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>
