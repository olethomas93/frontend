<template>
  <pre>{{ JSON.stringify(conditions, null, 2) }}</pre>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    }
  },
  data () {
    return {
      conditions: []
    }
  },
  mounted () {
    // this.getConditions()
    this.getAlarms()
  },
  methods: {
    getConditions () {
      return top.webMI.data.call('AlarmConditions', {}, (data) => {
        this.conditions = data
      })
    },
    getAlarms () {
      const filter = {
        startAddress: this.base,
        endLevel: 0,
        vTypes: ['VariableTypes.PROJECT.measurement', 'ObjectTypes.ATVISE.AlarmConfiguration']
      }
      return top.webMI.data.call('BrowseNodes', filter, (data) => {
        this.conditions = data
      })
    }
  }
}
</script>

<style>

</style>
