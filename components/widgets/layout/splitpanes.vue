<template>
  <splitpanes :horizontal="horizontal" class="default-theme">
    <pane v-for="i in panes" :key="i" :size="size[i - 1 ]">
      <slot :name="`slot${i}`" />
    </pane>
    <!-- <pane>
      <slot name="slot2" />
    </pane> -->
  </splitpanes>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'

export default {
  components: {
    Splitpanes,
    Pane
  },
  props: {
    panes: {
      type: Number,
      default: 2
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    size: {
      type: Array,
      default: () => { return [50, 50] }
    }
  }
}
</script>
