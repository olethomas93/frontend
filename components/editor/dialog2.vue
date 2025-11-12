<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-edit-dialog
    ref="dialog"
    :return-value.sync="value"
    large
    _width="200"
    @update:return-value="$emit('save', $event)"
  >
    <v-text-field
      v-model="value"
      :label="label"
      :suffix="unit"
      outlined
      :hide-details="hideDetails"
      :dense="dense"
      :filled="filled"
      readonly
      :style="{maxWidth: maxWidth}"
      @keydown.stop=""
    />
    <template #input>
      <v-card-title>
        Edit
      </v-card-title>
      <slot name="input" :value="value">
        <v-text-field
          v-model="value"
          :label="label"
          :suffix="unit"
          outlined
          counter
          :type="type"
          @focus="$event.target.select()"
          @keydown.enter.stop="$refs.dialog.save(value)"
          @keydown.esc.stop="$refs.dialog.cancel()"
          @keydown.stop=""
        />
      </slot>
    </template>
  </v-edit-dialog>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: undefined
    },
    maxWidth: {
      type: String,
      default: '100%'
    },
    unit: {
      type: String,
      default: undefined
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'string'
    },
    filled: {
      type: Boolean,
      default: false
    }

    // item: {
    //   type: Object,
    //   default: () => { return {} }
    // }
  },
  data () {
    return {
      modal: false
      // value: ''
    }
  },
  methods: {
    test (data) {
      console.log(data)
    }
  }
  // watch: {
  //   base: {
  //     immediate: true,
  //     handler (val) {
  //       top.webMI.data.read(this.base, (e) => {
  //         this.value = e.value
  //       })
  //     }
  //   }
  // },
  // methods: {
  //   setValue (val) {
  //     console.log(val)
  //     top.webMI.data.write(this.base, val)
  //   }
  // }
}
</script>

<style>
  .v-small-dialog__activator__content{
    width: 100%;
  }
</style>
