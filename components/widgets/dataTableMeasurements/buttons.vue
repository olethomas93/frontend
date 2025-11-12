<template>
  <div>
    <div>
      <v-row :style="{maxWidth: maxWidth}">
        <v-col v-for="(btn, key) in buttons" :key="key" :cols="12 / count">
          <v-btn style="width:100%" :outlined="value !== btn.value" small :color="btn.color" @click="write(btn.value, btn)">
            {{ $T(btn.text) }}
          </v-btn>
        </v-col>
        <data-table-measurements-confirm-dialog ref="confirm" />
      </v-row>
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
      default: () => {
        return [
          {
            text: 'Off',
            value: 0,
            color: 'error'
          },
          {
            text: 'On',
            value: 1,
            color: 'success'
          }
        ]
      }
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
    async write (value, btn) {
      if (await this.$refs.confirm.open(this.$T('Confirm'), this.$T('Please confirm your command') + ', ' + this.$T(btn.text))) {
        // relative from base component
        if (btn.writeNode) {
          top.webMI.data.write(this.$route.query.base + '.' + btn.writeNode, value)
        } else {
          top.webMI.data.write(this.item.nodeid, value)
        }
      } else {
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
