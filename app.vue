<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <div class="min-h-screen bg-slate-900 text-slate-100">
        <n-layout has-sider class="min-h-screen">
          <AppSidebar :collapsed="collapsed" :menu-options="menuOptions" :active-route="activeRoute" @navigate="navigateTo" />
          <n-layout class="bg-slate-900/40">
            <AppHeader :title="pageTitle" :is-dark="isDark" :profile-options="profileOptions" @toggle-theme="toggleTheme" @toggle-sidebar="toggleSidebar" />
            <n-layout-content class="relative">
              <main class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
                <NuxtPage />
              </main>
            </n-layout-content>
            <AppFooter />
          </n-layout>
        </n-layout>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { darkTheme, lightTheme, useMessage, useOsTheme, type DropdownOption, type GlobalThemeOverrides } from 'naive-ui'
import AppFooter from '~/components/ui/AppFooter.vue'
import AppHeader from '~/components/ui/AppHeader.vue'
import AppSidebar from '~/components/ui/AppSidebar.vue'

type MenuIcon = 'dashboard' | 'editor' | 'access'

interface MenuEntry {
  label: string
  key: string
  icon: MenuIcon
}

const osTheme = useOsTheme()
const prefersDark = ref(osTheme.value === 'dark')
const collapsed = ref(false)
const message = useMessage()
const route = useRoute()
const router = useRouter()

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#0ea5e9',
    primaryColorHover: '#22d3ee',
    primaryColorSuppl: '#0c4a6e'
  }
}

const naiveTheme = computed(() => (prefersDark.value ? darkTheme : lightTheme))
const isDark = computed(() => prefersDark.value)

const menuOptions: MenuEntry[] = [
  {
    label: 'Dashboard',
    key: '/',
    icon: 'dashboard'
  },
  {
    label: 'Process Editor',
    key: '/editor',
    icon: 'editor'
  },
  {
    label: 'Access',
    key: '/login',
    icon: 'access'
  }
]

const profileOptions: DropdownOption[] = [
  {
    label: 'Profile settings',
    key: 'profile'
  },
  {
    label: 'Documentation',
    key: 'docs',
    props: {
      onClick: () => window.open('https://nuxt.com', '_blank')
    }
  },
  {
    type: 'divider'
  },
  {
    label: 'Sign out',
    key: 'logout',
    props: {
      onClick: () => message.info('Sign out is not implemented in this demo build yet.')
    }
  }
]

const activeRoute = computed(() => (route.path === '/' ? '/' : `/${route.path.split('/')[1]}`))
const pageTitle = computed(() => {
  const found = menuOptions.find(option => option.key === activeRoute.value)
  return found?.label ?? 'Dashboard'
})

watch(osTheme, (value) => {
  prefersDark.value = value === 'dark'
})

function toggleTheme () {
  prefersDark.value = !prefersDark.value
}

function toggleSidebar () {
  collapsed.value = !collapsed.value
}

function navigateTo (key: string) {
  if (key !== route.path) {
    router.push(key)
  }
}
</script>

<style scoped>
:deep(.n-layout-scroll-container) {
  @apply bg-transparent;
}
</style>
