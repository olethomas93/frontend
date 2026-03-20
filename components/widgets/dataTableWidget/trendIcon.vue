<template>
  <div v-if="getTrend()">
    <v-tooltip open-delay="500" top dark>
      <template #activator="{ props }">
        <v-btn icon v-bind="props" @click.stop="dialog = true">
          <v-icon>
            mdi-chart-line
          </v-icon>
        </v-btn>
      </template>
      <span>Open trend</span>
    </v-tooltip>
    <v-dialog v-if="dialog" v-model="dialog" width="800" :fullscreen="fullscreen">
      <v-card>
        <v-card-title>
          Trend {{ item.displayname }}
          <v-spacer />
          <v-btn icon @click="fullscreen = !fullscreen">
            <v-icon>{{ fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }} </v-icon>
          </v-btn>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text :style="{height: fullscreen ? 'calc(100vh - 62px)' : '600px'}">
          <!-- <atvise-visu-v3 :query="{unit}" :base="item.nodeid" :settings="item.typeDefinition + '.trend'" /> -->
          <atvise-visu-v3 :query="{unit}" :base="item.nodeid" :settings="getTrend()" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => { return {} }
    },
    value: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      fullscreen: false,
      dialog: false
    }
  },
  computed: {
    unit () {
      return this.item.childs.unit?.value || ''
    }
  },
  methods: {
    getTrend () {
      if (this.item.childs.trend) {
        return this.item.childs.trend.nodeid
      }
      if (this.item.childs._trend) {
        return this.item.childs._trend.nodeid
      }
      return undefined
    }
  }
}
</script>

<style>

</style>
