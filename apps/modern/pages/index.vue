<script setup lang="ts">
const { proxyTargets, overrideEnv } = useAtviseProxy()
</script>

<template>
  <div class="grid cols-2">
    <StatusCard title="Nuxt 3 pilot shell" eyebrow="Migration" badge="Active">
      Use this space to port shared modules from Nuxt 2 (webMI client, display loader, auth) and test them without touching the
      production app. Keep changes incremental and feature flagged until parity is verified.
    </StatusCard>

    <StatusCard title="Proxy defaults" eyebrow="Atvise" badge="Dev proxy">
      <ul>
        <li v-for="target in proxyTargets" :key="target.path">
          <code>{{ target.path }}</code> → <code>{{ target.target }}</code>
        </li>
      </ul>
      <p style="margin-top: 12px">
        Override with <code>{{ overrideEnv }}</code> to point at your atvise instance or proxy while developing.
      </p>
    </StatusCard>

    <StatusCard title="Next steps" eyebrow="Roadmap" badge="Up next">
      <ul>
        <li>Port the webMI wrapper as a composable with reconnect + typed helpers.</li>
        <li>Move one simple display (SVG → Vue) into this app to validate the pipeline.</li>
        <li>Add Vitest + Playwright to protect the migration path.</li>
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
