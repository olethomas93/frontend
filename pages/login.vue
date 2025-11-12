<template>
  <AuthCard
    eyebrow="Access"
    title="Operator sign in"
    description="Authenticate with your identity provider to unlock orchestration tools and dashboards."
    footer="Federation supported with Azure AD, Auth0 and on-premise identity bridges."
  >
    <form class="space-y-4" @submit.prevent="submit">
      <label class="block space-y-2 text-left">
        <span class="text-xs uppercase tracking-wide text-brand-200/80">Email</span>
        <n-input v-model:value="email" type="email" placeholder="alex@operations.example" />
      </label>
      <label class="block space-y-2 text-left">
        <span class="text-xs uppercase tracking-wide text-brand-200/80">Password</span>
        <n-input v-model:value="password" type="password" placeholder="••••••••" />
      </label>
      <div class="flex items-center justify-between text-sm text-slate-300">
        <label class="inline-flex items-center gap-2">
          <input v-model="remember" type="checkbox" class="h-4 w-4 rounded border-white/20 bg-slate-950 text-brand-400 focus:ring-brand-400" />
          <span>Remember me</span>
        </label>
        <button type="button" class="text-brand-200 hover:text-brand-100" @click="recover">
          Forgot password?
        </button>
      </div>
      <n-button type="primary" block size="large" class="mt-6" attr-type="submit">
        Sign in
      </n-button>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

const email = ref('')
const password = ref('')
const remember = ref(true)
const message = useMessage()

function submit () {
  if (!email.value || !password.value) {
    message.error('Please provide both email and password to continue.')
    return
  }
  message.success('Authentication succeeded in this demo environment.')
}

function recover () {
  message.info('Password recovery is handled by your identity provider.')
}
</script>
