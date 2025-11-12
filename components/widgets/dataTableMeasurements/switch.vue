<template>
  <v-row :style="{maxWidth: maxWidth}">
    <v-col cols="12">
      <v-switch v-model="value" v-bind="$attrs" @mousedown.stop="write()" />
    </v-col>
    <data-table-measurements-confirm-dialog ref="confirm" />
  </v-row>
</template>
<script>
import mixin from './mixin'

export default {
  mixins: [
    mixin
  ],
  props: {
  },
  data () {
    return {
      value: undefined,
      sub: undefined
    }
  },
  computed: {
  },
  methods: {
    async write (value) {
      if (await this.$refs.confirm.open(this.$T('Confirm'), this.$T('Please confirm your command'))) {
        this.value = !this.value
        top.webMI.data.write(this.item.nodeid, this.value)
      } else {
        console.log('Canceled 🤷‍♂️')
      }
    }
  }
}
</script>

<style>

</style>
