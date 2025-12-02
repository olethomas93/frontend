<template>
  <div class="app-shell">
    <header class="panel">
      <div class="title">Atvise Modern UI</div>
      <p class="subtitle">Nuxt 3 pilot alongside existing Nuxt 2 app</p>
    </header>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 24px;
}

header {
  margin-bottom: 18px;
}

.title {
  font-size: 20px;
  font-weight: 700;
}

.subtitle {
  margin: 6px 0 0;
  color: #9ca3af;
}
</style>
