<template>
  <v-app>
    <v-main class="Background">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#imports'
import { useHead } from '#app'

const runtimeConfig = useRuntimeConfig()
const meta = runtimeConfig.public.app_meta as { title1?: string; title2?: string }

useHead({
  title: `${meta.title1 ?? ''} - ${meta.title2 ?? ''}`
})
</script>

<style>
.Background {
  /* background-image: url("https://staging.access.portal.jmhansen.no/img/jmhabrukbackground1.jpg"); */
  background-repeat: no-repeat;
  height: 100%;
  background-position: center;
  background-size: cover;
}
</style>
