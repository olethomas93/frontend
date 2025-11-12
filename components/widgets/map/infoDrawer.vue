<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    right
    clipped
    style="z-index:99999999"
    :mini-variant.sync="drawer"
    permanent
    mini-variant-width="0"
    width="30%"
  >
    <slot name="content" />

    <v-btn
      v-if="!drawer || showButton"
      right
      fab
      :style="{top: '50%', transform:'translate(-50%, -50%)',position:'absolute',zIndex: 10}"
      @click="drawer = !drawer"
    >
      <v-icon v-if="drawer">
        mdi-chevron-left
      </v-icon>
      <v-icon v-else>
        mdi-chevron-right
      </v-icon>
    </v-btn>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    remote: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '30%'
    },
    showButton: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      drawer: false
    }
  },
  watch: {
    remote () {
      this.drawer = false
    }
  }
}
</script>

<style>
.v-navigation-drawer--mini-variant, .v-navigation-drawer {
  overflow: visible !important;
}
</style>
