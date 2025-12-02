<template>
  <section class="panel">
    <header class="status__header">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h3 class="title">{{ title }}</h3>
      </div>
      <div class="badge">
        <slot name="badge">{{ badge }}</slot>
      </div>
    </header>
    <p class="description">
      <slot />
    </p>
  </section>
</template>

<script setup lang="ts">
defineProps({
  eyebrow: {
    type: String,
    default: 'Status'
  },
  title: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.status__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
}

.title {
  margin: 4px 0 0;
  font-size: 18px;
}

.badge {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(34, 211, 238, 0.08);
  color: var(--accent);
  font-weight: 600;
}

.description {
  margin: 12px 0 0;
  color: #cbd5e1;
  line-height: 1.5;
}
</style>
