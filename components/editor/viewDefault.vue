<template>
  <div>
    <v-text-field
      :value="value.nodeid"
      label="Node id"
      density="compact"
      readonly
      outlined
    />
    <editor-dialog2
      v-for="(field, key) in fields"
      :key="key"
      :label="field.text"
      :value="value[field.value]"
      :base="value.nodeid"
      dense
      filled
      @save="setValue(field.value, $event)"
    />
    <component
      :is="getComp(value).component"
      v-if="getComp(value)"
      v-bind="getComp(value).props"
      :base="value.nodeid"
      :item="value"
      v-on="$listeners"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      fields: [
        {
          text: 'Displayname',
          value: 'displayname'
        },
        {
          text: 'Description',
          value: 'description'
        }
      ],
      componentList: [
        { type: 'i=62', component: 'editor-input-string' },
        { type: 'VariableTypes.PROJECT.setting.string.color', component: 'editor-input-color' },
        { type: 'VariableTypes.PROJECT.setting', component: 'editor-input-string' },
        { type: 'VariableTypes.PROJECT.measurement.analog', component: 'editor-input-string' },
        { type: 'VariableTypes.PROJECT.setting.json.position', component: 'editor-input-string' },
        { type: 'VariableTypes.PROJECT.setting.json', component: 'editor-input-json' },
        { type: 'VariableTypes.ATVISE.Smoothing.Deadband.Absolute', component: 'editor-input-string' },
        { type: 'VariableTypes.ATVISE.Smoothing.SuppressFlicker', component: 'editor-input-string' },
        { type: 'VariableTypes.ATVISE.Display', component: 'editor-preview-display' }
        // { type: 'ObjectTypes.PROJECT', component: 'editor-preview-displays' }
      ]
    }
  },
  methods: {
    getComp (item) {
      const temp = this.$lodash.find(this.componentList, ['type', item?.typedefinition])
      const temp2 = this.$lodash.find(this.componentList, (o) => { return item?.typedefinition.includes(o.type) })
      return temp || temp2 || { component: undefined }
    },
    setValue (parameter, value) {
      if (parameter === 'description' || parameter === 'displayname') {
        this.selected[parameter] = value
        const params = {
          address: this.selected.nodeid,
          displayname: this.selected.displayname,
          description: this.selected.description
        }
        top.webMI.data.call('JMH_UpdateNode', params)
      }
    }
  }
}
</script>

<style>

</style>
