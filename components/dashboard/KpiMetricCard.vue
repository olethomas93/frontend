<template>
  <div class="rounded-2xl border border-white/5 bg-white/5 p-5">
    <p class="text-xs uppercase tracking-widest text-brand-200/70">{{ props.label }}</p>
    <p class="mt-2 flex items-baseline gap-2 text-2xl font-semibold text-white">
      {{ props.value }}
      <span class="text-xs font-medium" :class="trendClass">
        {{ formattedTrend }}
      </span>
    </p>
    <p class="mt-2 text-xs text-slate-400">{{ props.helper }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: string
  trend: number
  helper: string
}>()

const trendClass = computed(() => (props.trend > 0 ? 'text-emerald-400' : 'text-rose-400'))
const formattedTrend = computed(() => `${props.trend > 0 ? '+' : ''}${props.trend}%`)
</script>
