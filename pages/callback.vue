<template>
  <div class="mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-3xl border border-white/5 bg-slate-900/60 p-8 text-center text-slate-100">
    <n-skeleton v-if="loading" :sharp="false" text class="w-full" :repeat="4" />
    <template v-else>
      <div class="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-300 text-2xl font-semibold text-slate-900">
        ✓
      </div>
      <h1 class="text-2xl font-semibold">Authentication complete</h1>
      <p class="text-sm text-slate-300">
        You have been redirected back from the identity provider. This page stores tokens securely and returns you to the application.
      </p>
      <n-button type="primary" round @click="backToApp">
        Continue to dashboard
      </n-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
})

function backToApp () {
  useRouter().push('/')
}
</script>
