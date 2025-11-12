<template>
  <section class="space-y-8">
    <header class="flex flex-col gap-4 rounded-3xl border border-white/5 bg-slate-900/60 p-8 shadow-lg shadow-black/10">
      <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div class="max-w-2xl space-y-3">
          <p class="text-sm uppercase tracking-[0.35em] text-brand-200/80">live overview</p>
          <h1 class="text-3xl font-bold text-white sm:text-4xl">Operations dashboard</h1>
          <p class="text-sm text-slate-300">
            Monitor critical telemetry, respond to alarms and orchestrate process adjustments from a single Nuxt 3 interface powered by Vue 3.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <n-button strong secondary round @click="refresh">
            Refresh data
          </n-button>
          <n-button type="primary" round @click="launchAutomation">
            Launch automation
          </n-button>
        </div>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="metric in metrics"
          :key="metric.label"
          class="rounded-2xl border border-white/5 bg-white/5 p-5"
        >
          <p class="text-xs uppercase tracking-widest text-brand-200/70">{{ metric.label }}</p>
          <p class="mt-2 flex items-baseline gap-2 text-2xl font-semibold text-white">
            {{ metric.value }}
            <span class="text-xs font-medium" :class="metric.trend > 0 ? 'text-emerald-400' : 'text-rose-400'">
              {{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
            </span>
          </p>
          <p class="mt-2 text-xs text-slate-400">{{ metric.helper }}</p>
        </div>
      </div>
    </header>

    <div class="grid gap-6 xl:grid-cols-[2fr,1fr]">
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
            <n-tabs v-model:value="selectedSpan" size="small" type="segment" class="bg-white/10 p-1">
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
                <p class="mt-1 text-xs text-slate-400">Stable for the past {{ selectedSpan.toLowerCase() }}</p>
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

      <div class="space-y-6">
        <n-card class="border border-white/5 bg-slate-900/60" size="large">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-base font-semibold text-white">Active alerts</h2>
              <n-button text size="tiny" class="text-brand-200" @click="acknowledgeAll">
                Acknowledge all
              </n-button>
            </div>
          </template>
          <ul class="space-y-3">
            <li v-for="alert in alerts" :key="alert.id" class="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
              <div class="mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="alert.level === 'critical' ? 'bg-rose-400' : 'bg-amber-400'" />
              <div class="space-y-1">
                <p class="text-sm font-semibold text-white">{{ alert.title }}</p>
                <p class="text-xs text-slate-400">{{ alert.description }}</p>
                <p class="text-xs text-slate-500">Detected {{ alert.detected }}</p>
              </div>
            </li>
          </ul>
        </n-card>

        <n-card class="border border-white/5 bg-slate-900/60" size="large">
          <template #header>
            <h2 class="text-base font-semibold text-white">Quick actions</h2>
          </template>
          <div class="space-y-3">
            <button
              v-for="action in quickActions"
              :key="action.label"
              type="button"
              class="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:border-brand-400/60 hover:text-white"
              @click="action.handler()"
            >
              <span>{{ action.label }}</span>
              <span class="text-xs text-brand-200/80">{{ action.helper }}</span>
            </button>
          </div>
        </n-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

const metrics = reactive([
  { label: 'Active nodes', value: '128', trend: 4.6, helper: 'Connected field devices reporting in real time.' },
  { label: 'Automation flows', value: '42', trend: 1.2, helper: 'Orchestration pipelines executed in the last hour.' },
  { label: 'Acknowledged alarms', value: '87%', trend: 2.1, helper: 'Response rate across operators during this shift.' },
  { label: 'SLA uptime', value: '99.98%', trend: 0.02, helper: 'Infrastructure availability over the last 30 days.' }
])

const spans = ['24h', '7d', '30d']
const selectedSpan = ref<'24h' | '7d' | '30d'>('24h')
const loading = ref(false)
const chartData = ref(getChartData(selectedSpan.value))
const aggregate = reactive({ baseload: 48, peak: 92, peakTime: '04:20 UTC', efficiency: 87 })

watch(selectedSpan, (span) => {
  loading.value = true
  setTimeout(() => {
    chartData.value = getChartData(span)
    loading.value = false
  }, 450)
})

const alerts = reactive([
  {
    id: 'alert-1',
    level: 'critical',
    title: 'Boiler 7 thermal runaway',
    description: 'Automatic shutdown engaged. Manual verification required.',
    detected: '2 minutes ago'
  },
  {
    id: 'alert-2',
    level: 'warning',
    title: 'Telemetry gap – wind farm segment B',
    description: 'Packet loss detected on redundant uplink. Monitoring fallback channel.',
    detected: '14 minutes ago'
  }
])

const quickActions = [
  {
    label: 'Deploy updated orchestration plan',
    helper: 'v3.1.6',
    handler: () => {
      if (import.meta.client) {
        window.alert('Deployment pipeline triggered')
      }
    }
  },
  {
    label: 'Open maintenance schedule',
    helper: 'Next 7 days',
    handler: () => {
      if (import.meta.client) {
        window.alert('Maintenance schedule opened')
      }
    }
  },
  {
    label: 'Share snapshot with stakeholders',
    helper: 'Generate report',
    handler: () => {
      if (import.meta.client) {
        window.alert('Report generation queued')
      }
    }
  }
]

function getChartData (span: string) {
  if (span === '7d') {
    return [
      { label: 'North hub', value: 64, delta: 3.2 },
      { label: 'South hub', value: 58, delta: -1.8 },
      { label: 'Wind cluster', value: 42, delta: 4.1 },
      { label: 'Hydro plant', value: 37, delta: 2.5 }
    ]
  }
  if (span === '30d') {
    return [
      { label: 'North hub', value: 61, delta: 1.2 },
      { label: 'South hub', value: 55, delta: -2.1 },
      { label: 'Wind cluster', value: 44, delta: 6.3 },
      { label: 'Hydro plant', value: 39, delta: 3.7 }
    ]
  }
  return [
    { label: 'North hub', value: 68, delta: 5.2 },
    { label: 'South hub', value: 54, delta: 0.8 },
    { label: 'Wind cluster', value: 46, delta: 7.4 },
    { label: 'Hydro plant', value: 36, delta: -1.9 }
  ]
}

function refresh () {
  loading.value = true
  setTimeout(() => {
    chartData.value = getChartData(selectedSpan.value)
    loading.value = false
  }, 650)
}

function launchAutomation () {
  if (import.meta.client) {
    window.alert('Automation workflow started — simulation mode enabled.')
  }
}

function acknowledgeAll () {
  if (import.meta.client) {
    window.alert('All active alerts were acknowledged for this demo session.')
  }
}
</script>
