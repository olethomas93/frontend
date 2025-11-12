<template>
  <div>
    <div>
      <v-radio-group v-model="value" :style="{ maxWidth }" @change="handleChange">
        <v-radio v-for="(btn, key) in buttons" :key="key" :label="$T(btn.text)" :value="btn.value" :color="btn.color" />
      </v-radio-group>

      <data-table-measurements-confirm-dialog ref="confirm" />
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
    buttons: {
      type: Array,
      default: () => [
        { text: 'Off', value: 0, color: 'error' },
        { text: 'On', value: 1, color: 'success' }
      ]
    }
  },
  data () {
    return {
      value: undefined,
      sub: undefined,
      status: ''
    }
  },
  computed: {
    count () {
      return this.buttons.length
    }
  },
  methods: {
    async handleChange (selectedValue) {
      console.log(selectedValue)
      const btn = this.buttons.find(b => b.value === selectedValue)
      console.log(btn)

      if (!btn) { return }

      const confirmed = await this.$refs.confirm.open(
        this.$T('Confirm'),
        this.$T('Please confirm your command') + ', ' + this.$T(btn.text)
      )

      if (confirmed) {
        console.log('CONFIRMED')
        console.log(this.item.nodeid)
        if (btn.writeNode) {
          top.webMI.data.write(this.$route.query.base + '.' + btn.writeNode, btn.value)
        } else {
          top.webMI.data.write(this.item.nodeid, btn.value)
        }
      } else {
        // revert UI selection to previous value
        this.value = this.sub ?? undefined
        console.log('Canceled 🤷‍♂️')
      }
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
