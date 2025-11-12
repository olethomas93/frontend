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
        <KpiMetricCard
          v-for="metric in metrics"
          :key="metric.label"
          :label="metric.label"
          :value="metric.value"
          :trend="metric.trend"
          :helper="metric.helper"
        />
      </div>
    </header>

    <div class="grid gap-6 xl:grid-cols-[2fr,1fr]">
      <TelemetryOverview
        :loading="loading"
        :selected-span="selectedSpan"
        :spans="spans"
        :chart-data="chartData"
        :aggregate="aggregate"
        @update:selected-span="handleSpanChange"
      />

      <div class="space-y-6">
        <AlertList :alerts="alerts" @acknowledge-all="acknowledgeAll" />
        <QuickActionList :actions="quickActions" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

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

const metrics = reactive([
  { label: 'Active nodes', value: '128', trend: 4.6, helper: 'Connected field devices reporting in real time.' },
  { label: 'Automation flows', value: '42', trend: 1.2, helper: 'Orchestration pipelines executed in the last hour.' },
  { label: 'Acknowledged alarms', value: '87%', trend: 2.1, helper: 'Response rate across operators during this shift.' },
  { label: 'SLA uptime', value: '99.98%', trend: 0.02, helper: 'Infrastructure availability over the last 30 days.' }
])

const spans: Array<'24h' | '7d' | '30d'> = ['24h', '7d', '30d']
const selectedSpan = ref<'24h' | '7d' | '30d'>('24h')
const loading = ref(false)
const chartData = ref<ChartPoint[]>(getChartData(selectedSpan.value))
const aggregate = reactive<AggregateSummary>({ baseload: 48, peak: 92, peakTime: '04:20 UTC', efficiency: 87 })

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
    level: 'critical' as const,
    title: 'Boiler 7 thermal runaway',
    description: 'Automatic shutdown engaged. Manual verification required.',
    detected: '2 minutes ago'
  },
  {
    id: 'alert-2',
    level: 'warning' as const,
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

function getChartData (span: '24h' | '7d' | '30d'): ChartPoint[] {
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

function handleSpanChange (value: '24h' | '7d' | '30d') {
  selectedSpan.value = value
}
</script>
