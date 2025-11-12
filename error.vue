<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-900 text-slate-100">
    <div class="w-full max-w-lg space-y-4 rounded-3xl border border-white/5 bg-slate-900/60 p-8 text-center">
      <h1 class="text-3xl font-semibold">{{ error.statusCode }} — {{ title }}</h1>
      <p class="text-sm text-slate-300">{{ description }}</p>
      <div class="flex items-center justify-center gap-3 pt-4">
        <n-button type="primary" @click="handleError">Return home</n-button>
        <n-button text @click="clearError">Dismiss</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const error = useError()
const title = computed(() => error.value?.statusMessage ?? 'Unexpected error')
const description = computed(() => error.value?.message ?? 'The application encountered an issue. Try again shortly.')

function handleError () {
  clearError({ redirect: '/' })
}
</script>
