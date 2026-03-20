<template>
  <v-menu
    ref="menu"
    v-model="menu2"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="value"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
    @update:return-value="update"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="value"
        label=""
        append-icon="mdi-clock-time-four-outline"
        readonly
        :style="{maxWidth: maxWidth}"
        v-bind="attrs"
        v-bind="props"
      />
    </template>
    <v-time-picker
      v-if="menu2"
      v-model="value"
      format="24h"
      full-width
      @click:minute="$refs.menu.save(value)"
    />
  </v-menu>
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
      menu2: false
      // time: ''
    }
  },
  methods: {
    update (val) {
      top.webMI.data.write(this.item.nodeid, val)
    }
  }
}
</script>

<style>

</style>
