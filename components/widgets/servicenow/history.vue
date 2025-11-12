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
      </v-col>
      <v-col cols="9">
        <servicenow-timeline :event="item" :base="base" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ServicenowTimeline from './timeline.vue'
export default {
  components: {
    ServicenowTimeline
  },
  props: {
    base: {
      type: String,
      default: ''
    },
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
      return [
        {
          value: this.item.ticketNumber,
          label: 'Ticket number'
        },
        {
          value: this.item.ticket_createdString || this.item.activetimestring || this.item.timestamp,
          label: 'Ticket created'
        },
        {
          // value: this.item.areaName || this.item.area || this.item..split('.')[2],
          value: this.item.siteName || this.item.site || this.item.InputNode.split('.')[2],
          label: 'Site'
        },
        {
          value: this.item.buildingName || this.item.building,
          label: 'Building'
        },
        {
          value: this.item.systemName,
          label: 'System'
        },
        {
          value: this.item.componentName,
          label: 'Component'
        },
        {
          value: this.item.documentationId,
          label: 'Documentation ID'
        },
        {
          value: this.item.InputNode,
          label: 'Address'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>

  <style>

  </style>
