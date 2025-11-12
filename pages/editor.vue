<template>
  <div class="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
    <n-card class="border border-white/5 bg-slate-900/60" size="huge" content-style="padding: 0;">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-widest text-brand-200/80">workflow</p>
            <h1 class="text-xl font-semibold text-white">Process automation editor</h1>
          </div>
          <div class="flex items-center gap-3">
            <n-button text size="tiny" class="text-brand-200" @click="formatWorkflow">
              Format
            </n-button>
            <n-button type="primary" size="small" round @click="simulate">
              Simulate
            </n-button>
          </div>
        </div>
      </template>
      <div class="grid gap-4 p-6 lg:grid-cols-[minmax(0,1fr)]">
        <label class="space-y-3">
          <span class="text-xs uppercase tracking-wide text-brand-200/70">YAML workflow definition</span>
          <textarea
            v-model="workflow"
            spellcheck="false"
            class="h-96 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 font-mono text-sm text-brand-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
          />
        </label>
      </div>
    </n-card>

    <div class="space-y-6">
      <n-card class="border border-white/5 bg-slate-900/60">
        <template #header>
          <h2 class="text-base font-semibold text-white">Execution preview</h2>
        </template>
        <ul class="space-y-4 text-sm text-slate-200">
          <li v-for="step in parsedSteps" :key="step.id" class="rounded-2xl border border-white/5 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-brand-200/70">{{ step.type }}</p>
            <p class="mt-1 text-sm font-semibold text-white">{{ step.title }}</p>
            <p class="mt-1 text-xs text-slate-400">{{ step.description }}</p>
          </li>
        </ul>
        <div v-if="parsedSteps.length === 0" class="text-sm text-slate-400">
          Provide a YAML definition to preview the resolved orchestration steps.
        </div>
      </n-card>

      <n-card class="border border-white/5 bg-slate-900/60" size="small">
        <template #header>
          <h2 class="text-base font-semibold text-white">Validation</h2>
        </template>
        <p class="text-sm text-slate-300">
          {{ validationMessage }}
        </p>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import yaml from 'yaml'

const defaultWorkflow = `pipeline:
  name: high_pressure_restart
  schedule: every 30 minutes
  steps:
    - id: validate
      type: validation
      uses: sensors.diagnostics
    - id: warmup
      type: command
      uses: systems.boiler.preheat
      with:
        duration: 180
        target: 60
    - id: restart
      type: command
      uses: systems.boiler.restart
      with:
        fallback: cold_start
`

const workflow = ref(defaultWorkflow)

const parsedSteps = computed(() => {
  try {
    const parsed = yaml.parse(workflow.value)
    return (parsed?.pipeline?.steps ?? []).map((step: any) => ({
      id: step.id,
      type: step.type,
      title: step.uses?.replace('.', ' → ') ?? 'Unknown step',
      description: step.with
        ? Object.entries(step.with)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' • ')
        : 'No configuration required'
    }))
  } catch (error) {
    return []
  }
})

const validationMessage = computed(() => {
  try {
    const parsed = yaml.parse(workflow.value)
    if (!parsed?.pipeline?.steps?.length) {
      return 'The pipeline is missing executable steps.'
    }
    return `Ready to simulate ${parsed.pipeline.steps.length} step(s).`
  } catch (error) {
    return 'Invalid YAML — please correct the syntax to continue.'
  }
})

function formatWorkflow () {
  try {
    const parsed = yaml.parse(workflow.value)
    workflow.value = yaml.stringify(parsed)
  } catch (error) {
    if (import.meta.client) {
      window.alert('Unable to format due to invalid YAML.')
    }
  }
}

function simulate () {
  if (import.meta.client) {
    window.alert('Simulation started — results will stream in the activity feed.')
  }
}
</script>
