<template>
  <div class="column1 pa-0" style="height:100%;background:rgba(200,200,200,0.25)">
    <v-sheet
      class="bar"
      style="border-radius:0px;transform-origin:0% 0%;bottom:0px;height:99%;"
      _color="percent > 25 ? 'success' : 'error'"
      :color="color"
      :style="{transform:'scaleX(' + value/100 + ')'}"
      :dark="!theme.isDark"
      :light="theme.isDark"
    />
  </div>
</template>

<script>
export default {
  inject: ['theme'],
  props: {
    percent: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: 'success'
    }
  },
  data: () => ({
    show: true
  }),
  computed: {
    value () {
      if (this.percent > 100) {
        return 100
      }
      if (this.percent < 0) {
        return 0
      }
      return this.percent
    }
  }
}
</script>

<style>
.column1 {
  border-radius: 0px;
  border-style: solid;
  border-width: 0px;
}
.bar {
  transition: 500ms;
}
</style>
