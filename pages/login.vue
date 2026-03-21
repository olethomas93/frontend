<template>
  <v-container class="fill-height">
    <v-row class="justify-center">
      <v-card
        class="rounded px-6 py-8"
        light
        style="box-shadow: 0 0 40px 4px #111118 !important;"
        width="350"
      >
        <div class="d-flex justify-center rounded" style="width:100%">
          <v-img
            class="text-white align-end"
            _height="120px"
            _width="120px"
            :src="logo"
          />
        </div>
        <v-card-title>{{ $T(text) }}</v-card-title>

        <template v-if="showLocalForm">
          <v-card-text>{{ $T('Login in with local Atvise user') }}</v-card-text>
          <v-text-field
            v-model="user"
            placeholder="username"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            tabindex="1"
            autofocus
            :error-messages="formError ? [formError] : []"
            :disabled="loading"
            @keydown.stop=""
          />
          <v-text-field
            v-model="password"
            type="password"
            placeholder="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            tabindex="2"
            :disabled="loading"
            @keydown.stop=""
            @keydown.enter="loginLocal"
          />
          <v-btn
            tabindex="3"
            dark
            block
            :loading="loading"
            :disabled="loading"
            height="50"
            @click="loginLocal"
          >
            LOG IN
          </v-btn>
          <v-divider v-if="showAadForm" :thickness="3" class="border-opacity-50 ma-4" />
        </template>

        <template v-if="showAadForm">
          <v-card-text>{{ $T('Click here for signin with AAD') }}</v-card-text>
          <v-card-actions class="justify-center" :style="{ background: color }">
            <v-btn
              :dark="dark"
              block
              variant="text"
              height="50"
              @click="loginAAD"
            >
              {{ $T(btnText) }}
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'login' })

const router = useRouter()
const { loggedIn } = storeToRefs(useAuthStore())

// Redirect to the main page as soon as the auth state becomes logged-in.
// This covers both form-based login and SSO redirect restore.
watch(loggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    router.push('/')
  }
}, { immediate: true })
</script>

<script lang="ts">
export default {
  data() {
    return {
      formError: null as string | null,
      loading: false,
      user: '',
      password: ''
    }
  },
  computed: {
    loginWith(): string | undefined {
      // $config in Nuxt3 Options API exposes the public runtimeConfig
      return (this.$config as any)?.atvise?.login
    },
    // Show the local username/password form when:
    //  - LOGIN env var explicitly includes 'atviseLocal', OR
    //  - LOGIN is not configured and local mode is enabled (dev default)
    showLocalForm(): boolean {
      const lw = this.loginWith
      if (!lw) return Boolean((this.$config as any)?.atvise?.local)
      return lw.includes('atviseLocal')
    },
    showAadForm(): boolean {
      return Boolean(this.loginWith?.includes('aad'))
    },
    logo(): string {
      try { return (window as any).top?.config?.nuxt?.login?.logo?.src ?? 'logos/logo.png' } catch { return 'logos/logo.png' }
    },
    color(): string {
      try { return (window as any).top?.config?.nuxt?.login?.color ?? '#00a3e0' } catch { return '#00a3e0' }
    },
    dark(): boolean {
      try { return (window as any).top?.config?.nuxt?.login?.dark ?? true } catch { return true }
    },
    text(): string {
      try { return (window as any).top?.config?.nuxt?.login?.text ?? 'Welcome!' } catch { return 'Welcome!' }
    },
    btnText(): string {
      try { return (window as any).top?.config?.nuxt?.login?.btnText ?? 'To login AD >' } catch { return 'To login AD >' }
    }
  },
  mounted() {
    if (this.loginWith === 'auth0') {
      // Trigger the auth0 redirect immediately on page load
      this.$auth.loginWith('auth0').catch(() => {})
    }
  },
  methods: {
    async loginLocal() {
      this.formError = null
      this.loading = true
      try {
        await this.$auth.loginWith('atviseLocal', { username: this.user, password: this.password })
        // Navigation is handled by the watch(loggedIn) in <script setup>
      } catch (e: any) {
        this.formError = e?.statusMessage ?? e?.message ?? 'Login failed'
      } finally {
        this.loading = false
      }
    },
    loginAAD() {
      this.$auth.loginWith('aad', { params: { prompt: 'select_account' } }).catch(() => {})
    }
  }
}
</script>
