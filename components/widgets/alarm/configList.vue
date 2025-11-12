<template>
  <!-- <div style="position:absolute;top:25px;width:100%;height:100%"> -->
  <div style="height:100%;width:100%">
    <resize-observer emit-on-mount @notify="handleResize" />
    <v-data-table
      v-model="selected"
      v-bind="attrs"
      :search="search"
      :headers="headers"
      :items-per-page="15"
      :height="height"
      expanded.sync="expanded"
      class="elevation-1"
      :items="filteredItems"
    >
      <template #top="">
        <v-row height="90">
          <v-col v-if="true" sm="4">
            <v-text-field
              v-model="search"
              :clearable="true"
              :label="$T('Search')"
              class="mx-4"
              :dense="true"
              mt-2
              @keydown.stop=""
            />
          </v-col>
        </v-row>
      </template>
      <template #[`body.prepend`]="{ headers }">
        <tr>
          <td v-for="(header, index) in headers.slice(1)" :key="index">
            <!-- <v-text-field dense hide-details :label="header.text" outlined @keydown.stop="" /> -->
            <v-combobox
              v-if="header.customFilter"
              v-model="filters[header.value]"
              :background-color="filters[header.value] ? '#ffc72c4a' : undefined"
              _clearable
              _multiple
              small-chips
              deletable-chips
              filled
              dense
              hide-details
              label="Filter"
              outlined
              :items="getFilterItems(header.value)"
              @keydown.stop=""
            />
          </td>
        </tr>
      </template>
      <template #[`item.condition`]="{ item }">
        <alarm-config-condition-limit
          v-if="item.type === 'ns=1;s=ObjectTypes.ATVISE.AlarmConditionControl.Limit'"
          :key="randomKey"
          :item="item"
          :base="item.condition.split('=')[2]"
        />
        <alarm-config-condition-discrete
          v-else
          :key="randomKey"
          :item="item"
          :base="item.condition.split('=')[2]"
        />
      </template>
      <template #[`footer.prepend`]>
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              :disabled="selected.length === 0"
              color="primary"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              {{ $T('Modify alarms') }}
            </v-btn>
          </template>
          <v-card v-if="dialog">
            <v-card-title>
              Edit alarms
            </v-card-title>
            <v-card-text>
              Selected conditions: {{ selected.length }}
              <v-container>
                <v-row>
                  <v-col cols="2">
                    <v-checkbox v-model="modOnDelay" hide-details />
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      v-model="onDelay"
                      hide-details
                      outlined
                      suffix="s"
                      min="0"
                      :label="$T('On delay')"
                      type="number"
                      :disabled="!modOnDelay"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2">
                    <v-checkbox v-model="modActive" />
                  </v-col>
                  <v-col cols="7">
                    <v-switch v-model="active" :label="active ? $T('Activated') : $T('Deactivated') " :disabled="!modActive" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2">
                    <v-checkbox v-model="modCategory" />
                  </v-col>
                  <v-col cols="7">
                    <v-select
                      ref="Priority"
                      v-model="category"
                      :items="categories"
                      item-text="childs.Abbreviation.value"
                      item-value="displayname"
                      :label="$T('Category')"
                      class="pa-2"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="save"
              >
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <alarm-export-excel style="margin-left:10px" />
        <alarm-export-excel-in-list :base="base" style="margin-left:10px" />
      </template>
      <!-- <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div v-for="(cond, index) in sortConditions(item.conditions)" :key="index">
            <alarm-config-condition-limit
              v-if="cond.type === 'ns=1;s=ObjectTypes.ATVISE.AlarmConditionControl.Limit'"
              :key="cond.conditionNode"
              :item="cond"
              :base="cond.condition.split('=')[2]"
            />
            <alarm-config-condition-discrete
              v-else
              :key="cond.conditionNode"
              :item="cond"
              :base="cond.condition.split('=')[2]"
            />
          </div>
        </td>
      </template> -->
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      randomKey: 123,
      modOnDelay: false,
      modActive: false,
      modCategory: false,
      onDelay: 0,
      active: false,
      category: '',
      categories: undefined,
      dialog: false,
      selected: [],
      attrs: {
        showGroupBy: true,
        showExpand: false,
        singleExpand: true,
        showSelect: true,
        itemKey: 'condition',
        itemsPerPage: -1,
        multiSort: true,
        fixedHeader: true,
        sortBy: ['site', 'building', 'system', 'component']
      },
      search: '',
      expanded: [],
      data: {},
      items: [],
      headers_old: [
        { text: 'base', value: 'base', groupable: false, align: ' d-none' },
        { text: this.$T('Site'), value: 'site', groupable: true, customFilter: { value: '' } },
        { text: this.$T('Building'), value: 'building', groupable: true, customFilter: { value: '' } },
        { text: this.$T('System'), value: 'system', customFilter: { value: '' } },
        // {text:'T{Sub system}', value:'subSystem'},
        { text: this.$T('Component'), value: 'component', customFilter: { value: '' } },
        // { text: this.$T('Variable'), value: 'variable' }
        { text: this.$T('Settings'), value: 'condition', groupable: false, width: 400 }
      ],
      height: 480 - 72,
      filters: {}
    }
  },
  computed: {
    headers () {
      let headers = [
        { text: 'base', value: 'base', groupable: false, align: ' d-none' }
      ]
      const extraHeaders = this.$lodash.get(top.webMIConfig, 'nuxt.alarmList.extraItems', [])
      extraHeaders.forEach((item) => {
        headers.push({
          text: this.$T(item.text),
          value: item.value,
          // groupable: item.groupable,
          // filterable: item.filterable,
          width: item.width || null,
          customFilter: { value: '' }
        })
      })
      headers = [
        ...headers,
        { text: this.$T('Settings'), value: 'condition', groupable: false, width: 400 }
      ]
      return headers
    },
    filteredItems () {
      return this.items.filter((item) => {
      // every is like forEach, but stops when false is returned
        return Object.keys(this.filters).every((i) => {
          const filter = this.$lodash.get(this.filters, i, '')
          if (filter?.length === 0 || filter === null) {
            return true
          } else {
          // res = filter?.toString().includes(this.$lodash.get(item, i))
            return filter?.toString() === this.$lodash.get(item, i)
          }
        })
      })
    }
  },
  watch: {
    headers: {
      immediate: true,
      handler (value) {
        value.forEach((item) => {
          if (item.customFilter) {
            this.hasFilters = true
            const value = item.customFilter.value || null
            // console.log('register filter:', item.value)
            this.$set(this.filters, item.value, value)
            // this.filters[item.value] = []
          }
        })
      }
    }
  },
  mounted () {
    this.categories = this.$store.state.alarming.categories
    let e
    if (this.base) {
      e = this.$store.getters['alarming/getConditions'](this.base)
    } else {
      const base = this.$route.query.base.split('.').slice(0, 4).join('.')
      e = this.$store.getters['alarming/getConditions'](base)
    }
    e.filter((cond) => {
      return cond.base.includes('AGENT.OBJECTS')
    }).forEach((cond) => {
      const test = cond.base.split('.').slice(0, -1).join('.')
      // if (!this.data[cond.base]) {
      if (!this.data[test]) {
        this.data[test] = {
          address: cond.base,
          location: cond._location,
          system: cond._system,
          subSystem: cond._subSystem || '',
          component: cond._component,
          variable: cond._variable,
          conditions: []
        }
      }
      this.data[test].conditions.push(cond)
    })

    // Convert object to array
    // const items = Object.keys(this.data).map((i) => {
    //   return this.data[i]
    // })

    // Sort and set items
    // this.items = items.sort((a, b) => {
    //   const A = a.system.toUpperCase() // ignore upper and lowercase
    //   const B = b.system.toUpperCase() // ignore upper and lowercase
    //   if (A < B) {
    //     return -1
    //   }
    //   if (A > B) {
    //     return 1
    //   }
    //   return 1
    // })
    this.items = Object.keys(e).map((i) => {
      return e[i]
    })
  },
  methods: {
    sortConditions (conds) {
      if (conds.length === 1) {
        return conds
      } else {
        return this.$lodash.sortBy(conds, ['browseName'])
      }
    },
    handleResize (size) {
      console.log(size)
      this.height = size.height - 100
    },
    save () {
      if (this.modOnDelay) {
        this.setValue('on_delay', this.onDelay * 1000)
      }
      if (this.modActive) {
        this.enableAlarm(this.active)
      }
      if (this.modCategory) {
        this.updateAlarmCategory(this.category)
      }
      // Generate random key to force update on the alarm components. (Will read alarm settings)
      this.randomKey = parseInt(Math.random() * 1000)
      this.selected = []
      this.dialog = false
      this.$store.dispatch('alarming/conditions')
    },
    enableAlarm (e) {
      const ids = this.selected.map((item) => {
        return item.condition.split('=')[2]
      })
      if (e === true) {
        top.webMI.data.call('AlarmEnable', { address: ids })
      } else {
        top.webMI.data.call('AlarmDisable', { address: ids })
      }
    },
    setValue (address, value) {
      this.selected.forEach((item) => {
        const condition = item.condition.split('=')[2]
        top.webMI.data.write(condition + '.' + address, value)
      })
    },
    updateAlarmCategory (value) {
      const ids = this.selected.map((item) => {
        return item.condition.split('=')[2]
      })
      top.webMI.data.call('JMH_AlarmSetCategory', { nodes: ids, category: value })
    },
    getFilterItems (key) {
      const temp = this.filteredItems.map((item) => { return this.$lodash.get(item, key, []) })
      return this.$lodash(temp).uniq().compact().sort().value()
      // return this.$lodash.uniq(temp)
    }
  }

}
</script>

<style>

</style>

return {

}
