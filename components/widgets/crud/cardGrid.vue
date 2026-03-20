<template>
  <div style="width:100%;height:100%;overflow-y:scroll" xmlns="http://www.w3.org/1999/xhtml">
    <v-container v-if="!responsive" :fluid="true">
      <v-row class="flex-wrap">
        <v-col
          v-for="(item, index) in sortedWidgets"
          :key="index"
          xs="12"
          sm="12"
          md="6"
          lg="4"
          xl="3"
          class="pa-1"
          _style="`min-width:${width}px;`"
        >
          <dash-card-2
            :title="getTitle(item)"
            :show-menu="showMenu"
            :base="isDisplay(item) ? address : item.nodeid"
            :hover="true"
            style="width:100%;height:100%;"
            :menu-items="menuItems"
            :default-display="$lodash.get(item, 'childs.default') || $lodash.get(item, 'childs._default') "
            @edit="$emit('edit', item)"
            @delete="$emit('delete', item)"
            @click="click(item)"
          >
            <template #topicons="">
              <slot name="topicons" :item="item" />
            </template>
            <template #icons="">
              <slot name="icons" :item="item" />
            </template>

            <!-- <div style="width:100%;height:calc(100% - 36px);overflow:auto;"> -->
            <div style="width:100%;">
              <atvise-visu-v3 :base="isDisplay(item) ? address : item.nodeid" :query="{base: isDisplay(item) ? address : item.nodeid, title: item.displayname, item: item}" :settings="getDisplay(item)" />
            </div>
          </dash-card-2>
        </v-col>
      </v-row>
    </v-container>
    <grid-layout
      v-if="responsive"
      ref="grid"
      style="height:1080px;"
      :layout.sync="layout"
      :col-num="48"
      :row-height="12"
      :is-draggable="editable"
      :is-resizable="editable"
      :vertical-compact="false"
      :use-css-transforms="true"
      :responsive="false"
      :margin="[[4],[4]]"
      :prevent-collision="false"
      :max-rows="60"
    >
      <grid-item
        v-for="(item , index) in items"
        :key="index"
        :static="layout[index].static"
        :x="layout[index].x"
        :y="layout[index].y"
        :w="layout[index].w"
        :h="layout[index].h"
        :i="layout[index].i"
      >
        <dash-card-2
          :title="$T(item.displayname)"
          :show-menu="showMenu"
          :base="item.nodeid"
          :hover="false"
          style="width:100%;height:100%"
          :menu-items="menuItems"
          @edit="$emit('edit', item)"
          @delete="$emit('delete', item)"
          @click="editable ? ()=>{} : $emit('click', item)"
        >
          <div>
            <atvise-visu-v3 :base="item.nodeid" :query="{base: item.nodeid, asList: true}" :args="{base: item.nodeid, asList: true}" :settings="getDisplay(item)" />
          </div>
        </dash-card-2>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
export default {
  props: {
    address: {
      type: String,
      default: ''
    },
    display: {
      type: String,
      default: 'widget'
    },
    items: {
      type: Array,
      default: () => { return [] }
    },
    canDelete: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    canAdd: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: '400'
    },
    responsive: {
      type: Boolean,
      default: false
    },
    descriptionInTitle: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fab: false,
      showConfig: false,
      showMenu: true,
      menuItems: [],
      layout: [
        { x: 0, y: 0, w: 2, h: 3, i: '0', static: false },
        { x: 2, y: 0, w: 2, h: 3, i: '1', static: false },
        { x: 4, y: 0, w: 2, h: 3, i: '2', static: false },
        { x: 6, y: 0, w: 2, h: 3, i: '3', static: false },
        { x: 8, y: 0, w: 2, h: 2, i: '4', static: false },
        { x: 10, y: 0, w: 2, h: 4, i: '5', static: false },
        { x: 0, y: 1, w: 2, h: 5, i: '6', static: false },
        { x: 2, y: 1, w: 2, h: 3, i: '7', static: false },
        { x: 4, y: 1, w: 2, h: 3, i: '8', static: false },
        { x: 6, y: 1, w: 2, h: 3, i: '9', static: false },
        { x: 8, y: 1, w: 2, h: 5, i: '10', static: false },
        { x: 10, y: 1, w: 2, h: 5, i: '11', static: false },
        { x: 0, y: 2, w: 2, h: 5, i: '12', static: false },
        { x: 2, y: 2, w: 2, h: 5, i: '13', static: false }
      ],
      editable: false
    }
  },
  computed: {
    sortedWidgets () {
      let _items = this.items
      _items = _items.sort((a, b) => a.index - b.index)

      return _items.filter((item) => {
        return item?.childs?.widget || item?.childs?._widget || item.typeDefinition === 'VariableTypes.ATVISE.Display'
      })
    }
  },
  watch: {
    computed: {
      menuItems () {
        const items = []
        if (this.canEdit) {
          items.push({ title: 'T{Edit}', emit: 'edit' })
        }
        if (this.canDelete) {
          items.push({ title: 'T{Delete}', emit: 'delete' })
        }
        return items
      }
    }
  },
  async mounted () {
    const _layout = await this.getLayout()
    // const _layout = localStorage.getItem('layout_fleet')
    if (_layout) {
      const _stored = JSON.parse(_layout)
      if (this.items.length > this.layout.length) {
        _stored.push({ x: 10, y: 1, w: 2, h: 5, i: this.items.length, static: false })
        this.layout = _stored
      } else {
        this.layout = _stored
      }
    }
    // this.items = this.query.items
    // this.showConfig = this.query.showConfig
    // this.canEdit = this.query.canEdit !== 'false'
    // this.canDelete = this.query.canDelete !== 'false'
    // this.canAdd = this.query.canAdd !== 'false'
    if (this.canEdit) {
      this.menuItems.push({ title: 'T{Edit}', emit: 'edit' })
    }
    if (this.canDelete) {
      this.menuItems.push({ title: 'T{Delete}', emit: 'delete' })
    }
    // this.showMenu = (this.canEdit || this.canDelete) && this.menuItems
  },
  methods: {
    isDisplay (item) {
      return item.typeDefinition === 'VariableTypes.ATVISE.Display'
    },
    click (item) {
      this.$emit('click', item)
      this.$nuxt.$emit('card:click', item)
    },
    getLayout () {
      return new Promise((resolve, reject) => {
        top.webMI.data.read(this.$route.query.base + '.layout', function (e) {
          resolve(e.value)
        })
      })
    },
    setLayout () {
      top.webMI.data.write([this.$route.query.base + '.layout'], [JSON.stringify(this.layout)], function (e) {

      })
    },
    getDisplay (item) {
      if (item.typeDefinition === 'VariableTypes.ATVISE.Display') {
        return item.nodeid
      } else if (item.childs[this.display]) {
        // return item.typeDefinition + '.' + this.display
        return item.childs[this.display].nodeid
      } else if (item.childs['_' + this.display]) {
        return item.childs['_' + this.display].nodeid
      }
    },
    toggleEditable () {
      this.editable = !this.editable
    },
    saveLayout () {
      const _layout = JSON.stringify(this.layout)
      localStorage.setItem('layout_fleet', _layout)
    },
    getTitle (item) {
      if (this.descriptionInTitle) {
        return this.$T(item.displayname) + ' - ' + this.$T(item.description)
      } else {
        return this.$T(item.displayname)
      }
    }
  }
}
</script>

<style>
.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}
</style>
