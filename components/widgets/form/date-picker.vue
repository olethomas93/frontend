<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog
    ref="dialog"
    v-model="modal2"
    :return-value.sync="value"
    persistent
    width="290px"
    @input="$emit('input', value)"
  >
    <template #activator="{ on }">
      <v-text-field
        v-model="value"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="$attrs"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-if="modal2"
      v-model="value"
      format="24hr"
      locale="nb-NO"
      first-day-of-week="1"
      full-width
    >
      <v-spacer />
      <v-btn
        text
        color="primary"
        @click="modal2 = false"
      >
        Cancel
      </v-btn>
      <v-btn
        text
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
  props: {
    value: {
      type: [String],
      default: ''
    }
  },
  data: () => ({
    modal2: false
  })
}
</script>

<style>

</style>
