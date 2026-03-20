<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="d-flex flex-row" xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;min-width:840px">
    <v-text-field
      ref="activeMessage"
      class="pa-2"
      :value="$T(activeMessage)"
      style="width:180px"
      v-bind="attrs"
      :disabled="shared || !admin"
      :label="$T('Active message')"
      @change="updateValue('active_message', $event)"
      @keydown.stop=""
    />
    <v-text-field
      ref="value"
      class="pa-2"
      :value="value"
      style="width:50px"
      v-bind="attrs"
      :label="$T('Limit')"
      width="60"
      :disabled="shared || !admin"
      @change="updateValue('value', $event)"
      @keydown.stop=""
    />
    <v-text-field
      ref="onDelay"
      class="pa-2"
      :value="onDelay/1000"
      style="width:60px"
      v-bind="attrs"
      :label="$T('On delay')"
      suffix="s"
      type="number"
      @change="updateValue('on_delay', $event*1000)"
      @keydown.stop=""
    />
    <v-switch
      ref="enabled"
      :input-value="enabled"
      class="pa-0"
      tabindex="-1"
      v-bind="attrs"
      :label="$T('Enable')"
      @change="enableAlarm"
    />
    <v-select
      v-bind="attrs"
      ref="Priority"
      v-model="category"
      :items="categories"
      item-title="childs.Abbreviation.value"
      item-value="displayname"
      style="width:170px"
      :label="$T('Priority')"
      class="pa-2"
      @input="updateAlarmCategory"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: undefined
    },
    base: {
      type: String,
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
      value: '',
      onDelay: 0,
      categories: [],
      category: '',
      conditionNode: '',
      shared: false,
      admin: false
    }
  },
  mounted () {
    this.categories = this.$store.state.alarming.categories
    this.activeMessage = this.item.activeMessage
    this.value = this.item.value
    this.enabled = this.item.enabled
    this.onDelay = this.item.onDelay
    this.conditionNode = this.item.conditionNode // .split('=')[2]
    this.shared = this.conditionNode.includes('ObjectTypes')
    // this.categories = await this.getAlarmCategories()
    this.category = this.getAlarmCategory(this.item.category)
  },
  methods: {
    getAlarmCategory (category) {
      const name = category.split('.').pop()
      return this.$lodash.find(this.categories, (cat) => { return cat.displayname === name })
    },
    updateAlarmCategory (value) {
      // top.webMI.data.call('JMH_AlarmSetCategory', { nodes: [this.base], category: value }, function (e) { console.log(e) })
      top.webMI.data.call('JMH_AlarmSetCategory', { nodes: [this.conditionNode], category: value }, (data) => {
        if (data.result[0].error > 0) {
          this.$store.commit('SET_CUSTOM_ALERT', { message: `${data.result[0].errorstring}` })
        }
      })
    },
    updateValue (node, value) {
      console.log(`${this.conditionNode.split('=')[2]}.${node}`, value)
      top.webMI.data.write(`${this.conditionNode.split('=')[2]}.${node}`, value)
      // top.webMI.data.write(`${this.base}.${node}`, value)
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
