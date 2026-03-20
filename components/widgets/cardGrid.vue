<template>
  <v-container style="width:100%;height:100%;">
    <v-row  align="center" style="height: 100%;">
      <v-col  v-for="(item,index) in items" :key="index">
        <atvise-visu-v3 :base="item.nodeid" :query="{base: item.nodeid, asList: true}" :args="{base: item.nodeid, asList: true}" :settings="getDisplay(item)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: ''
    },
    objectType: {
      type: String,
      default: 'ObjectTypes.PROJECT'
    },
    objectTypes: {
      type: Array,
      default: () => { return [] }
    }

  },
  data: () => {
    return {
      items: [],
      display: 'widget'
    }
  },
  watch: {
    base: {
      immediate: true,
      async handler () {
        let items = await this.getItems()
        items = items.filter((item) => { return item.typeDefinition.includes('ObjectTypes') })
        this.items = items
      }
    }
  },
  async mounted () {
    let items = await this.getItems()
    items = items.filter((item) => { return item.typeDefinition.includes('ObjectTypes') })
    this.items = items
  },

  methods: {
    getItems () {
      return new Promise((resolve, reject) => {
        const vTypes = this.objectTypes.map((item) => { return item.objectType })
        vTypes.push('VariableTypes.ATVISE.Display')
        vTypes.push('i=61')
        vTypes.push('i=62')
        vTypes.push('VariableTypes.PROJECT.measurement')
        vTypes.push('VariableTypes.PROJECT.setting')
        const filter = {
          startAddress: this.base,
          endLevel: 0,
          vTypes,
          mapping: ['browsename:browsename', 'displayname:displayname', 'nodeid:nodeid:splitnamespace', 'description:description', 'typeDefinition:typedefinition:splitnamespace', 'value:value']
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
    },
    getDisplay (item) {
      if (item.typeDefinition === 'VariableTypes.ATVISE.Display') {
        return item.nodeid
      } else if (item.childs[this.display]) {
        // return item.typeDefinition + '.' + this.display
        return item.childs[this.display].nodeid
      } else if (item.childs['_' + this.display]) {
        return item.childs['_' + this.display].nodeid
      }
    }

  }
}
</script>

<style>

</style>
