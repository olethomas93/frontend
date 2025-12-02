<script setup lang="ts">
const { proxyTargets, baseUrl, overrideEnv } = useAtviseProxy()
</script>

<template>
  <div class="app-shell">
    <header class="panel app-header">
      <div>
        <p class="eyebrow">Nuxt 3 pilot</p>
        <h1 class="title">Atvise Modern UI</h1>
        <p class="subtitle">Running alongside the Nuxt 2 app while we migrate shared modules.</p>
      </div>
      <div class="proxy-chip">
        <span class="chip__label">Proxy target</span>
        <span class="chip__value">{{ baseUrl }}</span>
        <p class="chip__hint">Override with {{ overrideEnv }}</p>
      </div>
    </header>

    <section class="panel callout">
      <div>
        <p class="eyebrow">Next action</p>
        <h2 class="title">Port a real display</h2>
        <p class="subtitle">Use this shell to validate SVG → Vue conversion with the new runtime.</p>
      </div>
      <div class="callout__targets">
        <h3>Active dev proxies</h3>
        <ul>
          <li v-for="target in proxyTargets" :key="target.path">
            <code>{{ target.path }}</code>
            <span aria-hidden="true">→</span>
            <code>{{ target.target }}</code>
          </li>
        </ul>
      </div>
    </section>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
}

.title {
  margin: 6px 0 4px;
  font-size: 20px;
}

.subtitle {
  margin: 0;
  color: #cbd5e1;
}

.proxy-chip {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  background: rgba(34, 211, 238, 0.08);
  max-width: 340px;
}

.chip__label {
  font-size: 12px;
  color: #9ca3af;
}

.chip__value {
  font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 600;
}

.chip__hint {
  margin: 0;
  color: #9ca3af;
  font-size: 12px;
}

.callout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 12px;
  align-items: center;
}

.callout__targets {
  border: 1px dashed var(--border);
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.callout__targets h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #cbd5e1;
}

.callout__targets ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.callout__targets code {
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 13px;
}

.content {
  flex: 1;
}
</style>
