<template>
  <div v-if="hasValue">
    <div v-if="isBoolean">
      <v-avatar :color="getColor(item)" size="36">
        {{ value }}
      </v-avatar>
    </div>
    <!-- <div v-else-if="isMeasurement">
      {{ value.toFixed(decimals) }} {{ unit }}
    </div> -->
    <div v-else>
      <template v-if="unit === '%'">
        <data-table-widget-bar :value="value" :unit="unit" />
      </template>
      <template v-else>
        <v-text-field
          :value="typeof value === 'string' ? value : Number(value.toFixed(decimals))"
          :suffix="unit"
          :single-line="!showTimestamp"
          dense
          :hide-details="!showTimestamp"
          readonly
          :loading="!showTimestamp"
          :messages="[duration]"
        >
          <!-- Loading prop and progress slot used to remove underline -->
          <template v-if="!showTimestamp" #progress>
            <p />
          </template>
        </v-text-field>
        <!-- <style>
          :root {
          --value-unit-width: {{ showTimestamp ? '50%' : '100%' }};
          }
        </style>
        <v-text-field
          :value="value"
          :suffix="unit"
          single-line
          dense
          _outlined
          hide-details
          readonly
          loading
        >
          Loading prop and progress slot used to remove underline
          <template #progress>
            <p />
          </template>
          <template v-if="showTimestamp" #append-outer>
            <div style="font-size:12px;">
              {{ duration }}
            </div>
          </template>
        </v-text-field> -->
      </template>
    </div>
    <div v-if="status" class="error-message">
      <span>{{ getStatusMessage(status) }}</span>
    </div>
  </div>
</template>

<script>
import OPCUAStatusMixin from '../dataTableMeasurements/decodeOpcUaStatus'
export default {
  mixins: [
    OPCUAStatusMixin
  ],
  props: {
    item: {
      type: Object,
      default: () => { return {} }
    },
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
      default: 1
    }
  },
  data () {
    return {
      value: 0,
      unit: '',
      int: undefined,
      timestamp: '',
      duration: '',
      showError: false,
      errorString: '',
      status: 0,
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
      this.getUnit()
    }
    // if (this.hasUnit) {
    //   this.getUnit()
    // }
  },
  destroyed () {
    clearInterval(this.int)
  },
  methods: {
    getValue () {
      this.read(this.$lodash.get(this.item, 'childs.value.nodeid')).then((data) => {
        this.value = Number(data.value.toFixed(this.decimals))
        this.errorString = data.errorString
        this.status = data.status
        // this.timestamp = data.timestamp
        this.timestamp = new Date(data.timestamp).getTime()
        this.$moment.locale(this.$store.getters['atvise/getLanguage'])
        this.duration = this.$moment(data.timestamp).fromNow()
        if(this.status){
          this.showError = true
          //document.getElementById('errorMessage').textContent = this.errorString

        }else{
          this.showError = false
        }
      })
    },
    getUnit () {
      this.unit = this.item.childs.value.childs.unit.value
      
      // const id = this.$lodash.get(this.item, 'childs.value.nodeid') + '.unit'
      /*console.log('value-unit-wdgt : ')
      console.log(this.item)
      console.log(this.item.childs.value.childs.unit.value)
      const id = this.$lodash.get(this.item, 'childs.value.childs.unit.nodeid')
      console.log(id)
      this.read(id).then((data) => {
        this.unit = data.value
      })*/
      // const id = this.isMeasurement ? 'childs.unit.nodeid' : 'childs.value.childs.unit.nodeid'
      // this.read(this.$lodash.get(this.item, id)).then((data) => {
      //   this.unit = data.value
      // })
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
    }
  }
}
</script>

<style>
  .v-input__control{
    width: var(--value-unit-width);
  }
  .error-message {
      color: #ff671f;
      font-size: 12px;
    }
</style>
