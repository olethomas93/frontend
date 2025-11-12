<template>
  <div
    class="d-flex flex-row"
    style="width:100%;height:100%;min-width:840px"
  >
    <v-text-field
      v-bind="attrs"
      ref="activeMessage"
      class="pa-2"
      :value="activeMessage"
      style="width:180px"
      :label="$T('Active message')"
      @keydown.stop=""
      @change="updateValue('active_message', $event)"
    />
    <v-text-field
      _v-if="typeof lowerLimit === 'number'"
      v-bind="attrs"
      ref="lowerLimit"
      class="pa-2"
      type="number"
      :value="lowerLimit"
      width="60"
      style="width:50px"
      :disabled="lowerLimit === undefined"
      :label="$T('From')"
      @keydown.stop=""
      @change="updateValue('lower_limit', $event)"
    />
    <!-- <alarm-subscribe-value
      v-else
      v-bind="attrs"
      :label="$T('From')"
      :base="lowerLimit"
    /> -->
    <v-text-field
      _v-if="typeof upperLimit === 'number'"
      v-bind="attrs"
      ref="upperLimit"
      class="pa-2"
      type="number"
      :value="upperLimit"
      width="60"
      style="width:50px"
      :disabled="upperLimit === undefined"
      :label="$T('To')"
      @keydown.stop=""
      @change="updateValue('upper_limit', $event)"
    />
    <!-- <alarm-subscribe-value
      v-else
      v-bind="attrs"
      :label="$T('To')"
      :base="upperLimit"
    /> -->
    <v-text-field
      v-bind="attrs"
      ref="onDelay"
      class="pa-2"
      type="number"
      :value="onDelay/1000"
      style="width:60px"
      :label="$T('On delay')"
      suffix="s"
      @keydown.stop=""
      @change="updateValue('on_delay', $event*1000)"
    />
    <v-switch
      v-bind="attrs"
      ref="enabled"
      class="pa-0"
      :value="enabled"
      tabindex="-1"
      :label="$T('Enable')"
      @change="enableAlarm"
    />
    <v-select
      v-bind="attrs"
      ref="Priority"
      v-model="category"
      class="pa-2"
      item-text="childs.Abbreviation.value"
      :items="categories"
      item-value="displayname"
      style="width:170px"
      :label="$T('Priority')"
      @input="updateAlarmCategory"
    />
  </div>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: undefined
    },
    item: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      attrs: {
        outlined: true,
        dense: true,
        hideDetails: true,
        height: 40
      },
      enabled: false,
      activeMessage: '',
      lowerLimit: null,
      upperLimit: null,
      onDelay: 0,
      categories: [],
      category: '',
      alarmBase: '',
      conditionNode: '',
      shared: false
    }
  },
  mounted () {
    this.categories = this.$store.state.alarming.categories
    this.activeMessage = this.item.activeMessage
    this.alarmBase = this.item.base
    this.lowerLimit = typeof this.item.lowerLimit === 'number' ? this.item.lowerLimit : undefined // this.parseRelPath(this.item.lowerLimit)
    this.upperLimit = typeof this.item.upperLimit === 'number' ? this.item.upperLimit : undefined // this.parseRelPath(this.item.upperLimit)
    this.enabled = this.item.enabled
    this.onDelay = this.item.onDelay
    this.conditionNode = this.item.conditionNode // .split('=')[2]
    this.shared = this.conditionNode.includes('ObjectTypes')
    this.category = this.getAlarmCategory(this.item.category)
  },
  methods: {
    getAlarmCategory (category) {
      const name = category.split('.').pop()
      return this.$lodash.find(this.categories, (cat) => { return cat.displayname === name })
    },
    getValue (path) {
      return new Promise((resolve) => {
        const address = this.parseRelPath(path)
        top.webMI.data.read(address, (data) => {
          resolve(data.value)
        })
      })
    },
    parseRelPath (str) {
      // Create a DOMParser
      const parser = new DOMParser()
      // Use it to turn your xmlString into an XMLDocument
      const xmlDoc = parser.parseFromString(str, 'application/xml')
      let id = this.alarmBase
      xmlDoc.querySelectorAll('Name').forEach((data) => {
        id += '.' + data.textContent
      })
      return id.split('=')[2]
    },
    updateAlarmCategory (value) {
      top.webMI.data.call('JMH_AlarmSetCategory', { nodes: [this.conditionNode], category: value }, (e) => { console.log(e) })
    },
    updateValue (node, value) {
      debugger
      console.log(`${this.conditionNode.split('=')[2]}.${node}`, value)
      top.webMI.data.write(`${this.conditionNode.split('=')[2]}.${node}`, value)
    },
    enableAlarm (e) {
      if (e === true) {
        top.webMI.data.call('AlarmEnable', { address: this.base }, (data) => {
          if (data.result[0].error) {
            this.$store.commit('SET_CUSTOM_ALERT', { message: `${data.result[0].errorstring}` })
          } else {
            this.$store.dispatch('alarming/conditions')
          }
        })
      } else {
        top.webMI.data.call('AlarmDisable', { address: this.base }, (data) => {
          if (data.result[0].error) {
            this.$store.commit('SET_CUSTOM_ALERT', { message: `${data.result[0].errorstring}` })
          } else {
            this.$store.dispatch('alarming/conditions')
          }
        })
      }
    }
  }
}
</script>

<style>

</style>
