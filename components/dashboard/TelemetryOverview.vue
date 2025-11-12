<template>
  <n-card
    size="huge"
    class="border border-white/5 bg-slate-900/60"
    content-style="padding: 0;"
    header-style="padding: 24px;"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-widest text-brand-200/80">Telemetry</p>
          <h2 class="text-xl font-semibold text-white">Realtime energy throughput</h2>
        </div>
        <n-tabs v-model:value="internalSpan" size="small" type="segment" class="bg-white/10 p-1">
          <n-tab-pane v-for="span in spans" :key="span" :name="span">
            {{ span }}
          </n-tab-pane>
        </n-tabs>
      </div>
    </template>
    <div class="h-72 space-y-4 px-6 pb-6 pt-2">
      <n-skeleton v-if="loading" text :repeat="10" size="medium" class="max-w-xl" />
      <div v-else class="flex h-full flex-col justify-between">
        <div class="grid grid-cols-12 gap-2 rounded-2xl border border-white/5 bg-gradient-to-br from-brand-500/20 via-transparent to-brand-300/10 p-4">
          <div
            v-for="point in chartData"
            :key="point.label"
            class="col-span-3 flex flex-col gap-2 rounded-xl bg-white/5 p-3 text-xs"
          >
            <p class="text-brand-200/70">{{ point.label }}</p>
            <p class="text-lg font-semibold text-white">{{ point.value }} MW</p>
            <p :class="point.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'">
              {{ point.delta >= 0 ? '▲' : '▼' }} {{ point.delta }}%
            </p>
          </div>
        </div>
        <div class="grid gap-3 md:grid-cols-3">
          <div class="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
            <p class="text-xs uppercase tracking-wide text-brand-200/70">Baseload</p>
            <p class="mt-2 text-2xl font-semibold text-white">{{ aggregate.baseload }} MW</p>
            <p class="mt-1 text-xs text-slate-400">Stable for the past {{ internalSpan.toLowerCase() }}</p>
          </div>
          <div class="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
            <p class="text-xs uppercase tracking-wide text-brand-200/70">Peaks</p>
            <p class="mt-2 text-2xl font-semibold text-white">{{ aggregate.peak }} MW</p>
            <p class="mt-1 text-xs text-slate-400">Max recorded at {{ aggregate.peakTime }}</p>
          </div>
          <div class="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
            <p class="text-xs uppercase tracking-wide text-brand-200/70">Efficiency</p>
            <p class="mt-2 text-2xl font-semibold text-white">{{ aggregate.efficiency }}%</p>
            <p class="mt-1 text-xs text-slate-400">Optimized in last orchestration cycle</p>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ChartPoint {
  label: string
  value: number
  delta: number
}

interface AggregateSummary {
  baseload: number
  peak: number
  peakTime: string
  efficiency: number
}

const props = defineProps<{
  loading: boolean
  selectedSpan: string
  spans: string[]
  chartData: ChartPoint[]
  aggregate: AggregateSummary
}>()

const emit = defineEmits<{
  (event: 'update:selected-span', value: string): void
}>()

const internalSpan = computed({
  get: () => props.selectedSpan,
  set: (value: string) => emit('update:selected-span', value)
})
</script>
