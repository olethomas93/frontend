<template>
  <data-table show-search :items="items" :headers="headers" :mobile-headers="mobileHeaders" />
</template>

<script>
export default {
  data () {
    return {
      search: '',
      items: []
      // headers: [
      //   { text: 'Download', value: 'nodeid', width: 110, custom: { component: 'get-document' } },
      //   { text: 'Name', value: 'displayname' },
      //   { text: 'Type', value: 'childs.type.value' },
      //   { text: 'Created', value: 'childs.create_date.value' },
      //   { text: 'Size', value: 'childs.file_size.value', suffix: 'byte' }
      // ],
      // mobileHeaders: [
      //   { text: 'Download', value: 'nodeid', width: 110, custom: { component: 'get-document' } },
      //   { text: 'Navn', value: 'displayname' }
      // ]
    }
  },
  computed: {
    headers () {
      return [
        { text: this.$T('Download'), value: 'nodeid', width: 110, custom: { component: 'get-document' } },
        { text: this.$T('Name'), value: 'displayname' },
        { text: this.$T('Type'), value: 'childs.type.value' },
        { text: this.$T('Created'), value: 'childs.create_date.value' },
        { text: this.$T('Size'), value: 'childs.file_size.value', suffix: 'byte' }
      ]
    },
    mobileHeaders () {
      return [
        { text: this.$T('Download'), value: 'nodeid', width: 110, custom: { component: 'get-document' } },
        { text: this.$T('Name'), value: 'displayname' }
      ]
    }
  },
  async mounted () {
    const items = await this.getItems()
    this.items = items.filter(function (item) { return item.typedefinition.includes('ObjectTypes.PROJECT') })
  },
  methods: {
    getItems () {
      const self = this
      return new Promise(function (resolve, reject) {
        const startAddress = self.$route.query.base
        const filter = {
          mapping: ['nodeid:nodeid', 'browsename:browsename', 'displayname:displayname', 'typedefinition:typedefinition', 'value:value'],
          startAddress,
          endLevel: 0,
          vTypes: ['ObjectTypes.PROJECT', 'i=62']
        }
        top.webMI.data.call('BrowseNodes', filter, function (data) {
          const arr = Object.keys(data).map(function (i) {
            return data[i]
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
