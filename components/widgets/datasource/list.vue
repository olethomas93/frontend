<template>
  <data-table :items="items" :headers="headers" :mobile-headers="mobileHeaders" />
</template>

<script>
export default {
  data: () => {
    return {
      items: [],
      headers: [
        { text: 'Status', value: 'childs.connected.value', width: 100, custom: { component: 'online-icon' } },
        { text: 'Name', value: 'displayname' },
        { text: 'Url', value: 'childs.url.value' },
        { text: 'Node-Red', value: 'link', custom: { component: 'link', props: { openInNew: true } } },
        { text: 'Publishing interval', value: 'childs.publishing_interval.value', suffix: 'ms' },
        { text: 'Sampling interval', value: 'childs.sampling_interval.value', suffix: 'ms' }

      ],
      mobileHeaders: [
        { text: 'Status', value: 'childs.connected.value', width: 100, custom: { component: 'online-icon' } },
        { text: 'Name', value: 'displayname' }
      ]
    }
  },
  async mounted () {
    this.items = await this.getDatasources()
  },
  methods: {
    getDatasources () {
      return new Promise((resolve) => {
        const filter = {
          startAddress: 'AGENT.DATASOURCES',
          endLevel: 0,
          vTypes: ['ObjectTypes.ATVISE', 'i=62'],
          mapping: ['browsename:browsename', 'displayname:displayname', 'description:description', 'value:value', 'typeDefinition:typeDefinition']
        }
        top.webMI.data.call('BrowseNodes', filter, (data) => {
          const res = Object.keys(data).map((i) => {
            const temp = data[i]
            const path = temp.childs.url.value.split('//')[1].split(':')[0]
            temp.link = `http://${path}:1880`
            return temp
          })
          resolve(res)
        })
      })
    }
  }
}
</script>

<style>

</style>
