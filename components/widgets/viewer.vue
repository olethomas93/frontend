<template>
  <v-container :fluid="true" :style="{height: height, padding: large && showMap ? null : '0px'}" class="fill-height">
    <div style="display: flex; flex-direction: column; height: 100%; width: 100%;">
    <v-btn-toggle
      v-if="large"
      v-model="localViewType"
      density="compact"
      variant="outlined"
      class="mb-1"
    >
      <v-btn value="list" icon="mdi-view-list" size="small" />
      <v-btn value="grid" icon="mdi-view-grid" size="small" />
      <v-btn value="customGrid" icon="mdi-view-module" size="small" />
      <v-btn value="dashboard" icon="mdi-view-dashboard" size="small" />
    </v-btn-toggle>
    <splitpanes ref="row" class="default-theme" style="flex: 1;">
      <pane :size="listSize" :style="{maxHeight: height, padding: large && showMap ? null : '0px' }">
        <data-table
          v-if="showList || localViewType === 'list'"
          v-model="selected"
          :show-search="showSearch"
          :items="items"
          :headers="headers"
          :mobile-headers="mobileHeaders"
          :table-props="{ ...tableProps, ...extTableProps }"
          @click:row="click"
          @current-items="currentItems = $event"
        >
          <template #expanded-row="{ item, columns }">
            <td :colspan="columns.length">
              <atvise-visu-v3 v-if="$lodash.get(item, `childs.${expandDisplay}`)" :base="item.nodeid" :settings="$lodash.get(item, `childs.${expandDisplay}.nodeid`)" />
            </td>
          </template>
        </data-table>
        <dashboard-dashboards
          v-else-if="localViewType==='dashboard'"
          :base="base"
          :dashboard-base="dashboardBase"
          type="public"
        />
        <crud-card-grid
          v-else
          :width="widgetWidth"
          :address="base"
          :items="items"
          :responsive="localViewType === 'customGrid'"
          display="widget"
          :description-in-title="descriptionInTitle"
          @click="click"
        >
          <template #icons="{ item }">
            <v-spacer />
            <data-table-widget-trend-icon :item="item" />
            <data-table-widget-settings-icon v-if="showSettings || rights.engineer" :item="item" />
          </template>
        </crud-card-grid>
        <!-- <viewer-add-fab v-if="rights.engineer && canAdd" :object-types="objectTypes" @add="addDialog = true" />
        <viewer-add-dialog v-model="addDialog" @close="addDialog = false" /> -->
        <crud-widget-v2
          :base="base"
          :can-add="rights.engineer && canAdd"
          :can-edit="rights.write && canEdit"
          _can-delete
          :add-copy="addCopy"
          :selected="selected"
          :object-type="objectType"
          :object-types="objectTypes"
          @update="init"
        />
      </pane>
      <pane v-if="large && showMap" :size="100-listSize">
        <component
          :is="map"
          v-if="mapDelay"
          :items="mapItems"
          :show-map-edit="showMapEdit"
          :visu="mapVisu"
          @click="click"
        >
          <!-- <template #overlay>
            <map-info-drawer :show-button="true">
              <template #content>
                <div>test</div>
              </template>
            </map-info-drawer>
          </template> -->
        </component>
        <!-- <map-general :items="mapItems" @click="click" /> -->
      </pane>
    </splitpanes>
    </div>
  </v-container>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import Rights from '@/global/atviseRightsMixin'

export default {
  components: {
    Splitpanes,
    Pane
  },
  mixins: [
    Rights
  ],
  props: {
    base: {
      type: String,
      default: ''
    },
    canAdd: {
      type: Boolean,
      default: false
    },
    addCopy: {
      type: Boolean,
      default: false
    },
    canDelete: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    showMap: {
      type: Boolean,
      default: false
    },
    showMapEdit: {
      type: Boolean,
      default: false
    },
    map: {
      type: String,
      default: 'map-general'
    },
    mapVisu: {
      type: String,
      default: undefined
    },
    listSize: {
      type: [Number, String],
      default: 30
    },
    showId: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    showExpand: {
      type: Boolean,
      default: false
    },
    expandAll: {
      type: Boolean,
      default: false
    },
    expandDisplay: {
      type: String,
      default: '_widget'
    },
    showSettings: {
      type: Boolean,
      default: true
    },
    showAlarm: {
      type: Boolean,
      default: true
    },
    showDescription: {
      type: Boolean,
      default: true
    },
    showValue: {
      type: Boolean,
      default: true
    },
    showTimestamp: {
      type: Boolean,
      default: false
    },
    showTrend: {
      type: Boolean,
      default: true
    },
    viewType: {
      type: String,
      default: 'list'
    },
    showMeasurements: {
      type: Boolean,
      default: true
    },
    browseEndLevel: {
      type: [Number, String],
      default: 3
    },
    widgetWidth: {
      type: [String, Number],
      default: '400'
    },
    objectType: {
      type: String,
      default: 'ObjectTypes.PROJECT'
    },
    objectTypes: {
      type: Array,
      default: () => { return [] }
    },
    extraHeader: {
      type: Object,
      default: () => { return {} }
    },
    descriptionInTitle: {
      type: [Boolean, String],
      default: false
    },
    showTypes: {
      type: Array,
      default: () => { return ['ObjectTypes'] }
    },
    sortOrder: {
      type: String,
      default: undefined
    },
    externalItems: {
      type: Array,
      default: undefined
    },
    extraHeaders: {
      type: Array,
      default: undefined
    },
    extTableProps: {
      type: Object,
      default: () => {
        return {
          // showSelect: false,
          // singleSelect: true,
          // hideDefaultFooter: true
          // showExpand: false
        }
      }
    },
    group: {
      type: String,
      default: 'group1'
    },
    dashboardBase: {
      type: String,
      default: ''
    },
    nameHeaderWidth: {
      type: [Number, String],
      default: undefined
    },
    descHeaderWidth: {
      type: [Number, String],
      default: undefined
    },
    valueHeaderWidth: {
      type: [Number, String],
      default: undefined
    }
  },
  data () {
    return {
      localViewType: this.viewType,
      addDialog: false,
      items: [],
      selected: [],
      currentItems: [],
      tableProps: {
        hideDefaultFooter: true,
        itemsPerPage: -1
      },
      mapDelay: false
      // tableProps: {
      //   showSelect: false,
      //   singleSelect: true,
      //   hideDefaultFooter: true,
      //   showExpand: false,
      //   hideDefaultHeader: false
      // }
      // headers: []
    }
  },
  computed: {
    activeShowTypes () {
      const types = [...this.showTypes]
      if (this.showMeasurements) {
        types.push('VariableTypes.PROJECT.measurement')
      }
      return types
    },
    mapItems () {
      return this.currentItems.map((item) => {
        // const posNode = this.$lodash.get(item, 'item.childs.position.nodeid')
        // if (posNode) {
        //   item.pos = this.getPosition(posNode)
        // }
        // item.pos = JSON.parse(item.childs?.position?.value) || { lat: 0, lng: 0 }
        // item.connected = item.childs?.connected?.value || true
        return item
      })
    },
    height () {
      return this.showMap ? 'calc(100vh - 64px)' : undefined
    },
    showList () {
      return this.$vuetify.display.smAndDown
    },
    large () {
      return this.$vuetify.display.mdAndUp
    },
    hasOnline () {
      return this.$lodash.has(this.items, '[0].childs.datasourceOnline') || this.$lodash.has(this.items, '[0].childs.connected')
    },
    headers () {
      let temp = []
      if (this.hasOnline) {
        temp.push({ text: '', value: 'childs.connected.value', width: 80, sortable: true, custom: { component: 'datasource-online-icon' }, groupable: false })
      }
      if (this.showId) {
        temp.push({ text: this.$T('id'), value: 'browsename', groupable: false })
      }
      temp.push({ text: this.$T('Name'), width: this.nameHeaderWidth, value: 'displayname', groupable: false })
      if (this.showDescription) {
        temp.push({
          text: this.$T('Description'),
          value: 'description',
          groupable: false,
          customFilter: false,
          width: this.descHeaderWidth
        })
      }
      if (this.extraHeaders) {
        // temp.push(this.extraHeaders[0])
        temp = [...temp, ...this.extraHeaders]
        // temp.push({ text: this.extraHeader.text, value: this.extraHeader.text, sortable: true })
      }
      // if (this.extraHeader.active) {
      //   temp.push({ text: this.extraHeader.text, value: this.extraHeader.text, sortable: true })
      // }
      if (this.showValue) {
        temp.push({ text: this.$T('Value'), width: this.valueHeaderWidth, value: 'childs.value.value', sortable: true, custom: { component: 'value-unit', props: { showTimestamp: this.showTimestamp } } })
      }
      if (this.showTrend) {
        temp.push({ text: this.$T('Trend'), value: 'childs.trend.nodeid', width: 80, sortable: false, custom: { component: 'trend-icon' } })
      }
      if (this.showAlarm) {
        temp.push({ text: this.$T('alarm_text'), value: 'nodeid', width: 50, sortable: false, custom: { component: 'alarm-icon' }, groupable: false })
      }
      if (this.showSettings) {
        temp.push({ text: this.$T('setting_text'), value: 'childs._settings.nodeid', width: 50, sortable: false, custom: { component: 'settings-icon' }, groupable: false })
      }
      return temp
    },
    mobileHeaders () {
      let temp = []
      temp.push({ text: this.$T('Name'), value: 'displayname' })
      // temp.push({ text: this.$T('Description'), value: 'description' })
      if (this.extraHeaders) {
        // temp.push(this.extraHeaders[0])
        temp = [...temp, ...this.extraHeaders]
        // temp.push({ text: this.extraHeader.text, value: this.extraHeader.text, sortable: true })
      }
      if (this.showValue) {
        temp.push({ text: this.$T('Value'), value: 'childs.value.value', sortable: true, custom: { component: 'value-unit' }, groupable: false })
      }
      if (this.showAlarm) {
        temp.push({ text: this.$T('Alarm'), value: 'nodeid', width: 80, sortable: false, custom: { component: 'alarm-icon' }, groupable: false })
      }
      // if ((this.showSettings && this.rights.write) || this.rights.engineer) {
      if ((this.showSettings && this.rights.write) || this.rights.engineer) {
        temp.push({ text: 'Edit', value: 'childs._settings.nodeid', width: 50, sortable: false, custom: { component: 'settings-icon' }, groupable: false })
      }
      return temp
    }
  },
  watch: {
    viewType (val) {
      this.localViewType = val
    },
    'rights.write' (value) {
      // eslint-disable-next-line vue/no-mutating-props
      this.tableProps.showSelect = value && this.canEdit
      this.tableProps.singleSelect = true
    },
    'showExpand' (value) {
      this.tableProps.showExpand = value
    },
    expandAll (value) {
      this.tableProps.expandAll = value
    },
    base () {
      this.init()
    },
    sortOrder (val) {
      // console.log('Sort order set')
      // console.log(val)
    },
    externalItems () {
      this.items = this.externalItems
    },
    currentItems (value) {
      // Emit to other components (used in dashboards)
      this.$eventBus.$emit(this.group + ':currentItems', value)
    }
  },
  mounted () {
    if (this.base.length > 0) {
      this.init()
    }
    // Delay before showing map. Bugfix for map centering
    setTimeout(() => { this.mapDelay = true }, 500)
    // this.tableProps.showExpand = this.showExpand
    // this.tableProps.expandAll = this.expandAll
  },
  methods: {
    async init () {
      this.selected = []
      try {
        let sortOrder
        if (this.sortOrder) {
          sortOrder = await this.readNode(this.sortOrder)
          // console.log(sortOrder)
        }
        // let items = this.externalItems
        // if (!items) {
        //   items = await this.getItems()
        // }
        let items = await this.getItems()
        // Filters what to show
        // if (this.showMeasurements) {
        //   // items = items.filter((item) => { return item.typeDefinition.includes('ObjectTypes') || item.typeDefinition.includes('VariableTypes.PROJECT') || item.typeDefinition === 'i=62' })
        //   items = items.filter((item) => { return item.typeDefinition.includes('ObjectTypes') || item.typeDefinition.includes('VariableTypes.PROJECT.measurement') })
        // } else {
        //   items = items.filter((item) => { return item.typeDefinition.includes('ObjectTypes') })
        // }

        items = items.filter((item) => {
          if (!item.typeDefinition) { return false }
          return this.activeShowTypes.some(type => item.typeDefinition.includes(type))
        })
        if (sortOrder) {
          await items.forEach((item) => {
            item.index = sortOrder.indexOf(item.browsename)
          })
          items = items.filter((item) => { return item.index >= 0 })
        }

        if (items.length > 0 && items[0].index >= 0) {
          this.items = items.sort((a, b) => { return a.index - b.index })
        } else {
          this.items = items
        }
        await Promise.all(
          items.map(async (item) => {
            const posNode = this.$lodash.get(item, 'childs.position.nodeid')
            if (posNode) {
              item.pos = await this.getPosition(posNode)
            }
            item.connected = true
            // const disable = this.$lodash.get(item, 'childs.disable.nodeid')
            // if (disable) {
            //   item.childs.disable.value = await this.getDisable(disable)
            // }
            return item
          })
        )
        items = items.filter((item) => { return item.childs?.disable?.value !== true })
        // read extra header value
        if (Object.keys(this.extraHeader).length > 0) {
          for (const item in this.items) {
            const value = await this.readNode(`${this.items[item].nodeid}${this.extraHeader.value}`)
            this.items[item][this.extraHeader.text] = value
          }
        }
        this.items = items
      } catch (err) {
        console.error('[viewer] init() failed:', err)
      }
    },
    getDisable (address) {
      return new Promise((resolve) => {
        top.webMI.data.read(address, (data) => {
          resolve(data.value)
        })
      })
    },
    getPosition (address) {
      return new Promise((resolve) => {
        top.webMI.data.read(address, (data) => {
          resolve(JSON.parse(data.value))
        })
      })
    },
    readNode (node) {
      return new Promise((resolve) => {
        top.webMI.data.read(node, function (data) {
          resolve(data.value)
        })
      })
    },
    getItems () {
      return new Promise((resolve, reject) => {
        const vTypes = this.objectTypes.map((item) => { return item.objectType })
        // const vTypes = []
        vTypes.push('ObjectTypes.PROJECT')
        vTypes.push('VariableTypes.ATVISE.Display')
        vTypes.push('i=61')
        vTypes.push('i=62')
        vTypes.push('VariableTypes.PROJECT.measurement')
        vTypes.push('VariableTypes.PROJECT.setting')
        const filter = {
          startAddress: this.base,
          endLevel: this.browseEndLevel,
          vTypes,
          mapping: ['browsename:browsename', 'displayname:displayname', 'nodeid:nodeid:splitnamespace', 'description:description', 'typeDefinition:typedefinition:splitnamespace', 'value:value']
        }
        top.webMI.data.call('BrowseNodes', filter, (data) => {
          resolve(this.toArray(data))
        })
      })
    },
    toArray (data) {
      return Object.keys(data).map((i) => {
        // this.toArray(data[i].childs)
        return data[i]
      })
    },
    click (item) {
      if (item.childs?.default) {
        this.$router.push({ query: { base: item.nodeid, display: item.childs.default.nodeid } })
      } else if (item.childs?._default) {
        this.$router.push({ query: { base: item.nodeid, display: item.childs._default.nodeid } })
      }
    }
  }
}
</script>

<style>
.splitpanes__pane {
  overflow: auto;
}
</style>
