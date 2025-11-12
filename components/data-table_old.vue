<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-data-table
          :items="items"
          :show-expand="true"
          :items-per-page="5"
          :headers="headers"
          item-key="nodeid"
          class="elevation-1"
          :disable-pagination="true"
          :hide-default-footer="true"
          :fixed-header="true"
          height="100%"
          :dark="theme.isDark"
          mobile-breakpoint="0"
          @click:row="click"
        >
          <template #expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              Mer informasjon om {{ item.name }}
            </td>
          </template>
          <template #[`item.name`]="{ item }">
            {{ $lodash.upperFirst(item.name) }}
          </template>
          <template #[`item.alarms`]="{ item }">
            <alarm-icon :node-id="item.nodeid" overlap />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import alarmIcon from '@/components/common/alarm/iconButton.vue'

export default {
  components: {
    alarmIcon
  },
  inject: ['theme'],
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    types: {
      type: Array,
      default: () => { return [] }
    },
    subtype: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: [],
      display: '',
      recursive: false,
      headers: [
        { text: 'Expand', value: 'data-table-expand' },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'desc.en' },
        // { text: 'Node id', value: 'nodeid' },
        { text: 'Alarm', value: 'alarms' }
      ]
    }
  },
  watch: {
    base (val) {
      this.browse(val)
    }
  },
  async mounted () {
    await this.browse(this.base)
  },
  methods: {
    click (item) {
      const isDisplay = item.TypeDefinition === 'VariableTypes.ATVISE.Display'
      const visDefault = item.TypeDefinition.includes('ObjectTypes.PROJECT.jmh.plantegningsobjekter') || item.TypeDefinition.includes('ObjectTypes.PROJECT.jmh.teknsikeAnlegg')
      // let display = isDisplay ? item.nodeid : 'AGENT.DISPLAYS.Main'
      const display = visDefault ? item.nodeid + '.default' : item.nodeid
      if (isDisplay || visDefault) {
        this.$router.push(
          {
            query: {
              display,
              parameters: JSON.stringify({ base: item.nodeid }),
              iframe: 'content'
            }
          }
        )
        // this.$router.push(`/?display=${display}&args=${JSON.stringify({ base: item.nodeid })}&time=${new Date().getTime()}`)
      } else {
        this.$router.push(
          {
            query: {
              display,
              parameters: JSON.stringify({ base: item.nodeid }),
              iframe: 'browser'
            }
          }
        )
        // this.$router.push(`/?display=datatable&base=${item.nodeid}&time=${new Date().getTime()}`)
      }
    },
    browse (nodeid) {
      return new Promise((resolve) => {
        top.webMI.data.call('BrowseNodes', {
          startAddress: 'ns=1;s=' + nodeid,
          endLevel: this.recursive ? 0 : 1,
          vTypes: this.types,
          subtype: this.subtype,
          includeStartAddress: !!this.recursive,
          mapping: ['nodeid:nodeid:splitnamespace', 'name:browsename', 'TypeDefinition:typedefinition:splitnamespace']
        }, async (data) => {
          const arr = []
          if (this.recursive) {
            data = this.toArray(data)
            this.startTraverse(data[0], 'childs', (data) => {
              if (data.TypeDefinition.includes(this.type)) {
                data.display = this.display.includes('ObjectTypes') || this.display.includes('AGENT') ? this.display : data.nodeid + '.' + this.display
                data.name = this.getName(data)
                this.items.push(data)
              }
            })
            resolve()
          } else {
            for (const i in data) {
              data[i].name = this.getName(data[i])
              data[i].desc = await this.read(data[i].nodeid + '.description') // await this.read(data[i].nodeid + '.beskrivelse') || await this.read(data[i].nodeid + '.betjener')
              data[i].display = this.getDisplay(data[i], this.display)// this.display.includes('ObjectTypes') || this.display.includes('AGENT')  ? this.display : data[i].nodeid + '.' + this.display
              arr.push(data[i])
            }
            this.items = arr
            resolve(arr)
          }
        })
      })
    },
    getDisplay (node, display) {
      return node.TypeDefinition + '._browser'
    },
    getName (data) {
      const type = data.TypeDefinition
      const arr = data.nodeid.split('.')
      const length = arr.length
      if (type.includes('ObjectTypes.PROJECT.jmh.oversiktsObjekter')) {
        return arr.slice(length - 1).join('.')
      } else if (type.includes('ObjectTypes.PROJECT.jmh.teknsikeAnlegg')) {
        return arr.slice(length - 2).join('.')
      } else if (type.includes('ObjectTypes.PROJECT.jmh.komponenter')) {
        return arr.slice(length - 3).join('.')
      } else {
        return data.name
      }
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
    },
    read (nodeid) {
      return new Promise((resolve) => {
        top.webMI.data.read(nodeid, function (data) {
          resolve(data.value)
        })
      })
    },
    startTraverse (parent, childkey, cb) {
      const self = this
      const node = parent
      const child = childkey
      node[child] = this.toArray(node[child])
      for (let i = 0; i < node[child].length; i++) {
        // cb(node);
        traverse(node[child][i])
      }
      function traverse (childnode) {
        childnode[child] = self.toArray(childnode[child])
        if (childnode[child].length === 0) {
          cb(childnode)
          return
        }
        for (let j = 0; j < childnode[child].length; j++) {
          cb(childnode)
          traverse(childnode[child][j])
        }
      }
    }
  }
}

</script>

<style>

</style>
