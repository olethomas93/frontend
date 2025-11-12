<template>
  <v-sheet elevation="0" rounded outlined style="height:100%">
    <splitpanes class="default-theme">
      <pane size="35" min-size="10" max-size="90">
        <tree-view ref="tree" :base="base" :types="types" @dblclick="addTab" @contextmenu="showContextmenu" />
        <editor-context-menu v-model="showMenu" :position-x="x" :position-y="y" :selected="selectedItem" @refresh="refresh" />
      </pane>
      <pane>
        <v-tabs v-model="tab">
          <v-tab v-for="(item,index) in tabs" :key="item.nodeid" style="font-size:12px;">
            <div style="max-width:250px;direction:rtl;" class="text-truncate">
              {{ item.changed === true ? '*' : '' }} {{ item.nodeid }}
            </div>
            <v-btn icon :color="tab === index ? 'warning' : undefined" @click.stop="closeTab(item, index)">
              <v-icon>
                mdi-close-box-outline
              </v-icon>
            </v-btn>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" style="padding-top:12px">
          <v-tab-item v-for="item in tabs" :key="item.nodeid">
            <editor-view-script-code v-if="item.typedefinition === 'VariableTypes.ATVISE.ScriptCode'" :base="item.nodeid" :value="item" @changed="$set(item, 'changed', $event)" />
            <editor-view-vue-component v-else-if="item.typedefinition === 'VariableTypes.ATVISE.Resource.OctetStream'" :base="item.nodeid" :value="item" />
            <editor-view-default v-else :value="item" />
          </v-tab-item>
        </v-tabs-items>
      </pane>
    </splitpanes>
  </v-sheet>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default {
  components: {
    Splitpanes,
    Pane
  },
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    types: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      tab: 0,
      tabs: [],
      selected: undefined,
      showMenu: false,
      selectedItem: undefined,
      x: 0,
      y: 0
    }
  },
  mounted () {
  },
  methods: {
    refresh () {
      this.$refs.tree.refresh()
    },
    showContextmenu (data) {
      // console.log(data)
      this.selectedItem = data.item
      data.e.preventDefault()
      this.showMenu = false
      this.x = data.e.clientX
      this.y = data.e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    },
    addTab (item) {
      const index = this.$lodash.findIndex(this.tabs, (tab) => { return tab.nodeid === item.nodeid })
      if (index === -1) {
        this.tabs.push(item)
        this.tab = this.tabs.length - 1
      } else {
        this.tab = index
      }
    },
    closeTab (item, index) {
      if (item.changed !== true) {
        this.tabs.splice(index, 1)
      }
    }
    // setChanged (item, val) {
    //   this.$set(item, 'changed', val)
    // }
  }
}
</script>

<style>
.splitpanes.default-theme .splitpanes__pane {
  background: transparent;
}

.splitpanes__pane {
  padding:0px;
  overflow-y: scroll;
  /* box-shadow: 0 0 5px rgba(0, 0, 0, .2) inset; */
  /* justify-content: center;
  align-items: center; */
  /* display: flex; */
}

/* .splitpanes--vertical > .splitpanes__splitter {
  min-width: 6px;
  background: linear-gradient(90deg, #ccc, #111);
}

.splitpanes--horizontal > .splitpanes__splitter {
  min-height: 6px;
  background: linear-gradient(0deg, #ccc, #111);
} */
</style>
