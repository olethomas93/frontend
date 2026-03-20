<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog
    ref="dialog"
    v-model="modal2"
    v-model:return-value="internalValue"
    persistent
    width="290px"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="internalValue"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="{ ...$attrs, ...props }"
      />
    </template>
    <v-date-picker
      v-if="modal2"
      v-model="internalValue"
      format="24hr"
      locale="nb-NO"
      first-day-of-week="1"
      full-width
    >
      <v-spacer />
      <v-btn
        variant="text"
        color="primary"
        @click="modal2 = false"
      >
        Cancel
      </v-btn>
      <v-btn
        variant="text"
        color="primary"
        @click="$refs.dialog.save(value)"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  emits: ['update:modelValue', 'update:value', 'input'],
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: undefined
    }
  },
  data: () => ({
    modal2: false
  }),
  computed: {
    internalValue: {
      get () {
        return this.modelValue ?? this.value ?? ''
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
