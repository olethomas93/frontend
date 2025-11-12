<template>
  <map-custom-marker
    v-if="$lodash.get(item, 'childs.mapMarker') && $lodash.get(item, 'childs.position')"
    :coord="item.childs.position.nodeid"
    :offset-x="0"
    :offset-y="0"
    :animated="false"
    alignment="center"
    :draggable="false"
    style="outline-color:#00ecf0;border-radius:5px;width:50px;"
    :style="{outlineStyle: getOutline()}"
    @click="$emit('click')"
  >
    <atvise-visu-v3 style="height:50px;width:50px" :query="{ label: item.displayname}" :settings="item.childs.mapMarker.nodeid" :base="item.nodeid" @click="$emit('marker:click', item)" />
  </map-custom-marker>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: undefined
    },
    selected: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    isSelected () {
      const nodeid = this.$lodash.get(this.item, 'nodeid')
      const selected = this.$lodash.get(this.selected, 'nodeid')
      return nodeid === selected
    },
    color () {
      return this.isSelected ? '#00ecf0' : '#022582'
    }
  },
  methods: {
    getOutline () {
      return this.isSelected ? 'solid' : null
    }
  }
}
</script>

<style>

</style>
