<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-text-field
          v-for="(i, index) in items"
          :key="index"
          :value="i.value"
          :label="$T(i.label)"
          readonly
        />
        <!-- <v-text-field :value="item.activetime" :label="$T('Active time')" readonly />
        <v-text-field :value="item.areaName" :label="$T('Area')" />
        <v-text-field :value="item.system + ' - ' + item.systemName" :label="$T('System')" />
        <v-text-field :value="item.componentName" :label="$T('Component')" /> -->
      </v-col>
      <v-col cols="9">
        <alarm-timeline :alarm="item" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AlarmTimeline from './timeline.vue'
export default {
  components: {
    AlarmTimeline
  },
  props: {
    item: {
      type: Object,
      default: undefined
    }
  },
  data  () {
    return {
    }
  },
  computed: {
    items () {
      const items = [
        {
          value: this.formatTimestamp(this.item.activetime) || this.formatTimestamp(this.item.timestamp),
          label: 'Active time'
        }
      ]
      const alarmListExtraItems = this.$lodash.get(top.webMIConfig, 'nuxt.alarmList.extraItems', [])
      const alarmInfoExtraItems = this.$lodash.get(top.webMIConfig, 'nuxt.alarmInfo.extraItems', [])

      if (alarmInfoExtraItems.length > 0) {
        alarmInfoExtraItems.forEach((item) => {
          if (Array.isArray(item.value)) {
            for (const value of item.value) {
              if (this.item[value]) {
                items.push({
                  value: this.item[value],
                  label: item.text
                })
                break // Exit loop after first match
              }
            }
          } else {
            items.push({
              value: this.item[item.value],
              label: item.text
            })
          }
        })
      } else {
        alarmListExtraItems.forEach((item) => {
          if (Array.isArray(item.value)) {
            for (const value of item.value) {
              if (this.item[value]) {
                items.push({
                  value: this.item[value],
                  label: item.text
                })
                break // Exit loop after first match
              }
            }
          } else {
            items.push({
              value: this.item[item.value],
              label: item.text
            })
          }
        })
      }

      // {
      //   // value: this.item.areaName || this.item.area || this.item..split('.')[2],
      //   value: this.item.siteName || this.item.site || this.item.InputNode.split('.')[2],
      //   label: 'Site'
      // },

      // {
      //   value: this.item.buildingName || this.item.building,
      //   label: 'Building'
      // },
      // {
      //   value: this.item.systemName,
      //   label: 'System'
      // },
      // {
      //   value: this.item.componentName,
      //   label: 'Component'
      // },
      // {
      //   value: this.item.documentationId,
      //   label: 'Documentation ID'
      // },

      items.push({
        value: this.item.InputNode,
        label: 'Address'
      })
      return items
    }
  },
  mounted () {
    console.log('alarm info mounted')
  },
  methods: {
    formatTimestamp (timestamp) {
      const useUTC = this.$lodash.get(top.webMIConfig, 'nuxt.useUTC', false)
      if (useUTC) {
        return new Date(timestamp).toISOString().split('.')[0] + 'Z'
      } else {
        return new Date(timestamp).toLocaleString()
      }
    }
  }
}
</script>

<style></style>
