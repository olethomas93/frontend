<template>
  <div :style="enumStyle">
    <div>
      <v-text-field
        :value="value.text"
        :single-line="!showTimestamp"
        dense
        :hide-details="!showTimestamp"
        readonly
        :loading="!showTimestamp"
        :messages="[duration]"
        class="text-input-color"
        :style="{maxWidth: maxWidth}"
      >
        <!-- Loading prop and progress slot used to remove underline -->
        <template v-if="!showTimestamp" #progress>
          <p />
        </template>
      </v-text-field>
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
    enums: {
      type: Object,
      default: () => {
        return {
          0: { text: 'Off', color: 'success' },
          1: { text: 'On', color: 'success' }
        }
      }
    },
    showTimestamp: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: 0,
      sub: undefined,
      // int: undefined,
      timestamp: '',
      duration: '',
      status: ''
    }
  },
  computed: {
    enumStyle () {
      const themeColor = this.$vuetify?.theme?.currentTheme?.[this.value?.color] || this.value?.color
      return {
        '--enum-color': themeColor || 'inherit'
      }
    },
    isMeasurement () {
      return this.item.typeDefinition.includes('VariableTypes.PROJECT.measurement') // || this.item.typeDefinition.includes('i=62')
    }
  },
  methods: {
    subscribe () {
      this.sub = top.webMI.data.subscribe(this.item.nodeid, (data) => {
        if (data.value === true || data.value === false) {
          const value = data.value.toString()
          this.value = this.enums[value] || 'undefined enum'
        } else {
          const value = parseInt(data.value)
          this.value = this.enums[value] || 'undefined enum'
        }
        this.timestamp = new Date(data.timestamp).getTime()
        this.$moment.locale(this.$store.getters['atvise/getLanguage'])
        this.duration = this.$moment(data.timestamp).fromNow()
        this.status = data.status
      })
    }
  }
}
</script>

<style>
  .text-input-color .v-text-field__slot input {
   color: var(--enum-color) !important;
  }
  .error-message {
      color: #ff671f;
      font-size: 12px;
    }
</style>
