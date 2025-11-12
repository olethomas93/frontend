<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <div class="min-h-screen bg-slate-900 text-slate-100">
        <n-layout has-sider class="min-h-screen">
          <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="72"
            :width="240"
            :collapsed="collapsed"
            :native-scrollbar="false"
            class="bg-slate-950/70 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50"
          >
            <div class="flex items-center gap-2 px-6 py-5">
              <div class="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 text-xl font-semibold text-slate-900">
                AT
              </div>
              <div v-if="!collapsed" class="text-left">
                <p class="text-xs uppercase tracking-widest text-brand-200">Atvise</p>
                <p class="font-semibold text-slate-100">Operations</p>
              </div>
            </div>
            <n-menu
              :value="activeRoute"
              :options="menuOptions"
              :collapsed="collapsed"
              :collapsed-width="72"
              :indent="18"
              :root-indent="18"
              class="px-3"
              @update:value="navigateTo"
            />
            <div class="mt-auto px-4 pb-6">
              <n-card
                size="small"
                :bordered="false"
                class="bg-slate-900/60 text-slate-200"
                content-style="padding: 0;"
              >
                <div class="space-y-1">
                  <p class="text-xs uppercase tracking-wide text-brand-200/80">Environment</p>
                  <p class="text-sm font-semibold">Nuxt 3 • Vue 3</p>
                  <p class="text-xs text-slate-400">Tailwind CSS + Naive UI foundation</p>
                </div>
              </n-card>
            </div>
          </n-layout-sider>
          <n-layout class="bg-slate-900/40">
            <n-layout-header bordered class="sticky top-0 z-20 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40">
              <div class="flex items-center justify-between px-6 py-4">
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
                    @click="collapsed = !collapsed"
                  >
                    <Icon name="menu" />
                  </button>
                  <div>
                    <p class="text-sm uppercase tracking-widest text-brand-200">Control Center</p>
                    <p class="text-lg font-semibold text-white">{{ pageTitle }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                    @click="toggleTheme"
                  >
                    <span class="flex items-center gap-2">
                      <Icon :name="isDark ? 'sunny' : 'moon'" />
                      <span>{{ isDark ? 'Light mode' : 'Dark mode' }}</span>
                    </span>
                  </button>
                  <n-dropdown trigger="hover" :options="profileOptions">
                    <button
                      type="button"
                      class="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm transition hover:bg-white/10"
                    >
                      <span class="h-9 w-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600" />
                      <span class="hidden text-slate-100 sm:block">
                        <span class="block font-semibold">Alex Operator</span>
                        <span class="block text-xs text-slate-400">System administrator</span>
                      </span>
                    </button>
                  </n-dropdown>
                </div>
              </div>
            </n-layout-header>
            <n-layout-content class="relative">
              <main class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
                <NuxtPage />
              </main>
            </n-layout-content>
            <n-layout-footer class="bg-slate-900/60 px-6 py-4 text-xs text-slate-500">
              <div class="flex items-center justify-between">
                <p>© {{ new Date().getFullYear() }} Atvise Operations Suite</p>
                <p>Built with Nuxt 3, Tailwind CSS and Naive UI</p>
              </div>
            </n-layout-footer>
          </n-layout>
        </n-layout>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, type PropType } from 'vue'
import { darkTheme, lightTheme, useMessage, useOsTheme, type GlobalThemeOverrides } from 'naive-ui'

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

const Icon = defineComponent({
  name: 'AppIcon',
  props: {
    name: {
      type: String as PropType<'menu' | 'sunny' | 'moon'>,
      required: true
    }
  },
  setup (props) {
    return () => {
      if (props.name === 'menu') {
        return h('svg', { viewBox: '0 0 24 24', class: 'h-5 w-5 text-brand-200' }, [
          h('path', { d: 'M4 6h16M4 12h16M4 18h16', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' })
        ])
      }
      if (props.name === 'sunny') {
        return h('svg', { viewBox: '0 0 24 24', class: 'h-5 w-5 text-amber-300' }, [
          h('circle', { cx: 12, cy: 12, r: 4, fill: 'currentColor' }),
          h('path', { d: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round' })
        ])
      }
      return h('svg', { viewBox: '0 0 24 24', class: 'h-5 w-5 text-slate-200' }, [
        h('path', { d: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z', fill: 'currentColor' })
      ])
    }
  }
})

type MenuIcon = 'dashboard' | 'editor' | 'access'

const renderMenuIcon = (icon: MenuIcon) => () => {
  const base = ['flex', 'h-9', 'w-9', 'items-center', 'justify-center', 'rounded-lg', 'bg-white/5', 'text-brand-200']
  if (icon === 'dashboard') {
    return h('span', { class: base.join(' ') }, [
      h('svg', { viewBox: '0 0 24 24', class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [
        h('path', { d: 'M12 3v18M3 12h18', 'stroke-linecap': 'round' })
      ])
    ])
  }
  if (icon === 'editor') {
    return h('span', { class: base.join(' ') }, [
      h('svg', { viewBox: '0 0 24 24', class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [
        h('path', { d: 'M4 17.5V20h2.5L18.81 7.69l-2.5-2.5L4 17.5z' }),
        h('path', { d: 'M13.5 6.5l2.5 2.5' })
      ])
    ])
  }
  return h('span', { class: base.join(' ') }, [
    h('svg', { viewBox: '0 0 24 24', class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [
      h('path', { d: 'M7 11V7a5 5 0 1110 0v4', 'stroke-linecap': 'round' }),
      h('rect', { x: 5, y: 11, width: 14, height: 10, rx: 2 })
    ])
  ])
}

const menuOptions = [
  {
    label: 'Dashboard',
    key: '/',
    icon: renderMenuIcon('dashboard')
  },
  {
    label: 'Process Editor',
    key: '/editor',
    icon: renderMenuIcon('editor')
  },
  {
    label: 'Access',
    key: '/login',
    icon: renderMenuIcon('access')
  }
]

const profileOptions = [
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

const activeRoute = computed(() => route.path === '/' ? '/' : `/${route.path.split('/')[1]}`)
const pageTitle = computed(() => {
  const found = menuOptions.find(option => option.key === activeRoute.value)
  return found?.label ?? 'Dashboard'
})

function toggleTheme () {
  prefersDark.value = !prefersDark.value
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
