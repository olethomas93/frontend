<template>
  <!-- <div v-if="item.childs._settings"> -->
  <!-- v-if="$store.auth.state.user['https://jmhansen.no/jm.roles'].includes('admin')" -->
  <div>
    <v-tooltip open-delay="500" top dark>
      <template #activator="{ props }">
        <v-btn style="width:24px;height:24px" icon v-bind="props" @click.stop="dialog = true">
          <v-icon>
            mdi-cog
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $T('Open settings') }}</span>
    </v-tooltip>
    <v-dialog v-if="dialog" v-model="dialog" width="800" :fullscreen="fullscreen">
      <v-card :style="{height: fullscreen ? '85vh' : '700px'}" elevation="0">
        <v-card-title>
          {{ $T('Settings') }} {{ item.displayname }} {{ $T('-') }} {{ item.description }}
          <v-spacer />
          <v-btn icon @click="fullscreen = !fullscreen">
            <v-icon>{{ fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }} </v-icon>
          </v-btn>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle>
          {{ item.nodeid }}
        </v-card-subtitle>
        <v-card-text style="height:calc(100% - 104px)">
          <v-tabs
            v-model="tab"
            color="primary"
            slider-color="primary"
          >
            <v-tab v-for="(tab,key) in tabs" :key="key" ripple>
              {{ $T(tab.text) }}
            </v-tab>
          </v-tabs>
          <v-window v-model="tab" style="height:calc(100% - 48px)">
            <v-window-item v-for="(tab,key) in tabs" :key="key" style="height:100%">
              <component v-bind="tab.props" :is="tab.component" :items="tab.items" :base="tab.base || item.nodeid" :settings="item.typeDefinition + '._settings'" />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Rights from '@/global/atviseRightsMixin'

export default {
  mixins: [
    Rights
  ],
  props: {
    item: {
      type: Object,
      default: () => { return {} }
    },
    value: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      fullscreen: true,
      tab: 0,
      dialog: false,
      config: undefined,
      hmi: undefined,
      notes: undefined
    }
  },
  computed: {
    hasSettings () {
      return this.$lodash.get(this.item, 'childs._settings')
    },
    hasConfig () {
      return this.$lodash.get(this.item, 'childs.config')
    },
    tabs () {
      const tabs = []
      // if (this.hasSettings) {
      //   tabs.push({
      //     text: this.$T('Basic'),
      //     component: 'atvise-visu-v3'
      //   })
      // }
      for (const i in this.config) {
        tabs.push({
          text: this.$T(this.config[i].displayname),
          items: this.config[i],
          component: 'editor-config'
        })
      } if (this.notes !== undefined) {
        // this.notes[0].childs = 'ondemand'
        tabs.push(
          {
            text: this.$T('Information'),
            items: this.notes[0],
            component: 'interface-notes',
            base: this.base
          }
        )
      }
      if (this.rights.engineer && this.hmi !== undefined) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.hmi[0].childs = 'ondemand'
        tabs.push(
          {
            text: this.$T(this.hmi[0].displayname),
            items: this.hmi[0],
            component: 'interface-hmi',
            base: this.hmi[0].nodeid
          }
        )
      }
      tabs.push(
        {
          text: this.$T('alarms_text'),
          component: 'alarm-config-list'
        }
      )
      if (this.rights.engineer) {
        tabs.push({
          text: this.$T('Advanced'),
          component: 'editor-editor'
        })
      }
      return tabs
    },
    unit () {
      return this.item.childs.unit?.value || ''
    }
  },
  async mounted () {
    if (this.hasConfig) {
      this.config = await this.getConfig()
      this.notes = await this.checkNotes()
      this.hmi = await this.checkHMI()
      // console.log(this.notes)
      // console.log(this.hmi)
    }
  },
  methods: {
    getConfig () {
      return this.$browse({
        startAddress: this.item.childs.config.nodeid,
        mapping: ['nodeid:nodeid:splitnamespace', 'browsename:browsename', 'typedefinition:typedefinition:splitnamespace', 'displayname:displayname', 'description:description', 'value:value'],
        endLevel: 1
      }, true)
    },
    checkHMI () {
      const hmi = this.$browse({
        startAddress: this.item.nodeid,
        vTypes: ['ObjectTypes.PROJECT.ksatEquipment.hmi.ipAddressDirectory'],
        mapping: ['nodeid:nodeid:splitnamespace', 'browsename:browsename', 'typedefinition:typedefinition:splitnamespace', 'displayname:displayname', 'description:description', 'value:value'],
        endLevel: 2
      }, true)
      return hmi
    },
    checkNotes () {
      const notes = this.$browse({
        startAddress: this.item.nodeid,
        vTypes: ['ObjectTypes.PROJECT.ksatEquipment.notes'],
        mapping: ['nodeid:nodeid:splitnamespace', 'browsename:browsename', 'typedefinition:typedefinition:splitnamespace', 'displayname:displayname', 'description:description', 'value:value'],
        endLevel: 2
      }, true)
      return notes
    }
  }
}
</script>

<style scoped>
  .v-window__container{
    height: 100%
  }
</style>
