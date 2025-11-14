<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div :style="$vuetify.breakpoint.smAndDown ? '' : 'margin:0px'">
    <!-- <crud-widget-v2
      can-add
      can-edit
      _can-delete
      :selected="selected"
      edit-form="location-edit-form"
      object-type="ObjectTypes.PROJECT.jmhGeneral.area.location.fishFarming"
      @update="init"
    /> -->
    <v-data-table
      ref="dTable"
      :value="value"
      _loading="loading"
      v-bind="tableProps"
      style="height:calc(100% - 0px)"
      :search="search"
      :headers="computedHeaders"
      mobile-breakpoint="0"
      :items="filteredItems"
      item-key="nodeid"
      _height="90%"
      _hide-default-header
      :hide-default-footer="hideFooter"
      @click:row="$emit('click:row', $event)"
      @current-items="$emit('current-items', $event)"
      @input="$emit('input', $event)"
    >
      <template v-if="hasFilters" #[`body.prepend`]="{ headers }">
        <tr>
          <td v-for="(header, index) in headers" :key="index">
            <!-- <v-text-field dense hide-details :label="header.text" outlined @keydown.stop="" /> -->
            <v-combobox
              v-if="header.customFilter"
              v-model="filters[header.value]"
              :items="getFilterItems(header.value, header.customFilter)"
              :multiple="$lodash.get(header, 'customFilter.multiple', false)"
              small-chips
              deletable-chips
              dense
              hide-details
              single-line
              label="Filter"
              outlined
              :style="{width: header.width + 'px' || undefined }"
              @keydown.stop=""
            />
          </td>
        </tr>
      </template>
      <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
      <template v-if="showSearch" #top="">
        <v-text-field
          v-model="search"
          :outlined="false"
          :label="$T('Search')"
          hide-details
          :clearable="true"
          class="mx-4"
          @keydown.stop=""
        />
      </template>
      <!-- <template v-for="(header,key) in headers" #[`item.${header.value}`]="{ item }">
        <component
          :is="getComponent(header, item)"
          v-if="header.custom"
          v-bind="getProps(header, item)"
          :key="key"
          :item="$lodash.get(item, header.custom.item) || item"
          :value="$lodash.get(item, header.value)"
          _v-bind="header.custom.props"
        />
        <div v-else-if="typeof $lodash.get(item, header.value) === 'string'" :key="key">
          {{ header.prefix }} {{ $T($lodash.get(item, header.value)) }} {{ header.suffix }}
        </div>
        <div v-else :key="key">
          {{ header.prefix }} {{ $lodash.get(item, header.value) }} {{ header.suffix }}
        </div>
      </template> -->
      <template #item="{ headers, item, isExpanded, expand, isSelected, select }">
        <tr
          @click="$emit('click:row', item)"
          @mouseenter="$nuxt.$emit('table:mouseenter', item)"
          @mouseleave="$nuxt.$emit('table:mouseleave', item)"
        >
          <td v-for="(header, key) in headers" :key="key">
            <div v-if="header.value === 'data-table-select'">
              <v-simple-checkbox :value="isSelected" @click.stop="select(!isSelected)" />
              <!-- <v-btn icon @click.stop="expand(!isExpanded)">
                <v-icon class="toggleUpDown" :class="{ rotate: isExpanded }">
                  mdi-chevron-down
                </v-icon>
              </v-btn> -->
            </div>
            <div v-if="header.value === 'data-table-expand'">
              <v-btn icon @click.stop="expand(!isExpanded)">
                <v-icon class="toggleUpDown" :class="{ rotate: isExpanded }">
                  mdi-chevron-right
                </v-icon>
              </v-btn>
            </div>
            <component
              :is="getComponent(header, $lodash.get(item, header.custom.item) || item)"
              v-if="header.custom"
              :key="key"
              _v-bind="getProps(header, item)"
              v-bind="getProps(header, $lodash.get(item, header.custom.item) || item)"
              _is="getComponent(header, $lodash.get(item, header.custom.item))"
              :item="$lodash.get(item, header.custom.item) || item"
              :value="$lodash.get(item, header.value)"
            />
            <div v-else-if="typeof $lodash.get(item, header.value) === 'string'">
              {{ header.prefix }} {{ $T($lodash.get(item, header.value)) }} {{ header.suffix }}
            </div>
            <div v-else>
              {{ header.prefix }} {{ $lodash.get(item, header.value) }} {{ header.suffix }}
            </div>
          </td>
        </tr>
      </template>
      <!-- <template ref="headergroup" #[`group.header`]="{headers, group,toggle}" class="groupHeader">
        <td :colspan="headers.length" style="background:#505050">
          <v-btn icon @click="toggle">
            <v-icon>mdi-minus</v-icon>
          </v-btn>

          {{ group }}

          <v-btn icon @click="remove">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </td>
      </template> -->
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'JmhDataTable',
  inject: ['theme'],
  props: {
    value: {
      type: Array,
      default: () => { return [] }
    },
    items: {
      type: Array,
      default: () => { return [] }
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array,
      default () {
        return [
          { text: 'Id', value: 'browsename' },
          { text: this.$T('Name'), value: 'displayname' },
          { text: 'Description', value: 'description' }
        ]
      }
    },
    mobileHeaders: {
      type: Array,
      default: () => {
        return [
          { text: 'Id', value: 'browsename' },
          { text: 'Name', value: 'displayname' },
          { text: 'Description', value: 'description' }
        ]
      }
    },
    tableProps: {
      type: Object,
      default: () => {
        return {
          itemsPerPage: -1,
          singleExpand: false,
          itemKey: 'nodeid'
        }
      }
    },
    hideFooter: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      filters: {},
      selected: [],
      search: '',
      loading: true,
      expanded: [],
      hasFilters: false
    }
  },
  computed: {
    computedHeaders () {
      return this.$vuetify.breakpoint.smAndDown ? this.mobileHeaders : this.headers
    },
    filteredItems () {
      return this.items.filter((item) => {
        return Object.keys(this.filters).every((i) => {
          const filter = this.$lodash.get(this.filters, i, '')
          if (filter?.length === 0 || filter === null) {
            return true
          } else {
            if (typeof filter === 'boolean') {
              return filter.toString() === this.$lodash.get(item, i).toString()
            }
            return filter.toString() === this.$lodash.get(item, i)
          }
        })
      })
    }
  },
  watch: {
    items: {
      immediate: true,
      handler (items) {
        this.loading = false
        if (this.tableProps.expandAll) {
          this.items.forEach((item) => {
            this.$set(this.$refs.dTable.expansion, item.nodeid, true)
          })
        }
      }
    },
    headers: {
      immediate: true,
      handler (value) {
        value.forEach((item) => {
          if (item.customFilter) {
            this.hasFilters = true
            const value = item.customFilter.value || ''
            // console.log('register filter:', item.value)
            this.$set(this.filters, item.value, value)
          }
        })
      }
    }
  },
  methods: {
    getFilterItems (key, filter) {
      const isBool = filter.isBoolean || false
      const temp = this.filteredItems.map((item) => { return this.$lodash.get(item, key, undefined) })
      if (isBool) {
        return this.$lodash(temp).uniq().sort().value()
      } else {
        // compact will remove false and empty values
        return this.$lodash(temp).uniq().sort().compact().value()
      }
    },
    getComponent (header, item) {
      // const isMeasurement = item.typeDefinition.includes('VariableTypes.PROJECT.measurement')
      // const component = this.$lodash.get(header, 'custom.component') || this.$lodash.get(item, 'childs.ux.childs.component.value')
      const component = this.$lodash.get(item, 'childs.ux.childs.component.value')
      // console.log('header:', header)
      // console.log('item:', item)
      // console.log('component:', component)
      // console.log(header.custom.component)
      // const component = this.$lodash.get(item, 'childs.ux.childs.component')
      if (component && header.custom.component === 'value-unit') {
        return `data-table-measurements-${component}`
      } else if (component && header.custom.component && header.custom.item) {
        return `data-table-measurements-${component}`
      } else {
        return `data-table-widget-${header.custom.component}`
      }
    },
    getProps (header, item) {
      const properties = this.$lodash.get(item, 'childs.ux.childs.properties')
      if (properties && header.custom.component === 'value-unit') {
        try {
          return JSON.parse(properties.value)
        } catch (error) {
          return {}
        }
      } else {
        return header.custom.props
      }
    }
  }
}
</script>

<style>
.theme--dark.v-data-table {
  background: #272727
}
.toggleUpDown {
    transition: transform .3s ease-in-out !important;
}
.toggleUpDown.rotate {
    transform: rotate(90deg);
}
</style>
