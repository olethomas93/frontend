<!-- eslint-disable vue/no-mutating-props -->
<template>
  <form-list
    v-model="model"
    buttons
    :title="title"
    :schema="form"
    @submit="submit"
    @close="$emit('close')"
  />
</template>

<script>
export default {
  props: {
    objectType: {
      type: String,
      default: 'ObjectTypes.PROJECT.jmhGeneral.customer'
    },
    selected: {
      type: Object,
      default: () => { return undefined }
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      model: {
        browsename: '',
        displayname: '',
        description: ''
      },
      form: {
        columns: [
          {
            cols: 12,
            fields: [
              {
                type: 'v-text-field',
                model: 'browsename',
                props: {
                  style: '{width:50%}',
                  outlined: true,
                  label: 'ID',
                  required: true,
                  disabled: false // this.editedIndex > -1 || (this.defaultPrefix.length > 0 && !this.canDelete)
                }
              },
              {
                type: 'v-text-field',
                model: 'displayname',
                props: {
                  outlined: true,
                  label: 'Navn',
                  required: true
                }

              },
              {
                type: 'v-text-field',
                model: 'description',
                props: {
                  outlined: true,
                  label: 'Beskrivelse',
                  required: true
                }
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
    title () {
      return this.editMode ? 'Edit customer' : 'Add customer'
    }
  },
  watch: {
    selected: {
      deep: true,
      handler (val) {
        this.model = val
      }
    }
  },
  mounted () {
    this.model = this.selected
  },
  methods: {
    submit () {
      // Add call to atvise
      console.log('add customer of type: ', this.objectType)
      const options = this.model
      options.objectType = this.objectType
      console.log(options)
      if (this.editMode) {
        options.script = 'modify'
        top.webMI.data.call('JMH_customerMgmt', options, () => {
          this.$emit('close')
        })
      } else {
        options.script = 'create'
        top.webMI.data.call('JMH_customerMgmt', options, () => {
          this.$emit('close')
        })
      }
    }
  }
}
</script>

<style>

</style>
