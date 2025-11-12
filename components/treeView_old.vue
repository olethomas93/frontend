<template>
  <div>
    <v-treeview
      :v-model.sync="tree"
      :open.sync="openItem"
      :active.sync="activeItem"
      :items="items"
      _load-children="browse"
      item-key="nodeid"
      item-text="name"
      item-children="childs"
      transition
      color="#202020"
      selection-type="independent"
      :open-on-click="false"
      :multiple-active="false"
      :return-object="true"
      activatable
      dense
      dark
      @update:active="update"
    >
      <template #prepend="{ item, open }">
        <v-icon v-if="item.icon">
          {{ open ? item.icon.open : item.icon.closed }}
        </v-icon>
        <!-- <v-icon
          v-else-if="item.TypeDefinition.includes('location')"
        >
          mdi-map-marker
        </v-icon>
        <v-icon
          v-else-if="item.TypeDefinition.includes('ObjectTypes.PROJECT')"
        >
          mdi-cube
        </v-icon>
        <v-icon
          v-else-if="item.TypeDefinition == 'i=61'"
        >
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon
          v-if="item.TypeDefinition == 'VariableTypes.ATVISE.Display'"
        >
          mdi-widgets
        </v-icon>
        <v-icon
          v-else-if="item.TypeDefinition == 'i=62' || item.TypeDefinition == 'i=63' || item.TypeDefinition.includes('VariableTypes')"
        >
          mdi-circle-medium
        </v-icon> -->
      </template>
      <template #append="{ item }">
        <alarm-icon :node-id="item.nodeid" overlap />
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
        return [
          'ObjectTypes.PROJECT.jmh',
          61
        ]
      }
    },
    subtype: {
      type: Boolean,
      default: false
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
    this.items = [
      {
        // childs: [],
        nodeid: this.base,
        name: this.name,
        // TypeDefinition:'ObjectTypes.PROJECT.jmh'
        TypeDefinition: 'i=61'
      }
    ]
    this.items = await this.browse(this.items[0])
  },
  methods: {
    debug (val) {
      this.$emit('selected', val)
    },
    browse (item) {
      console.log(item)
      console.log('browsing')
      return new Promise((resolve, reject) => {
        top.webMI.data.call('JMH_getSidebarMenu', {}, (data) => {
          // const arr = this.objToArr(data)
          resolve(data)
        })
      })
      // return new Promise((resolve, reject) => {
      //   top.webMI.data.call('BrowseNodes', {
      //     startAddress: 'ns=1;s=' + item.nodeid,
      //     endLevel: 3,
      //     vTypes: this.types,
      //     subtype: this.subtype,
      //     mapping: ['nodeid:nodeid:splitnamespace', 'description:description', 'name:browsename', 'TypeDefinition:typedefinition:splitnamespace']
      //   }, (data) => {
      //     const arr = this.objToArr(data)
      //     if (item.childs) {
      //       item.childs = arr
      //     }
      //     resolve(arr)
      //   })
      // })
    },
    objToArr (data) {
      const arr = []
      for (const i in data) {
        // console.log(data[i])
        data[i].childs = data[i].childs !== 'ondemand' ? this.objToArr(data[i].childs) : []// []
        // data[i].desc = await this.read(data[i].nodeid + '.beskrivelse') || await this.read(data[i].nodeid + '.betjener') || ''
        // data[i].desc = this.read(data[i].nodeid + '.description')
        data[i].desc = ''
        const description = data[i].name === data[i].description ? '' : '-' + data[i].description
        data[i].name = data[i].name + '' + description
        arr.push(data[i])
      }
      return arr
    },
    read (nodeid) {
      return new Promise((resolve) => {
        top.webMI.data.read(nodeid, function (data) {
          resolve(data.value)
        })
      })
    },
    show (e, item) {
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    },
    update (val) {
      console.log(val)
      const isDisplay = val[0].TypeDefinition === 'VariableTypes.ATVISE.Display'
      // const isPlantegning = val[0].TypeDefinition.includes('ObjectTypes.PROJECT.jmh.plantegningsobjekter')
      const display = isDisplay ? val[0].nodeid : val[0].nodeid + '.default' // 'AGENT.DISPLAYS.Main' // val[0].nodeid + '.default'
      // display = isPlantegning ? val[0].nodeid + '.default' : display
      // const args = val[0].nodeid.includes('AGENT.OBJECTS') ? { base: val[0].nodeid } : {}
      const args = { base: val[0].nodeid }
      this.$router.push({ query: { display, parameters: JSON.stringify(args), iframe: 'content' } })
      // if (isDisplay || isPlantegning) {
      //   this.$router.push({ query: { display, parameters: JSON.stringify(args), iframe: 'content' } })
      // } else {
      //   this.$router.push({ query: { display, parameters: JSON.stringify(args), iframe: 'browser' } })
      // }
    }

  }
}
</script>

<style>

</style>
