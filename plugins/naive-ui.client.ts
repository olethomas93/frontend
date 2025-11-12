import { defineNuxtPlugin } from '#app'
import {
  create,
  NButton,
  NCard,
  NConfigProvider,
  NDropdown,
  NIcon,
  NInput,
  NLayout,
  NLayoutContent,
  NLayoutFooter,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NMessageProvider,
  NNotificationProvider,
  NSkeleton,
  NSpace,
  NTabPane,
  NTabs
} from 'naive-ui'

export default defineNuxtPlugin((nuxtApp) => {
  const naive = create({
    components: [
      NButton,
      NCard,
      NConfigProvider,
      NDropdown,
      NIcon,
      NInput,
      NLayout,
      NLayoutContent,
      NLayoutFooter,
      NLayoutHeader,
      NLayoutSider,
      NMenu,
      NMessageProvider,
      NNotificationProvider,
      NSkeleton,
      NSpace,
      NTabPane,
      NTabs
    ]
  })

  nuxtApp.vueApp.use(naive)
})
