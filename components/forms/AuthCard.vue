<template>
  <div class="mx-auto w-full max-w-lg space-y-6 rounded-3xl border border-white/5 bg-slate-900/60 p-8 text-slate-100">
    <header v-if="eyebrow || title" class="space-y-2 text-center">
      <p v-if="eyebrow" class="text-sm uppercase tracking-[0.3em] text-brand-200/80">{{ eyebrow }}</p>
      <h1 v-if="title" class="text-2xl font-semibold">{{ title }}</h1>
      <p v-if="description" class="text-sm text-slate-300">
        {{ description }}
      </p>
    </header>
    <slot />
    <p v-if="footer" class="text-center text-xs text-slate-400">
      {{ footer }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  description?: string
  footer?: string
}>()
</script>
