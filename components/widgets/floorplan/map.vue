<template>
  <v-container :fluid="true" :style="{height: height, padding: large && showMap ? null : '0px'}" :fill-height="true">
    <component :is="map" :items="mapItems" :show-map-edit="showMapEdit" :visu="mapVisu" @click="click" />
  </v-container>
</template>

<script>
import Rights from '@/global/atviseRightsMixin'

export default {
  mixins: [
    Rights
  ],
  props: {
    base: {
      type: String,
      default: ''
    },
    showMap: {
      type: Boolean,
      default: true
    },
    showMapEdit: {
      type: Boolean,
      default: false
    },
    map: {
      type: String,
      default: 'floorplan-general'
    },
    mapVisu: {
      type: String,
      default: undefined
    }
  },
  data: () => {
    return {
      addDialog: false,
      items: [],
      selected: [],
      currentItems: [],
      tableProps: {
        hideDefaultFooter: true,
        itemsPerPage: -1
      }
    }
  },
  computed: {
    mapItems () {
      return this.currentItems.map((item) => {
        return item
      })
    },
    height () {
      return this.showMap ? 'calc(100vh - 64px)' : undefined
    },
    large () {
      return this.$vuetify.breakpoint.mdAndUp
    },
    hasOnline () {
      return this.$lodash.has(this.items, '[0].childs.datasourceOnline') || this.$lodash.has(this.items, '[0].childs.connected')
    }
  },
  watch: {
    'rights.write' (value) {
      // eslint-disable-next-line vue/no-mutating-props
      this.tableProps.showSelect = value && this.canEdit
      this.tableProps.singleSelect = true
    }
  },
  beforeMount () {
    setTimeout(() => {
      self.height = this.$refs.row.clientHeight + 'px'
      console.log('This height: ' + self.height)
    }, 500)
  },
  mounted () {
    if (this.base.length > 0) {
      this.init()
    }
  },
  methods: {
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
    toArray (data) {
      return Object.keys(data).map((i) => {
        // this.toArray(data[i].childs)
        return data[i]
      })
    },
    click (item) {
      if (item.childs.default) {
        this.$router.push({ query: { base: item.nodeid, display: item.childs.default.nodeid } })
      } else if (item.childs._default) {
        this.$router.push({ query: { base: item.nodeid, display: item.childs._default.nodeid } })
      }
    }
  }
}
</script>
