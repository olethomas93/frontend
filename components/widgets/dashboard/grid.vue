<template>
  <div style="width:100%;height:100%;" class="ma-auto">
    <grid-layout
      ref="grid"
      :layout.sync="items"
      :col-num="24"
      :row-height="40"
      _breakpoints="{ lg: 1000, xs: 0 }"
      _cols="{ lg: 12, xs: 6 }"
      :is-draggable="editMode"
      :is-resizable="editMode"
      :vertical-compact="true"
      :margin="[10, 10]"
      :responsive="false"
      :auto-size="true"
      :transform-scale="0.5"
      use-css-transforms
      @layout-updated="layoutUpdatedEvent"
      @layout-ready="updateLayouts"
    >
      <grid-item
        v-for="(item,index) in items"
        :key="item.i"
        drag-allow-from="div.v-card__title, div.v-overlay"
        drag-ignore-from="a,button"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-w="3"
        :min-h="3"
        style="background:#ffffff;border-radius:5px;"
        _container-resized="resize"
      >
        <v-hover v-slot="{ hover }">
          <dash-card
            :title="$T(item.label)"
            :offline="false"
            :base="getBase(item.base)"
            :disabled="false"
            :disable-alarm-bell="item.disableAlarmBell || false"
            style="display:inline-block;"
            :hover="false"
            :timestamp="undefined"
            :edit-mode="editMode"
            :dark="item.theme === 'dark'"
            :light="item.theme === 'light'"
            :color="item.color"
          >
            <template #titleIcon>
              <v-icon v-if="item.icon">
                {{ item.icon }}
              </v-icon>
            </template>
            <div :style="{height: item.label.length > 0 ? 'calc(100% - 36px)' : '100%'}" style="width:100%;overflow:none;">
              <atvise-visu-v3
                v-if="item.widget"
                ref="visu"
                :base="getBase(item.base)"
                :args="item.query"
                :query="item.query"
                :settings="JSON.stringify({widget: item.widget})"
                :scale-to-max="true"
                @title="item.title = $event"
                @card="$emit('card', $event)"
              />
              <component
                :is="item.html"
                v-else-if="item.html"
                :base="item.base"
              />
              <v-overlay :value="editMode && hover" absolute>
                <v-container>
                  <v-row>
                    <v-col v-for="(btn,i) in buttons" :key="i" cols="4">
                      <v-tooltip top :color="btn.color">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            :color="btn.color"
                            icon
                            outlined
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon @click="btn.fn(item, index)">
                              {{ btn.icon }}
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>
                          {{ btn.tooltip }}
                        </span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-container>
              </v-overlay>
            </div>
          </dash-card>
        </v-hover>
      </grid-item>
    </grid-layout>
    <v-btn
      v-if="editMode"
      fab
      bottom
      right
      fixed
      color="primary"
      @click="addCard"
    >
      <v-icon>
        mdi-plus
      </v-icon>
    </v-btn>
    <dashboard-edit-dialog v-model="editDialog" :base="base" :object="editObject" />
  </div>
</template>

<script>
import dashCard from '~/components/common/dashCard.vue'

export default {
  components: {
    dashCard
  },
  props: {
    items: {
      type: Array,
      default: undefined
    },
    editMode: {
      type: Boolean,
      default: false
    },
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    }
    // display: {
    //   type: String,
    //   default: ''
    // }
  },
  data: () => ({
    addDialog: false,
    editDialog: false,
    // items: [],
    hidden: false,
    selected: -1,
    dashboard: {},
    layout: 0,
    dashId: undefined,
    rowHeight: 110,
    // editMode: false,
    editObject: undefined
  }),
  computed: {
    buttons () {
      return [
        {
          icon: 'mdi-pencil',
          tooltip: 'Edit',
          fn: this.editItem
        },
        {
          icon: 'mdi-content-duplicate',
          tooltip: 'Duplicate',
          fn: this.duplicate
        },
        {
          icon: 'mdi-trash-can',
          tooltip: 'Delete',
          fn: this.removeItem,
          color: 'error'
        }
      ]
    },
    widgets: {
      get () {
        if (this.dashboard) {
          return this.dashboard.widgets
        } else {
          return []
        }
      },
      // setter
      set (newValue) {
        if (this.dashboard) {
          this.dashboard.widgets = newValue
        }
      }
    }
  },
  mounted () {
    // this.loadDashboard()
  },
  methods: {
    getBase (base) {
      const relative = base.indexOf('.') === 0
      // if ((relative && this.base.length === 0) || base.length === 0) {
      if (relative && this.base.length === 0) {
        const routeBase = this.$lodash.get(this.$route, 'query.base', 'AGENT.OBJECTS')
        return routeBase + base
      } else if (relative && this.base.length > 0 && base.length > 1) {
        return this.base + base
      } else if (base.length === 1) {
        return this.base
      } else {
        return base
      }
    },
    duplicate (item, index) {
      const newItem = JSON.parse(JSON.stringify(item)) // Object.assign({}, item)
      newItem.i = new Date().getTime()
      // eslint-disable-next-line vue/no-mutating-props
      this.items.push(newItem)
    },
    editItem (item, index) {
      this.editObject = {
        // parameters: this.$refs.visu[index].parametersObj,
        index,
        item
      }
      this.editDialog = true
      // console.log('Edit: ', index)
      // console.log(this.$refs.visu[index].parametersObj)
    },
    removeItem (item) {
      const index = this.items.map(item => item.i).indexOf(item.i)
      // eslint-disable-next-line vue/no-mutating-props
      this.items.splice(index, 1)
    },
    // loadDashboard () {
    //   top.webMI.data.read('AGENT.OBJECTS.dash1', (data) => {
    //     // eslint-disable-next-line vue/no-mutating-props
    //     this.items = JSON.parse(data.value)
    //   })
    // },
    // saveDashboard () {
    //   this.editMode = false
    //   top.webMI.data.write('AGENT.OBJECTS.dash1', JSON.stringify(this.items))
    // },
    addCard () {
      // eslint-disable-next-line vue/no-mutating-props
      this.items.push({
        x: 0,
        y: 0,
        w: 3,
        h: 3,
        icon: 'mdi-widgets',
        label: 'New Widget',
        theme: 'auto',
        color: undefined,
        base: '--', // data.base,
        widget: '', // data.item.nodeid,
        query: {},
        i: new Date().getTime()
      })
    },
    layoutUpdatedEvent () {
      // console.log(this.$refs.grid.layouts);
      // this.$refs.grid.layoutUpdate()
    },
    updateLayouts () {
      // console.log(this.$refs.grid)
      // console.log(this.dashboard.layouts)
      if (this.showGrid) {
        this.$refs.grid.layouts = this.dashboard.layouts
        this.$refs.grid.layoutUpdate()
        this.$refs.grid.onWindowResize()
      }
    },
    // hover (index) {
    //   if (this.dashboard) {
    //     return !!this.dashboard.widgets[index].to // Aktiverer hover hvis kortet har en link
    //   } else {
    //     return false
    //   }
    //   return
    // },
    setSize (val) {
      this.testSize = val
    },
    resize () {
      // console.log('resize')
    }
  }
}
</script>

<style>
.vue-grid-item.no-touch {
  touch-action: auto !important;
}

.emptyCard {
  height: 100%;
  width: 100%;
  background: white;
}

/* .theme--dark.v-card {
    background-color: #424242;
    color: #FFFFFF;
} */
</style>
