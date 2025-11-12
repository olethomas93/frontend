<template>
  <v-row :style="{maxWidth: maxWidth}">
    <v-col v-for="(btn, key) in buttonPulse" :key="key" :cols="12 / count">
      <v-btn style="width:100%" :outlined="valueOn !== btn.valueOn" small :color="btn.color" @click="write(btn.valueOn, btn.valueOff, btn.pulseLength, btn)">
        {{ $T(btn.text) }}
      </v-btn>
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
    buttonPulse: {
      type: Array,
      default: () => {
        return [
          {
            text: 'Pulse',
            valueOn: 1,
            valueOff: 0,
            pulseLength: 2,
            color: 'error'
          }
        ]
      }
    }
  },
  data () {
    return {
      valueOn: undefined,
      sub: undefined
    }
  },
  computed: {
    count () {
      return this.buttonPulse.length
    }
  },
  methods: {
    async write (valueOn, valueOff, pulseLength, btn) {
      if (await this.$refs.confirm.open(this.$T('Confirm'), this.$T('Please confirm your command') + ', ' + this.$T(btn.text))) {
        top.webMI.data.write(this.item.nodeid, valueOn)
        setTimeout(this.writeBack, pulseLength * 1000, valueOff)
      } else {
        console.log('Canceled 🤷‍♂️')
      }
    },
    writeBack (valueOff) {
      top.webMI.data.write(this.item.nodeid, valueOff)
    }
  }
}
</script>

  <style>

  </style>
