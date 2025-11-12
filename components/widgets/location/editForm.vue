<!-- eslint-disable vue/no-mutating-props -->
<template>
  <form-list v-model="model" :title="title" :schema="form" @submit="submit" @close="$emit('close')" />
</template>

<script>
export default {
  props: {
    objectType: {
      type: String,
      default: 'ObjectTypes.PROJECT.jmhGeneral'
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
              },
              {
                type: 'v-text-field',
                model: 'lat',
                props: {
                  type: 'number',
                  step: '0.01',
                  outlined: true,
                  label: 'Latitude',
                  required: true
                }
              },
              {
                type: 'v-text-field',
                model: 'lng',
                props: {
                  type: 'number',
                  step: '0.01',
                  outlined: true,
                  label: 'Longitude',
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
      return this.editMode ? 'Edit item' : 'Add item'
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
      const options = this.model
      options.typeDefinition = this.objectType
      options.address = this.$route.query.base + '.' + this.model.browsename
      options.nodeClass = 'OBJECT'
      const nodes = [
        options.address + '.lat',
        options.address + '.lng'
      ]
      top.webMI.data.write(nodes, [options.lat, options.lng])
      console.log(options)
      if (this.editMode) {
        top.webMI.data.call('JMH_UpdateNode', options, () => {
          this.$emit('close')
        })
      } else {
        top.webMI.data.call('JMH_AddNode', options, () => {
          this.$emit('close')
        })
      }
    }
  }
}
</script>

<style>

</style>
