<template>
  <div style="width:100%;height:100%;" class="ma-auto">
    <!-- <component
      :is="dashboard.widgets[0].type"
      v-if="dashboard.widgets && !showGrid"
      :base="dashboard.widgets[0].base"
      :settings="dashboard.widgets[0].settings"
      _event-bus="eventBus"
      _timestamp="$set(timestamps,index,$event)"
    /> -->
    <grid-layout
      v-if="dashboard.widgets && showGrid"
      v-show="showGrid"
      ref="grid"
      :layout.sync="dashboard.widgets"
      :col-num="12"
      :row-height="110"
      :breakpoints="{ lg: 1000, xs: 0 }"
      :cols="{ lg: 12, xs: 6 }"
      :is-draggable="true"
      :is-resizable="$store.state.editMode"
      :vertical-compact="true"
      :margin="[10, 10]"
      :responsive="true"
      :auto-size="false"
      @layout-updated="layoutUpdatedEvent"
      @layout-ready="updateLayouts"
    >
      <grid-item
        v-for="(item , index) in dashboard.widgets"
        :key="index"
        drag-allow-from="div.v-card__title"
        drag-ignore-from="a,button"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        style="background:rgba(0,0,0,0);"
        _container-resized="resize"
      >
        <dash-card
          :title="getTitle(item)"
          :offline="false"
          _base="item.base"
          :base="getBase(item)"
          :disabled="false"
          style="display:inline-block;"
          :selected="selected == index"
          :hover="hover(index)"
          :timestamp="undefined"
          _click="select(index)"
          _show_chart="eventBus.$emit('show_chart',{index:index})"
        >
          <div style="width:100%;height:calc(100% - 36px);overflow:auto;">
            <atvise-visu-v3
              :base="item.base"
              :args="item.params"
              :query="item.params"
              :settings="JSON.stringify({widget: item.settings})"
              @title="item.title = $event"
              @card="$emit('card', $event)"
            />
          </div>
          <!-- <div v-if="item.settings[0] === '['" style="width:100%;height:calc(100% - 78px)">
            <v-layout row fill-height style="margin:0;">
              <v-flex v-for="(setting, index2) in JSON.parse(item.settings)" :key="index2" :class="'xs' + (12/JSON.parse(item.settings).length)" style="height:100%;width:100%;margin:0">
                <component
                  :is="item.type"
                  v-if="item.type"
                  :base="item.base"
                  :settings="JSON.stringify(setting)"
                  :event-bus="eventBus"
                  style="height:100%;width:100%;"
                  @timestamp="$set(timestamps,index,$event)"
                />
              </v-flex>
            </v-layout>
          </div>
          <div v-else style="width:100%;height:calc(100% - 78px)">
            <component
              :is="item.type"
              v-if="item.type"
              :base="item.base"
              :settings="item.settings"
              :event-bus="eventBus"
              @timestamp="$set(timestamps,index,$event)"
            />
            <div v-if="!item.type">
              Vennligst velg en widget
            </div>
          </div>
          <v-list-item
            v-for="(item2, i) in menuItems"
            slot="menu-items-append"
            :key="i"
            @click="item2.click(index)"
          >
            <v-list-item-action>
              <v-icon v-if="item2.icon">
                {{ item2.icon }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ item2.title }}</v-list-item-title>
          </v-list-item> -->
        </dash-card>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import dashCard from './common/dashCard.vue'
import { APIdashboard } from '@/global/APIService.js'

export default {
  components: {
    dashCard
  },
  props: {
    dash: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    hidden: false,
    selected: -1,
    dashboard: {},
    // buttons: [],
    layout: 0,
    apiDashboard: undefined,
    dashId: undefined,
    rowHeight: 110
  }),
  computed: {
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
  watch: {
    'dashboard.widgets' (val) {
      if (val.length > 1) {
        this.showGrid = true
      } else {
        this.showGrid = true
      }
    },
    '$route' () {
      this.loadDash()
    }
  },
  mounted () {
    this.apiDashboard = new APIdashboard(this)
    this.loadDash()
    // this.$root.$on('update-width', (data) => {
    //   console.log(data[0])
    // })
  },
  methods: {
    getBase (item) {
      const obj = this.$lodash.find(item.params, { name: 'base' })
      return obj ? obj.value : ''
    },
    getTitle (item) {
      const obj = this.$lodash.find(item.params, { name: 'title' }) || this.$lodash.find(item.params, { name: 'Title' })
      return obj ? this.$store.getters['translation/translateText'](obj.value) : item.i
    },
    setTitle (value, item) {
      // console.log('set title', value)
      // item = value
    },
    async loadDash () {
      try {
        this.dashboard = {}
        // console.log('Loading dash..............', this.dash)
        const data = await this.apiDashboard.getDashboard(this.dash)
        // console.log('dashboard:', data)
        const doc = this.parseHTML(data)
        const mainSVG = doc.querySelector('SVG')
        const arr = []
        mainSVG.querySelectorAll('SVG').forEach((svg) => {
          let scaleX = 1
          let scaleY = 1
          if (svg.getAttribute('transform')) {
            const transform = svg.getAttribute('transform').split('(')[1].split(')')[0].split(',') // matrix(1,0,0,1,0,0) => [1,0,0,1,0,0]
            scaleX = transform[0]
            scaleY = transform[3]
          }
          const data = {
            settings: svg.getAttribute('xlink:href'),
            i: svg.getAttribute('id'),
            title: '',
            // refpx: parseInt(svg.getAttribute('atv:refpx')),
            // refpy: parseInt(svg.getAttribute('atv:refpy')),
            h: Math.round((parseInt(svg.getAttribute('height')) * scaleY) / 100),
            w: Math.round((parseInt(svg.getAttribute('width')) * scaleX) / 150),
            x: Math.round((parseInt(svg.getAttribute('x')) * scaleX) / 150),
            y: Math.round((parseInt(svg.getAttribute('y')) * scaleY) / 100),
            params: this.getParams(svg)
          }
          arr.push(data)
        })
        this.widgets = arr // this.$lodash.sortBy(arr, ['y', 'x'])
        this.dashboard = {
          widgets: this.widgets,
          layouts: {
            lg: this.widgets,
            xs: this.widgets.map((widget, index) => {
              return {
                x: 0,
                y: (index + 1) * 2,
                h: widget.h,
                w: 6,
                i: widget.i,
                settings: widget.settings,
                params: widget.params
              }
            })
          }
        }

        if (this.dashboard.layouts) {
          this.$nextTick(function () {
            this.updateLayouts()
          })
        }
      } catch (error) {
        console.error(error)
        return []
      }
    },
    parseHTML (doc) {
      const parser = new DOMParser()
      return parser.parseFromString(doc, 'text/html')
    },
    getParams (svg, _type = 'atv:argument') {
      const type = _type
      const parameters = []
      const el = svg.getElementsByTagName(type)
      for (let e = 0; e < el.length; e++) {
        const params = {}
        for (let i = 0; i < el[e].attributes.length; i++) {
          const name = el[e].attributes[i].name
          let value = el[e].attributes[i].value

          if (value === undefined) {
            // console.log('name:', name)
            // console.log('value:', el[e].attributes[i].value)
            // console.log(this.argumentsObj)
            value = this.argumentsObj[el[e].attributes[i].value].value
          }
          params[name] = value
        }
        parameters.push(params)
      }
      return parameters
    },
    saveDash () {
      // legg til layouts i dashboard før lagring
      // eslint-disable-next-line no-console
      // console.log('Saving dash')
      this.dashboard.layouts = this.$refs.grid.layouts
      const dash = JSON.stringify(this.dashboard)
      this.apiDashboard.updateDashboard(dash)
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
    updateWidth (data) {
      console.log(data)
    },
    select (index) {
      if (this.editMode) {
        this.selected = index
      } else {
        this.$router.push({
          path: this.dashboard.widgets[index].to
        })
      }
    },
    hover (index) {
      if (this.dashboard) {
        return !!this.dashboard.widgets[index].to // Aktiverer hover hvis kortet har en link
      } else {
        return false
      }
      // return
    },
    setSize (val) {
      this.testSize = val
    },
    resize () {
      console.log('resize')
    }
  }
}
</script>

<style>
.vue-grid-item.no-touch {
  touch-action: auto !important;
}

.editMode{
  border-style: solid;
  border-color: red;
}
</style>
