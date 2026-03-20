<template>
  <div>
    <v-treeview
      :v-model.sync="tree"
      :open.sync="openItem"
      :active.sync="activeItem"
      :items="items"
      :load-children="browse"
      item-key="nodeid"
      item-title="displayname"
      item-children="childs"
      transition
      color="primary"
      hoverable
      selection-type="independent"
      :open-on-click="false"
      :multiple-active="false"
      :return-object="true"
      activatable
      density="compact"
      @update:active="$emit('update:active', $event)"
    >
      <template #prepend="{ item, open }">
        <v-icon @contextmenu="show($event, item)">
          {{ open ? getIcon(item).open : getIcon(item).closed }}
        </v-icon>
      </template>
      <template #append="{ item }">
        <alarm-icon v-if="showAlarm" :node-id="item.nodeid" overlap />
      </template>
      <template #label="{ item }">
        <div @contextmenu="show($event,item)" @dblclick="dblclick(item)" @click="$emit('click', item)">
          {{ item.displayname === item.description ? item.displayname : `${item.displayname} - ${item.description}` }}
        </div>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import alarmIcon from '@/components/common/alarm/iconButton.vue'

export default {
  components: {
    alarmIcon
  },
  props: {
    name: {
      type: String,
      default: 'Root'
    },
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    types: {
      type: Array,
      default: () => {
        return ['i=61', 'i=62', 'VariableTypes.PROJECT', 'ObjectTypes.PROJECT', 'ObjectTypes.ATVISE.AlarmConfiguration', 'VariableTypes.ATVISE.Smoothing', 'VariableTypes.ATVISE']
      }
    },
    subtype: {
      type: Boolean,
      default: false
    },
    showAlarm: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    items: [],
    tree: [],
    openItem: [],
    activeItem: [],
    showMenu: false,
    x: 0,
    y: 0
  }),
  computed: {
    menuItems () {
      const arr = []
      arr.push({
        text: 'Acknowledge',
        icon: 'mdi-check'
      })
      return arr
    }
  },
  watch: {
    base (val) {
      this.items[0].nodeid = val
    }
  },
  async mounted () {
    this.items = await this.browse({ nodeid: this.base }, true)
  },
  methods: {
    async refresh () {
      console.log('tree refreshing')
      this.items = []
      this.items = await this.browse({ nodeid: this.base }, true)
    },
    getIcon (item) {
      const type = item.typedefinition
      if (type === 'i=61') {
        return { closed: 'mdi-folder', open: 'mdi-folder-open' }
      } else if (type.includes('VariableTypes.PROJECT.setting.string.color')) {
        return { closed: 'mdi-palette', open: 'mdi-palette' }
      } else if (type === 'VariableTypes.PROJECT.VueComponent') {
        return { closed: 'mdi-vuejs', open: 'mdi-vuejs' }
      } else if (type === 'VariableTypes.ATVISE.Resource.OctetStream') {
        return { closed: 'mdi-vuejs', open: 'mdi-vuejs' }
      } else if (type === 'i=62' || type.includes('VariableTypes.PROJECT')) {
        return { closed: 'mdi-circle-medium', open: 'mdi-circle-medium' }
      } else if (type === 'VariableTypes.ATVISE.Display') {
        return { closed: 'mdi-view-dashboard', open: 'mdi-view-dashboard-outline' }
      } else if (type === 'ObjectTypes.ATVISE.AlarmConfiguration') {
        return { closed: 'mdi-bell', open: 'mdi-bell-outline' }
      } else if (type === 'VariableTypes.ATVISE.ScriptCode') {
        return { closed: 'mdi-script-text-outline', open: 'mdi-script-text-outline' }
      } else if (type.includes('ObjectTypes.PROJECT')) {
        return { closed: 'mdi-cube', open: 'mdi-cube-outline' }
      } else {
        return { closed: 'mdi-cog', open: 'mdi-cog-outline' }
      }
    },
    debug (val) {
      this.$emit('selected', val)
    },
    browse (item, first = false) {
      return new Promise((resolve, reject) => {
        const filter = {
          startAddress: item.nodeid,
          endLevel: 1,
          vTypes: this.types,
          includeStartAddress: first,
          mapping: ['nodeid:nodeid:splitnamespace', 'displayname:displayname', 'description:description', 'browsename:browsename', 'typedefinition:typeDefinition']
        }
        top.webMI.data.call('BrowseNodes', filter, (data) => {
          const arr = this.objToArr(data)
          if (item.childs) {
            item.childs = arr
          }
          resolve(arr)
        })
      })
    },
    objToArr (data) {
      const arr = []
      for (const i in data) {
        // console.log(data[i])
        data[i].childs = data[i].childs !== 'ondemand' ? this.objToArr(data[i].childs) : []// []
        const typedefinition = this.$lodash.get(data[i], 'typedefinition.xml', '')
        data[i].typedefinition = typedefinition.replace('ns=1;s=', '')
        arr.push(data[i])
      }
      return this.$lodash.orderBy(arr, ['typedefinition'])
    },
    read (nodeid) {
      return new Promise((resolve) => {
        top.webMI.data.read(nodeid, function (data) {
          resolve(data.value)
        })
      })
    },
    show (e, item) {
      this.$emit('contextmenu', { e, item })
    },
    dblclick (item) {
      this.$emit('dblclick', item)
    },
    update (val) {
    }

  }
}
</script>

<style>

</style>
