<template>
  <div style="height:100%">
    <v-toolbar v-if="type === 'private ' || rights.engineer || dashboards.length > 1" tabs dense style="z-index:2">
      <v-tabs :key="key" v-model="tab" style="max-width:80%">
        <v-tab v-for="(dash,index) in dashboards" :key="index">
          <v-btn v-if="edit && (tab === index)" icon :disabled="index === 0" @click.stop="moveItem(index, index - 1)">
            <v-icon>
              mdi-arrow-left
            </v-icon>
          </v-btn>
          {{ $T(dash.name) }}
          <v-edit-dialog
            v-if="edit && (tab === index)"
            :return-value.sync="dash.name"
            large
            style="z-index:11000;"
            _save="save"
            _cancel="cancel"
            _open="open"
            _close="close"
          >
            <v-btn icon>
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
            <template #input>
              <v-text-field
                v-model="dash.name"
                label="Edit"
                single-line
                @keydown.stop=""
                @keypress.stop=""
                @keyup.stop=""
              />
            </template>
          </v-edit-dialog>
          <v-btn v-if="edit && (tab === index)" icon :disabled="dashboards.length === 1" color="critical" @click.stop="deleteDashboard(index)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
          <v-btn v-if="edit && (tab === index)" icon :disabled="index === dashboards.length - 1" @click.stop="moveItem(index, index + 1)">
            <v-icon>
              mdi-arrow-right
            </v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
      <v-spacer />
      <div v-if="rights.engineer || type === 'private'">
        <v-btn v-if="!edit" icon @click="edit = true">
          <v-icon>
            mdi-view-dashboard-edit
          </v-icon>
        </v-btn>
        <v-btn v-if="edit" icon color="errror" @click="addDashboard">
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
        <v-btn v-if="edit" icon @click="save">
          <v-icon>
            mdi-content-save
          </v-icon>
        </v-btn>
        <v-btn v-if="edit" icon @click="cancel">
          <v-icon>
            mdi-undo
          </v-icon>
        </v-btn>
      </div>
    </v-toolbar>
    <v-tabs-items v-model="tab" style="height:calc(100% - 48px); overflow: auto;">
      <v-tab-item v-for="(dash,index) in dashboards" :key="index">
        <dashboard-grid v-if="tab == index" :base="base" :items="dash.items" :edit-mode="edit" />
      </v-tab-item>
    </v-tabs-items>
    <!-- <dashboard-editor v-model="editMode" @save="saveDashboard" @addCard="addCard" /> -->
  </div>
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
      default: undefined
    },
    type: {
      type: String,
      default: 'private'
    },
    dashboardBase: {
      type: String,
      default: undefined
    },
    localTab: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      edit: false,
      tabLocal: 0,
      public: [],
      private: [],
      dashboards: [],
      key: 1
    }
  },
  computed: {
    tab: {
      set (val) {
        const query = { ...this.$route.query }
        query.tab = val
        this.tabLocal = val
        if (!this.localTab) {
          this.$router.replace({ query })
        }
      },
      get () {
        let temp = (Number(this.$route.query.tab)) || 0
        if (this.localTab) {
          temp = this.tabLocal
        }
        return temp
      }
    }
  },
  watch: {
    edit () {
      this.key = parseInt(Math.random() * 1000)
    }
  },
  mounted () {
    this.getDashboards()
    console.log(this.localTab)
  },
  methods: {
    async getDashboards () {
      // WIP...
      // this.public = await this.getDashboards('public')
      // this.private = await this.getDashboards()
      // this.dashboards = [...this.public, ...this.private]
      this.dashboards = await this.getDashboard(this.type)
    },
    getDashboard (type = 'private') {
      return new Promise((resolve, reject) => {
        const dashboardBase = this.dashboardBase || this.base
        top.webMI.data.call('JMH_getDashboard', { base: dashboardBase, type }, (data) => {
          if (data.error) {
            reject(data)
          }
          resolve(JSON.parse(data.result))
          // this.dashboards = JSON.parse(data.result)
        })
      })
      // top.webMI.data.call('JMH_getDashboard', { base: this.base }, (data) => {
      //   this.dashboards = JSON.parse(data.result)
      // })
    },
    addDashboard () {
      this.dashboards.push({
        name: 'Dash_' + (this.dashboards.length + 1),
        items: []
      })
    },
    deleteDashboard (index) {
      this.dashboards.splice(index, 1)
    },
    save () {
      this.edit = false
      // top.webMI.data.write('AGENT.OBJECTS.dash2', JSON.stringify(this.dashboards))
      const dashboardBase = this.dashboardBase || this.base
      top.webMI.data.call('JMH_saveDashboard', { type: this.type, base: dashboardBase, dash: JSON.stringify(this.dashboards) })
    },
    cancel () {
      this.edit = false
      this.getDashboards()
    },
    moveItem (from, to) {
      // remove `from` item and store it
      const f = this.dashboards.splice(from, 1)[0]
      // insert stored item into position `to`
      this.dashboards.splice(to, 0, f)
      this.tab = to
    }
  }
}
</script>

<style>
.theme--light.v-tabs-items{
  background-color: transparent
}
.theme--dark.v-tabs-items{
  background-color: transparent
}
</style>
