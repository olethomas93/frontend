<template>
  <div>
    <div>
      <v-tooltip open-delay="500" :right="true" :color="onState ? colors.on : colors.off">
        <template #activator="{ on }">
          <v-avatar :color="onState ? colors.on : colors.off" :size="size" v-on="on">
            <template v-if="showValue">
              {{ value }}
            </template>
          </v-avatar>
        </template>
        <span>{{ onState ? tooltipText.on : tooltipText.off }}</span>
      </v-tooltip>
    </div>
    <div v-if="status" class="error-message">
      <span>{{ getStatusMessage(status) }}</span>
    </div>
  </div>
</template>
<script>
import mixin from './mixin'
import OPCUAStatusMixin from './decodeOpcUaStatus'
export default {
  mixins: [
    mixin,
    OPCUAStatusMixin
  ],
  props: {
    onValue: {
      type: [Number, String, Boolean],
      default: 1
    },
    tooltipText: {
      type: Object,
      default: () => { return { on: 'On', off: 'Off' } }
    },
    colors: {
      type: Object,
      default: () => { return { on: 'success', off: 'error' } }
    },
    size: {
      type: Number,
      default: 25
    },
    showValue: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    onState () {
      return this.value
    }
  },
  data () {
    return {
      status: ''
    }
  }
}
</script>

<style>
  .error-message {
      color: #ff671f;
      font-size: 12px;
    }
</style>
