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
        color="blue-darken-2"
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
      density="compact"
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
          @click="$emit(item.event, selected, item.type)"
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
    selected: {
      type: Array,
      default: () => { return [] }
    },
    objectType: {
      type: String,
      default: 'ObjectTypes.PROJECT.jmhGeneral.measurement'
    },
    objectTypes: {
      type: Array,
      default: () => { return [] }
    },
    canAdd: {
      type: Boolean,
      default: true
    },
    canDelete: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: false
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
      const items = []
      if (this.canDelete && this.selected.length > 0) {
        items.push({
          icon: 'mdi-delete',
          tooltip: 'Delete',
          color: 'error',
          event: 'del'
        })
      }
      if (this.canEdit && this.selected.length > 0) {
        items.push({
          icon: 'mdi-pencil',
          tooltip: 'Modify',
          // color: 'warning',
          event: 'edit'
        })
      }
      if (this.canAdd) {
        if (this.objectTypes.length > 0) {
          this.objectTypes.forEach((item) => {
            items.push({
              icon: 'mdi-plus',
              tooltip: this.$T('Add ' + item.text),
              // color: 'success',
              event: 'add',
              type: item.objectType
            })
          })
        } else {
          items.push({
            icon: 'mdi-plus',
            tooltip: this.$T('Add'),
            // color: 'success',
            event: 'add',
            type: this.objectType
          })
        }
      }
      return items
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
  },
  mounted () {
  },
  methods: {
    getObjectypes () {
      return new Promise((resolve) => {
        // top.webMI.data.call('BrowseNodes', {
        //   startAddress: this.objectType,
        //   endLevel: 0
        //   // vTypes: [this.objectType]
        // }, (e) => {
        //   console.log(e)
        //   resolve(e)
        // })
        top.webMI.data.call('GetVariableTypes', {
          startAddress: this.objectType
        }, (e) => {
          console.log(e)
          resolve(e)
        })
      })
    }
  }
}
</script>

<style>

</style>
