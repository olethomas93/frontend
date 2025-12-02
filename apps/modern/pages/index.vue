<script setup lang="ts">
const config = useRuntimeConfig()

const proxyTargets = ['webmi', 'customScripts', 'vueComponents']
</script>

<template>
  <div class="grid cols-2">
    <StatusCard title="Nuxt 3 pilot" eyebrow="Migration" badge="In progress">
      This parallel app runs on Nuxt 3 with client-side rendering so we can port displays and plugins incrementally without
      disrupting the existing Nuxt 2 deployment. Keep feature development here minimal until shared modules (auth, webMI
      client, display loader) are ported.
    </StatusCard>

    <StatusCard title="Proxy defaults" eyebrow="Atvise" badge="Dev proxy">
      <ul>
        <li v-for="target in proxyTargets" :key="target">
          <code>/{{ target }}</code> → <code>{{ config.public.atviseBaseUrl }}</code>
        </li>
      </ul>
      <p style="margin-top: 12px">
        Override with <code>NUXT_PUBLIC_ATVISE_BASE_URL</code> to point at your atvise instance or proxy while developing.
      </p>
    </StatusCard>

    <StatusCard title="Next steps" eyebrow="Roadmap" badge="Upcoming">
      <ul>
        <li>Port the webMI wrapper as a composable with reconnect + typed helpers.</li>
        <li>Move one simple display (SVG → Vue) into this app to validate the pipeline.</li>
        <li>Introduce Vite test harness (Vitest + Playwright) to protect the migration path.</li>
      </ul>
    </StatusCard>
  </div>
</template>

<style scoped>
ul {
  margin: 0;
  padding-left: 18px;
  color: #cbd5e1;
  line-height: 1.6;
}

code {
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 13px;
}
</style>
