<template>
  <v-speed-dial
    v-model="fab"
    absolute
    bottom
    right
    direction="top"
    transition="scale-transition"
  >
    <template #activator>
      <v-btn
        v-model="fab"
        color="blue darken-2"
        dark
        fab
      >
        <v-icon v-if="fab">
          mdi-close
        </v-icon>
        <v-icon v-else>
          mdi-cog
        </v-icon>
      </v-btn>
    </template>
    <v-tooltip
      v-for="(item,key) in items"
      :key="key"
      dense
      left
      :color="item.color || 'primary'"
      :value="showTooltip"
    >
      <template #activator="{ attrs }">
        <v-btn
          :color="item.color || 'primary'"
          dark
          fab
          small
          v-bind="attrs"
          @click="$emit(item.event, item.type)"
        >
          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </template>
      <span>{{ item.tooltip || item.displayName }}</span>
    </v-tooltip>
  </v-speed-dial>
</template>

<script>
export default {
  props: {
    objectTypes: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      fab: false,
      // items: [],
      showTooltip: false
    }
  },
  computed: {
    items () {
      return this.objectTypes.map((item) => {
        return {
          icon: 'mdi-plus',
          tooltip: 'Add ' + item.text,
          event: 'add',
          type: item.objectType
        }
      })
    }
  },
  watch: {
    fab (val) {
      if (val === true) {
        setTimeout(() => {
          this.showTooltip = true
        }, 500)
      } else {
        this.showTooltip = false
      }
    }
  }
}
</script>

<style>

</style>
