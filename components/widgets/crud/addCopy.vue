<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        {{ $T('Add') }}
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="selected"
          multiple
          :placeholder="$T('Please select object(s) to add...')"
          :items="allItems"
          item-title="displayname"
          item-value="nodeid"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="cancel">
          {{ $T('Cancel') }}
        </v-btn>
        <v-btn color="primary" @click="ok">
          {{ $T('Add') }}
        </v-btn>
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
    },
    objectType: {
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
    // await Promise.all(
    //   this.allItems.map(async (item) => {
    //     item.parentId = await this.getData(item.nodeid)
    //   })
    // )
    // this.unusedItems = this.allItems.filter((item) => {
    //   return item.parentId === ''
    // })

    // this.items = this.allItems.filter((item) => {
    //   return item.parentId === this.base
    // })
  },
  methods: {
    cancel () {
      this.$emit('close')
      // top.webMI.trigger.fire('closePopup')
    },
    ok () {
      this.selected.forEach((item) => {
        top.webMI.data.call('JMH_copyNode', { from: item, to: this.base }, (e) => {
          if (e.error) {
            this.$store.commit('SET_CUSTOM_ALERT', { message: e.errorstring })
            console.error(e)
          } else {
            this.$emit('close')
          }
        })
      })
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
        top.webMI.data.call('BrowseNodes', { vTypes: [this.objectType], startAddress: this.objectPool, mapping: ['displayname:displayname', 'nodeid:nodeid:splitnamespace', 'browsename:browsename'] }, function (e) {
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
