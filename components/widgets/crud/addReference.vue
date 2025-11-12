<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        Add reference
      </v-card-title>
      <v-card-text>
        <v-select v-model="selected" placeholder="Please select object to reference..." :items="unusedItems" item-text="displayname" item-value="nodeid" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn @click="ok">Add</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: ''
    },
    objectPool: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selected: '',
      allItems: [],
      unusedItems: [],
      items: [],
      headers: [
        { text: 'id', value: 'nodeid' },
        { text: 'name', value: 'browsename' }
      ]
    }
  },
  async mounted () {
    this.allItems = await this.getItems()
    await Promise.all(
      this.allItems.map(async (item) => {
        item.parentId = await this.getData(item.nodeid)
      })
    )
    this.unusedItems = this.allItems.filter((item) => {
      return item.parentId === ''
    })

    this.items = this.allItems.filter((item) => {
      return item.parentId === this.base
    })
    console.log('done')
  },
  methods: {
    cancel () {
      this.$emit('close')
      // top.webMI.trigger.fire('closePopup')
    },
    ok () {
      top.webMI.data.call('JMH_addReference', { parentId: this.base, childId: this.selected }, (e) => {
        if (e.error) {
          this.$store.commit('SET_CUSTOM_ALERT', { message: e.errorstring })
          console.error(e)
        } else {
          this.$emit('close')
        }
      })
      // top.webMI.trigger.fire('closePopup')
    },
    getData (id) {
      return new Promise((resolve) => {
        top.webMI.data.read(id + '.parentId', function (e) {
          // console.log(e)
          resolve(e.value)
        })
      })
    },
    getItems () {
      return new Promise((resolve) => {
        top.webMI.data.call('BrowseNodes', { startAddress: this.objectPool, mapping: ['displayname:displayname', 'nodeid:nodeid:splitnamespace', 'browsename:browsename'] }, function (e) {
          // const arr = []
          const arr = Object.keys(e).map((i) => {
            return e[i] // arr.push(e[i])
          })
          resolve(arr)
        })
      })
    }
  }
}
</script>

<style>

</style>
