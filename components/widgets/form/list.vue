<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-form
    ref="form"
    v-model="valid"
    @submit.prevent="submit"
  >
    <v-card>
      <v-card-title v-if="title">
        {{ title }}
      </v-card-title>

      <v-container fluid>
        <v-row>
          <v-col v-for="(column, index) in schema.columns" :key="index" :cols="column.cols || 12">
            <component
              :is="field.type"
              v-for="(field, index2) in column.fields"
              :key="index2"
              v-model="value[field.model]"
              v-bind="field.props"
              @keydown.stop=""
            >
              {{ field.text || '' }}
            </component>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions v-if="buttons">
        <v-spacer />
        <v-btn variant="variant="outlined"" @click="$emit('close')">
          {{ cancelText }}
        </v-btn>
        <v-btn
          color="primary"
          class="mr-4"
          type="submit"
          :disabled="!valid"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: undefined
    },
    value: {
      type: [Object],
      default: () => { return {} }
    },
    schema: {
      type: [Object, String],
      default: () => { return { fields: [] } }
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    buttons: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    valid: true,
    model: {},
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    nameRules: [
      v => !!v || 'Name is required'
      // v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    phoneRules: [
      v => !!v || 'Phone is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ]
  }),
  methods: {
    submit () {
      this.$emit('submit', this.model)
    },
    clear () {
      this.$refs.form.reset()
    },
    test (model) {
      return this.$lodash.get(this.value, model)
    }
  }
}
</script>

<style>

</style>
