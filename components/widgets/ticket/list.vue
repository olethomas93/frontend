<template>
  <data-table show-search :items="items" :headers="headers" :mobile-headers="mobileHeaders" :table-props="tableProps" />
</template>

<script>
export default {
  data () {
    return {
      search: '',
      items: [],
      // headers: [
      //   { text: 'Id', value: 'browsename', width: 80 },
      //   { text: 'Location', value: 'childs.partner_name.value', width: 80 },
      //   { text: 'Status', value: 'childs.stage_id.value', width: 80 },
      //   { text: 'Name', value: 'displayname', width: 150 },
      //   // { text: 'Locationid', value: 'childs.x_location_id.value', width: 80 },
      //   { text: 'Descripton', value: 'childs.description.value' },
      //   { text: 'Created', value: 'childs.create_date.value' },
      //   { text: 'Assigned', value: 'childs.user_id.value' },
      //   { text: 'Closed', value: 'childs.close_date.value' }
      // ],
      // mobileHeaders: [
      //   { text: 'Id', value: 'browsename', width: 80 },
      //   { text: 'Name', alue: 'displayname', width: 150 }
      // ],
      tableProps: {
        hideDefaultFooter: true,
        sortBy: 'childs.close_date.value',
        sortDesc: true
        // showSelect: true,
        // singleSelect: true,
        // itemKey: 'browsename'
      }
    }
  },
  computed: {
    headers () {
      return [
        { text: 'Id', value: 'browsename', width: 80 },
        { text: this.$T('Location'), value: 'childs.partner_name.value', width: 80 },
        { text: this.$T('Status'), value: 'childs.stage_id.value', width: 80 },
        { text: this.$T('Name'), value: 'displayname', width: 350 },
        // { text: 'Locationid', value: 'childs.x_location_id.value', width: 80 },
        // { text: this.$T('Description'), value: 'childs.description.value' },
        { text: this.$T('Created'), value: 'childs.create_date.value', width: 50 },
        { text: this.$T('Assigned'), value: 'childs.user_id.value', width: 50 },
        { text: this.$T('Closed'), value: 'childs.close_date.value', width: 50 }
      ]
    },
    mobileHeaders () {
      return [
        { text: 'Id', value: 'browsename', width: 80 },
        { text: 'Name', alue: 'displayname', width: 150 }
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
            const temp = data[i]
            if (temp.childs) {
              temp.childs.stage_id.value = JSON.parse(temp.childs.stage_id.value)[1]
              temp.childs.user_id.value = JSON.parse(temp.childs.user_id.value)[1]
            }
            return temp
          })
          resolve(arr)
        })
      })
    }
    // getClass (item) {
    //   if (item.childs.close_date.value === 'false') {
    //     return 'inAlarm'
    //   }
    //   const status = JSON.parse(item.childs.stage_id.value)[1]
    //   if (status === 'Solved') {
    //     return 'solved'
    //   }
    // }
  }
}
</script>

<style>

</style>
