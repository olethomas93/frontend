<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-select
    v-model="internalValue"
    multiple
    chips
    v-bind="$attrs"
    :items="items"
  />
</template>

<script>
export default {
  emits: ['update:modelValue', 'update:value', 'input'],
  props: {
    modelValue: {
      type: [Array, String],
      default: undefined
    },
    value: {
      type: [String],
      default: undefined
    }
  },
  data: () => ({
    items: [
      {
        text: 'Man',
        value: '1'
      },
      {
        text: 'Tirs',
        value: '2'
      },
      {
        text: 'Ons',
        value: '3'
      },
      {
        text: 'Tors',
        value: '4'
      },
      {
        text: 'Fre',
        value: '5'
      },
      {
        text: 'Lør',
        value: '6'
      },
      {
        text: 'Søn',
        value: '0'
      }
    ]
  }),
  computed: {
    internalValue: {
      get () {
        const current = this.modelValue ?? this.value ?? []
        if (Array.isArray(current)) {
          return current
        }
        if (typeof current === 'string') {
          return current.split(',').filter(Boolean)
        }
        return []
      },
      set (val) {
        this.$emit('update:modelValue', val)
        if (this.value !== undefined) {
          this.$emit('update:value', val)
        }
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style>

</style>
