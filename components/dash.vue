<template>
  <grid :style="$store.state.editMode ? `width:${$store.state.editSize}` : ''" style="height: calc(100% - 48px)" />
</template>

<script>
import grid from './grid_v3.vue'

export default {
  components: {
    grid
  },
  data () {
    return {}
  },
  watch: {
    '$route' () {
      this.$store.commit('SET_EDIT_MODE', false)
      this.$store.commit('SET_EDIT_SIZE', '100%')
    }
  }
}
</script>
