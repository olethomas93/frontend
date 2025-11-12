<template>
  <v-container>
    <div style="display: flex;justify-content: space-around;">
      <v-text-field
        v-if="show"
        v-model="search"
        append-icon="mdi-magnify"
        label="Søk"
        single-line
        hide-details
        style="max-width:20vh;margin-bottom: 5%;"
        @keydown.stop=""
      />
      <v-btn v-if="show" @click.stop="dialog = true">
        <v-icon>
          mdi-format-list-bulleted-type
        </v-icon>
      </v-btn>
    </div>
    <v-data-iterator
      v-if="filteredList.length > 0"
      :items="filteredList"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      hide-default-footer
    >
      <template #default="props">
        <template v-for="item in props.items">
          <!-- <template v-if="item.sensor.typeDefinition.includes('weatherstation') && item.sensor.childs.active.value">
            <v-card :key="item.nodeid" outlined>
              <v-card-title>
                {{ $T(item.location) }}
              </v-card-title>
              <v-card-text>
                <v-row>
                  <template v-for="mes in item.sensor.childs">
                    <v-col
                      v-if="
                        mes.typeDefinition.includes(
                          'VariableTypes.PROJECT.measurement'
                        )
                      "
                      :key="mes.nodeid"
                      style="    display: flex;
    flex-direction: column;
}"
                    >
                      <h4>{{ $T(mes.displayname) }}</h4>
                      <div style="display:flex; flex-direction:row;gap:1%;">
                        <h3>{{ Number(mes.value).toFixed(1) }}</h3>
                        <h5>{{ mes.childs.unit.value }}</h5>
                      </div>
                    </v-col>
                  </template>
                </v-row>
              </v-card-text>
              <v-card-actions v-if="show">
                <data-table-widget-trend-icon v-if="show" :item="item" />
                <data-table-widget-settings-icon v-if="show" :item="item" />
              </v-card-actions>
            </v-card>
          </template> -->
          <template>
            <v-card
              v-if="
                item.sensor.typeDefinition.includes(
                  'ObjectTypes.PROJECT.BaseObjectTypeJMH.SensorType'
                ) && item.sensor.childs.active.value
              "
              :key="item.sensor.nodeid"
              outlined
              elevation="10"
            >
              <v-card-title>
                <v-row>
                  <v-col>{{ $T(item.sensor.displayname) }}</v-col>
                  <v-col>
                    <v-spacer />
                    {{ item.sensor.childs.depth.value }} m
                    <v-icon color="primary">
                      mdi-arrow-down
                    </v-icon>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-subtitle>
                {{ $T(item.location) }}
              </v-card-subtitle>

              <v-card-text>
                <v-row>
                  <template v-for="mes in item.sensor.childs">
                    <v-col
                      v-if="
                        mes.typeDefinition.includes(
                          'VariableTypes.PROJECT.measurement'
                        )
                      "
                      :key="mes.nodeid"
                      style="    display: flex;
    flex-direction: column;
}"
                    >
                      <h4>{{ $T(mes.displayname) }}</h4>
                      <div style="display:flex; flex-direction:row;gap:1%;">
                        <!-- <h3 v-show="false">
                          {{ subNode(mes) }}
                        </h3> -->
                        <h3>{{ Number(mes.value).toFixed(1) }}</h3>
                        <h5>{{ mes.childs.unit.value }}</h5>
                      </div>
                    </v-col>
                  </template>
                </v-row>
              </v-card-text>
              <data-table-widget-settings-icon v-if="show" :item="sensor" />
            </v-card>
          </template>
        </template>
      </template>
      <template #footer>
        <div v-if=" numberOfPages> 1">
          <v-btn
            icon
            @click="formerPage
            "
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          {{ page }} / {{ numberOfPages }}
          <v-btn
            icon
            @click="nextPage
            "
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-iterator>
    <sensors-no-sensors v-else />
    <v-dialog v-model="dialog">
      <sensors-logg-popup :base="base" />
    </v-dialog>
  </v-container>
</template>

<script>
// import sparkline from '~/components/widgets/sensors/sparkline.vue'

export default {
  name: 'SensorsList',
  components: {
    // sparkline
  },
  props: {
    base: {
      type: String,
      default: ''
    },
    mini: {
      type: Boolean,
      default: false
    },
    groupBy: {
      type: String,
      default: ''
    },
    includeStartAddress: {
      type: Boolean,
      default: true
    },
    getAll: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    sensors: [],
    search: '',
    update: 0,
    dialog: false,
    filteredItems: [],
    subs: [],
    itemsPerPage: 2,
    page: 1
  }),
  computed: {
    filteredList () {
      let _arr = []
      if (this.base.length > 5) {
        _arr = this.sensors.filter((item) => {
          let activeSensor = false
          for (const sensor in item.childs) {
            if (item.childs[sensor].typeDefinition.includes('SensorType')) {
              if (item.childs[sensor].childs.active.value) {
                activeSensor = true
              }
            }
          }

          return activeSensor
        })
      }
      const list = []
      for (const item of _arr) {
        const location = item.displayname
        for (const sensor in item.childs) {
          if (item.childs[sensor].typeDefinition.includes('SensorType')) {
            list.push({ location, sensor: item.childs[sensor] })
          }
        }
      }
      return list
    },
    numberOfPages () {
      return Math.ceil(this.filteredList.length / this.itemsPerPage)
    }
  },
  watch: {
    base: {
      immediate: true,
      async handler () {
        if (this.base) {
          this.sensors = await this.getItems()
        }
      }
    },
    filteredList: {
      immediate: true,
      handler () {
        this.$emit('items', this.filteredList)
      },
      search: {
        handler () {}
      }
    }
  },

  async mounted () {
    // this.sensors = await this.getItems()
  },

  destroyed () {
    for (const sub in this.subs) {
      top.webMI.data.unsubscribe(sub)
    }
  },
  methods: {
    filterChilds (list) {
      return list
    },
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) { this.page += 1 }
    },
    formerPage () {
      if (this.page - 1 >= 1) { this.page -= 1 }
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },

    subNode (mes) {
      return new Promise((resolve, reject) => {
        const subId = top.webMI.data.subscribe(mes.nodeid, function (data) {
          mes.value = data.value
        })
        this.subs.push(subId)
      })
    },
    getItems () {
      return new Promise((resolve, reject) => {
        const vTypes = []
        vTypes.push('ObjectTypes.PROJECT.BaseObjectTypeJMH.SensorType')
        vTypes.push('ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType.Unit_Cage')
        vTypes.push('VariableTypes.PROJECT.measurement')
        vTypes.push('VariableTypes.PROJECT.position')
        vTypes.push('i=62')
        vTypes.push('VariableTypes.PROJECT.setting')
        const filter = {
          startAddress: this.base,
          endLevel: 0,
          vTypes,
          mapping: [
            'browsename:browsename',
            'displayname:displayname',
            'nodeid:nodeid:splitnamespace',
            'description:description',
            'typeDefinition:typedefinition:splitnamespace',
            'value:value'
          ]
        }
        top.webMI.data.call('BrowseNodes', filter, (data) => {
          resolve(this.toArray(data))
        })
      })
    },
    toArray (data) {
      return Object.keys(data).map((i) => {
        // this.toArray(data[i].childs)
        return data[i]
      })
    }
  }
}
</script>
<style>
.v-row-group__header {
  background: transparent !important;
}
.group {
  margin-left: 5%;
}
</style>
