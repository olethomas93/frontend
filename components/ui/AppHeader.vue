<template>
  <n-layout-header bordered class="sticky top-0 z-20 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
          @click="$emit('toggle-sidebar')"
        >
          <AppIcon name="menu" class="h-5 w-5 text-brand-200" />
        </button>
        <div>
          <p class="text-sm uppercase tracking-widest text-brand-200">Control Center</p>
          <p class="text-lg font-semibold text-white">{{ title }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          @click="$emit('toggle-theme')"
        >
          <span class="flex items-center gap-2">
            <AppIcon :name="isDark ? 'sunny' : 'moon'" class="h-5 w-5" />
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
            <AppIcon name="chevron-down" class="h-4 w-4 text-brand-200" />
          </button>
        </n-dropdown>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import AppIcon from '~/components/ui/AppIcon.vue'

defineProps<{
  title: string
  isDark: boolean
  profileOptions: DropdownOption[]
}>()

defineEmits<{
  (event: 'toggle-theme'): void
  (event: 'toggle-sidebar'): void
}>()
</script>
