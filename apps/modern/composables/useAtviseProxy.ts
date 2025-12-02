export function useAtviseProxy() {
  const config = useRuntimeConfig()

  const baseUrl = computed(() => config.public.atviseBaseUrl)

  const proxyTargets = computed(() => [
    { path: '/webmi', target: baseUrl.value },
    { path: '/customScripts', target: baseUrl.value },
    { path: '/vueComponents', target: baseUrl.value }
  ])

  const overrideEnv = 'NUXT_PUBLIC_ATVISE_BASE_URL'

  return {
    baseUrl,
    proxyTargets,
    overrideEnv
  }
}
