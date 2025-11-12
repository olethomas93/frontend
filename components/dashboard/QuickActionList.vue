<template>
  <n-card class="border border-white/5 bg-slate-900/60" size="large">
    <template #header>
      <h2 class="text-base font-semibold text-white">Quick actions</h2>
    </template>
    <div class="space-y-3">
      <button
        v-for="action in actions"
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
</template>

<script setup lang="ts">
interface QuickAction {
  label: string
  helper: string
  handler: () => void
}

defineProps<{
  actions: QuickAction[]
}>()
</script>
