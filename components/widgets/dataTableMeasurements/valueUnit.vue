<template>
  <div>
    <div>
      <editor-dialog2
        v-if="editable"
        _label="test"
        :value="typeof value === 'string' ? value : Number(value).toFixed(decimals)"
        :unit="unit"
        :base="item.nodeid"
        :max-width="maxWidth"
        hide-details
        dense
        :type="typeof value === 'string' ? 'string': 'number'"
        @save="write(item.nodeid, $event)"
      />
      <v-text-field
        v-else
        :value="typeof value === 'string' ? value : Number(value).toFixed(decimals)"
        :suffix="unit"
        :single-line="!showTimestamp"
        density="compact"
        :hide-details="!showTimestamp"
        readonly
        :loading="!showTimestamp"
        :messages="[duration]"
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
    showTimestamp: {
      type: Boolean,
      default: false
    },
    // value: {
    //   type: [Number, Boolean, String],
    //   default: 0
    // },
    // unit: {
    //   type: String,
    //   default: ''
    // },
    decimals: {
      type: Number,
      default: 0
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: 0,
      unit: '',
      int: undefined,
      timestamp: '',
      duration: '',
      status: '',
      statusMessage: ''
    }
  },
  computed: {
    isMeasurement () {
      return this.item.typeDefinition.includes('VariableTypes.PROJECT.measurement') // || this.item.typeDefinition.includes('i=62')
    },
    isBoolean () {
      return this.$lodash.isBoolean(this.value)
    },
    hasValue () {
      return this.$lodash.get(this.item, 'childs.value.nodeid', undefined) !== undefined
    },
    hasUnit () {
      if (this.isMeasurement) {
        return this.$lodash.get(this.item, 'childs.unit.nodeid', undefined) !== undefined
      } else {
        return this.$lodash.get(this.item, 'childs.value.childs.unit.nodeid', undefined) !== undefined
      }
    }
  },
  mounted () {
    if (this.hasValue) {
      this.getValue()
      this.int = setInterval(this.getValue, 30000)
    }
    if (this.hasUnit) {
      this.getUnit()
    }
  },
  destroyed () {
    clearInterval(this.int)
  },
  methods: {
    getValue () {
      this.read(this.$lodash.get(this.item, 'childs.value.nodeid')).then((data) => {
        this.value = Number(data.value.toFixed(this.decimals))
        // this.timestamp = data.timestamp
        this.timestamp = new Date(data.timestamp).getTime()
        this.$moment.locale(this.$store.getters['atvise/getLanguage'])
        this.duration = this.$moment(data.timestamp).fromNow()
      })
    },
    getUnit () {
      const id = this.isMeasurement ? 'childs.unit.nodeid' : 'childs.value.childs.unit.nodeid'
      this.read(this.$lodash.get(this.item, id)).then((data) => {
        this.unit = data.value
      })
    },
    getColor (item) {
      const onColor = item.childs.value.childs?.ux.childs.onColor.value || 'green'
      const offColor = item.childs.value.childs?.ux.childs.offColor.value || undefined
      return this.value ? onColor : offColor
    },
    read (node) {
      return new Promise((resolve) => {
        top.webMI.data.read(node, (data) => {
          resolve(data)
        })
      })
    },
    write (node, value) {
      // console.log('write: ', node, value)
      top.webMI.data.write(node, value)
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
