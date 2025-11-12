<template>
  <div>
    <v-tabs
      v-model="tab"
      color="primary"
      slider-color="primary"
    >
      <v-tab v-for="(tab,key) in tabs" :key="key" ripple>
        {{ $T(tab.text) }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" touchless style="height:calc(100% - 0px)">
      <v-tab-item v-for="(tab,key) in tabs" :key="key" style="height:100%">
        <component v-bind="tab.props" :is="tab.component" :items="tab.items" :base="tab.base || item.nodeid" :settings="item.typeDefinition + '._settings'" />
      </v-tab-item>
    </v-tabs-items>
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
    }
  },
  data: () => {
    return {
      item: {},
      // fullscreen: true,
      tab: 0,
      // dialog: false,
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
      for (const i in this.config) {
        tabs.push({
          text: this.$T(this.config[i].displayname),
          items: this.config[i],
          component: 'editor-config',
          base: this.base
        })
      }      
      if (this.notes !== undefined) {
          this.notes[0].childs = 'ondemand'
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
          this.hmi[0].childs = 'ondemand'
          tabs.push(
              {
                text: this.$T(this.hmi[0].displayname),
                items: this.hmi[0],
                component: 'interface-hmi',
                base: this.hmi[0].nodeid
              }
            )

        /*this.$browse({
          startAddress: this.base,
          vTypes: ['ObjectTypes.PROJECT.ksatEquipment.hmi.ipAddressDirectory'],
          endLevel: 1
        }).then((data) => {
          if(data.HMI != undefined){
            console.log('Pushing HMI')
            tabs.push(
              {
                text: 'HMI',
                component: 'editor-editor',
                base: this.base
              }
            )
          }else{
            console.log('Nothing here')
          }
        })*/
      }
      tabs.push(
        {
          text: 'Events',
          component: 'alarm-config-list',
          base: this.base
        }
      )
      if (this.rights.engineer) {
        tabs.push({
          text: this.$T('Advanced'),
          component: 'editor-editor',
          base: this.base
        })
      }
      return tabs
    }
  },
  async mounted () {
    
    this.config = await this.getConfig()
    this.notes = await this.checkNotes()
    this.hmi = await this.checkHMI()
    
  },
  methods: {
    getConfig () {
      return this.$browse({
        startAddress: this.base + '.config',
        mapping: ['nodeid:nodeid:splitnamespace', 'browsename:browsename', 'typedefinition:typedefinition:splitnamespace', 'displayname:displayname', 'description:description', 'value:value'],
        endLevel: 1
      }, true)
    },
    checkHMI () {
      var hmi = this.$browse({
          startAddress: this.base,
          vTypes: ['ObjectTypes.PROJECT.ksatEquipment.hmi.ipAddressDirectory'],
          mapping: ['nodeid:nodeid:splitnamespace', 'browsename:browsename', 'typedefinition:typedefinition:splitnamespace', 'displayname:displayname', 'description:description', 'value:value'],
          endLevel: 2
        },true)
      return hmi
    },
    checkNotes () {
      var notes = this.$browse({
          startAddress: this.base,
          vTypes: ['ObjectTypes.PROJECT.ksatEquipment.notes'],
          mapping: ['nodeid:nodeid:splitnamespace', 'browsename:browsename', 'typedefinition:typedefinition:splitnamespace', 'displayname:displayname', 'description:description', 'value:value'],
          endLevel: 2
        },true)
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
