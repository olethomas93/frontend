<template>
  <v-btn-toggle dense :value="value" @change="$emit('input', $event)">
    <v-btn
      v-for="(btn, index) in buttons"
      :key="index"
      width="150"
      outlined
      :color="btn.color"
      :value="btn.value"
    >
      {{ $T(btn.text) }}
    </v-btn>
  </v-btn-toggle>
  <!-- <v-row :style="{maxWidth: maxWidth}">
    <v-col v-for="(btn, key) in buttons" :key="key" :cols="12 / count">
      <v-btn style="width:100%" :outlined="value !== btn.value" small :color="btn.color" @click="write(btn.value, btn)">
        {{ $T(btn.text) }}
      </v-btn>
    </v-col>
    <data-table-measurements-confirm-dialog ref="confirm" />
  </v-row> -->
</template>
<script>

export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
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
    }
  },
  computed: {
  },
  methods: {
    // async write (value, btn) {
    //   if (await this.$refs.confirm.open(this.$T('Confirm'), this.$T('Please confirm your command') + ', ' + this.$T(btn.text))) {
    //     top.webMI.data.write(this.item.nodeid, value)
    //   } else {
    //     console.log('Canceled 🤷‍♂️')
    //   }
    // }
  }
}
</script>

<style>

</style>
