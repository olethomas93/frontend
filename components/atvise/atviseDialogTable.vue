<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :dense="true"
    hide-default-footer
    disable-pagination
  >
    <template #[`item.displayname`]="{ item }">
      {{ $store.getters['translation/translateText']('T{'+item.displayname+'}') }}
    </template>
    <template #[`item.value`]="{ item }">
      <template v-if="isOutput(item)">
        <v-text-field
          :value="$lodash.round(item.value, 2)"
          dense
          solo
          hide-details
          type="number"
          @keydown.stop=""
        />
      </template>
      <template v-else>
        {{ $lodash.round(item.value, 1) }} {{ item.childs ? item.childs.engUnit ? item.childs.engUnit.value : '' : '' }}
      </template>
    </template>
    <template #[`item.trend`]="{ item }">
      <v-switch
        v-if="true"
        v-model="item.trend"
        hide-details
        dense
        style="margin:auto;"
        @change="trendChange($event, item)"
      />
    </template>
    <template #[`item.alarms`]="{ item }">
      <alarm-icon v-if="true" :node-id="item.nodeid" overlap />
    </template>
  </v-data-table>
</template>

<script>
import alarmIcon from '@/components/common/alarm/iconButton.vue'
export default {
  components: {
    alarmIcon
  },
  props: {
    base: {
      type: String,
      default: undefined
    }
  },
  data: () => ({
    headers: [
      { text: 'Name', value: 'displayname' },
      { text: 'Value', value: 'value' },
      { text: 'Trend', value: 'trend', width: 50, sortable: false },
      { text: 'Alarm', value: 'alarms', width: 50, sortable: false }
    ],
    items: [],
    browsedItems: {}
  }),
  mounted () {
    this.$browse(this.base, ['i=62', 'i=68', 'VariableTypes.ATVISE.Mirror', 'ObjectTypes.ATVISE.ArchiveGroup.Data'], true, 2).then((data) => {
      this.browsedItems = data
      if (data.listViewSettings) {
        // console.log(data.listViewSettings.value)
        const ret = []
        data.listViewSettings.value.forEach((item) => {
          ret.push(data[item])
        })
        this.items = ret
      } else {
        this.items = this.toArray(data)
      }
      setTimeout(() => {
        if (data.trendViewSettings) {
          data.trendViewSettings.value.forEach((item) => {
            const index = this.$lodash.findIndex(this.items, { name: item })
            this.$set(this.items[index], 'trend', true)
            this.trendChange(true, data[item])
          })
        }
      }, 200)

      // if (data.listViewSettings) { console.log() }
      // data.map((item) => {
      //   // item.value = Math.random() * 100
      //   // item.value = 0
      //   // item.value = await this.read(item)
      //   return item
      // })
    })
  },
  methods: {
    trendChange (event, data) {
      if (event) {
        // top.webMI.trigger.fire('trendChange', { cmd: 'addPen', data }, 'atviseDialogTrend')
        this.$nuxt.$emit('trendChange', { cmd: 'addPen', data }, 'atviseDialogTrend')
      } else {
        // top.webMI.trigger.fire('trendChange', { cmd: 'removePen', data }, 'atviseDialogTrend')
        this.$nuxt.$emit('trendChange', { cmd: 'removePen', data }, 'atviseDialogTrend')
      }
    },
    isOutput () {
      return false
    },
    toArray (obj) {
      const arr = []
      if (obj === null) {
        return []
      }
      Object.keys(obj).forEach((data) => {
        arr.push(obj[data])
      })
      return arr
    }
    // read (item) {
    //   return new Promise((resolve) => {
    //     top.webMI.data.read(item.nodeid, (data) => {
    //       resolve(data.value)
    //     })
    //   })
    // }
  }
}
</script>

<style>

</style>
