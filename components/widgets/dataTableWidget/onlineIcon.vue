<template>
  <v-tooltip open-delay="500" :right="true" :color="value ? 'success' : 'error'">
    <template #activator="{ on }">
      <v-icon :color="value ? 'success' : 'error'" v-on="on">
        {{ value ? 'mdi-wifi' : 'mdi-wifi-off' }}
      </v-icon>
    </template>
    <span>{{ value ? 'ONLINE' : 'OFFLINE' }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      dafault: false
    }
  }
}
</script>

<style>

</style>
