<template>
  <n-card class="border border-white/5 bg-slate-900/60" size="large">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-white">Active alerts</h2>
        <n-button text size="tiny" class="text-brand-200" @click="$emit('acknowledge-all')">
          Acknowledge all
        </n-button>
      </div>
    </template>
    <ul class="space-y-3">
      <li
        v-for="alert in alerts"
        :key="alert.id"
        class="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-4"
      >
        <div class="mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="alert.level === 'critical' ? 'bg-rose-400' : 'bg-amber-400'" />
        <div class="space-y-1">
          <p class="text-sm font-semibold text-white">{{ alert.title }}</p>
          <p class="text-xs text-slate-400">{{ alert.description }}</p>
          <p class="text-xs text-slate-500">Detected {{ alert.detected }}</p>
        </div>
      </li>
    </ul>
  </n-card>
</template>

<script setup lang="ts">
interface AlertItem {
  id: string
  level: 'critical' | 'warning'
  title: string
  description: string
  detected: string
}

defineProps<{
  alerts: AlertItem[]
}>()

defineEmits<{
  (event: 'acknowledge-all'): void
}>()
</script>
