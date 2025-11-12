<template>
  <div v-if="loading" class="loading-page ">
    <icon />
  </div>
</template>

<script>
import icon from './loadingIcon'

export default {
  components: {
    icon
  },
  data: () => ({
    loading: false,
    text: 'Loading...'
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    },
    setText (text) {
      this.text = text
    }
  }
}
</script>

<style>
.loading-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #3a3a3a66;
  font-size: 30px;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  z-index: 20;
  padding: 64px 0px 0px 256px;
}
</style>
