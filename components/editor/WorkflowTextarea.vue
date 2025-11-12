<template>
  <label class="space-y-3">
    <span class="text-xs uppercase tracking-wide text-brand-200/70">{{ label }}</span>
    <textarea
      :value="modelValue"
      spellcheck="false"
      class="h-96 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 font-mono text-sm text-brand-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
}>()

defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()
</script>
