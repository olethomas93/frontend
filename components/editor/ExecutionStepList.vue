<template>
  <n-card class="border border-white/5 bg-slate-900/60">
    <template #header>
      <h2 class="text-base font-semibold text-white">Execution preview</h2>
    </template>
    <ul v-if="steps.length" class="space-y-4 text-sm text-slate-200">
      <li v-for="step in steps" :key="step.id" class="rounded-2xl border border-white/5 bg-white/5 p-4">
        <p class="text-xs uppercase tracking-wide text-brand-200/70">{{ step.type }}</p>
        <p class="mt-1 text-sm font-semibold text-white">{{ step.title }}</p>
        <p class="mt-1 text-xs text-slate-400">{{ step.description }}</p>
      </li>
    </ul>
    <div v-else class="text-sm text-slate-400">
      Provide a YAML definition to preview the resolved orchestration steps.
    </div>
  </n-card>
</template>

<script setup lang="ts">
interface WorkflowStep {
  id: string
  type: string
  title: string
  description: string
}

defineProps<{
  steps: WorkflowStep[]
}>()
</script>
