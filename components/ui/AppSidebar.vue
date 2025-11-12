<template>
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
      :options="normalizedOptions"
      :collapsed="collapsed"
      :collapsed-width="72"
      :indent="18"
      :root-indent="18"
      class="px-3"
      @update:value="handleNavigate"
    />
    <div class="mt-auto px-4 pb-6">
      <n-card size="small" :bordered="false" class="bg-slate-900/60 text-slate-200" content-style="padding: 0;">
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-wide text-brand-200/80">Environment</p>
          <p class="text-sm font-semibold">Nuxt 3 • Vue 3</p>
          <p class="text-xs text-slate-400">Tailwind CSS + Naive UI foundation</p>
        </div>
      </n-card>
    </div>
  </n-layout-sider>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { MenuOption } from 'naive-ui'
import AppIcon from '~/components/ui/AppIcon.vue'

type MenuIcon = 'dashboard' | 'editor' | 'access'

interface SidebarOption {
  label: string
  key: string
  icon: MenuIcon
}

const props = defineProps<{
  collapsed: boolean
  menuOptions: SidebarOption[]
  activeRoute: string
}>()

const emit = defineEmits<{
  (event: 'navigate', value: string): void
}>()

const normalizedOptions = computed<MenuOption[]>(() =>
  props.menuOptions.map((option) => ({
    label: option.label,
    key: option.key,
    icon: () =>
      h(
        'span',
        {
          class:
            'flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-brand-200'
        },
        [
          h(AppIcon, {
            name: option.icon,
            class: 'h-5 w-5'
          })
        ]
      )
  }))
)

function handleNavigate (value: string) {
  if (value !== props.activeRoute) {
    emit('navigate', value)
  }
}
</script>
