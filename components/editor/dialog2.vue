<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-edit-dialog
    ref="dialog"
    v-model:return-value="localValue"
    large
    _width="200"
    @update:return-value="$emit('save', $event)"
  >
    <v-text-field
      v-model="localValue"
      :label="label"
      :suffix="unit"
      outlined
      :hide-details="hideDetails"
      :dense="density="compact""
      :filled="variant="filled""
      readonly
      :style="{maxWidth: maxWidth}"
      @keydown.stop=""
    />
    <template #input>
      <v-card-title>
        Edit
      </v-card-title>
      <slot name="input" :value="localValue">
        <v-text-field
          v-model="localValue"
          :label="label"
          :suffix="unit"
          outlined
          counter
          :type="type"
          @focus="$event.target.select()"
          @keydown.enter.stop="$refs.dialog.save(localValue)"
          @keydown.esc.stop="$refs.dialog.cancel()"
          @keydown.stop=""
        />
      </slot>
    </template>
  </v-edit-dialog>
</template>

<script>
export default {
  emits: ['update:modelValue', 'update:value', 'input', 'save'],
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: undefined
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
  computed: {
    localValue: {
      get () {
        return this.modelValue ?? this.value
      },
      set (val) {
        this.$emit('update:modelValue', val)
        if (this.value !== undefined) {
          this.$emit('update:value', val)
        }
        this.$emit('input', val)
      }
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
