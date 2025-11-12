<template>
  <div>
    <l-polyline
      ref="line"
      :lat-lngs="latlngs"
      :weight="weight"
      :color="color"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
      _mousedown="mousedown"
    >
      <l-popup ref="popup">
        <v-card light width="300">
          <v-card-title>
            {{ line.displayname }}
          </v-card-title>
          <v-card-text>
            {{ line.description }}
          </v-card-text>
        </v-card>
        <!-- {{ line.displayname }} <v-btn color="success">text</v-btn> -->
      </l-popup>
    </l-polyline>
    <template v-if="zoom > 10 && isSelected">
      <l-circle
        v-for="(i,key) in latlngs"
        :key="key"
        :lat-lng="i"
        :radius="5"
        :color="color"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    line: {
      type: Object,
      default: undefined
    },
    selected: {
      type: Object,
      default: undefined
    },
    zoom: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      weight: 3
    }
  },
  computed: {
    isSelected () {
      const nodeid = this.$lodash.get(this.line, 'nodeid')
      const selected = this.$lodash.get(this.selected, 'nodeid')
      return nodeid === selected
    },
    color () {
      return this.isSelected ? '#00ecf0' : '#022582'
    },
    latlngs () {
      return JSON.parse(this.line.childs.lineCoordinates.value)
    }
  },
  mounted () {
    this.$nuxt.$on('map:zoomSelected', () => {
      if (this.isSelected) {
        console.log('map:zoomSelected')
        const map = this.$parent.$parent.$refs.map.mapObject
        map.fitBounds(this.$refs.line.mapObject.getBounds())
      }
    })
  },
  methods: {
    mouseover (data) {
      this.weight = 8
    },
    mouseleave () {
      this.weight = 3
    },
    mousedown (evt) {
      this.$emit('click', this.line)
      // const map = this.$parent.$parent.$refs.map.mapObject
      // map.fitBounds(evt.target.getBounds())
    }
  }
}
</script>

<style>

</style>
