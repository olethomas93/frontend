<template>
  <v-app :dark="isDark">
    <v-main class="Background">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      isDark: true
    }
  },
  head () {
    return {
      title: this.$config.app_meta.title1 + '-' + this.$config.app_meta.title2
    }
  }
}
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
