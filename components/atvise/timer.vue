<template>
  <v-data-table
    :headers="headers"
    :items="items"
  >
    <template #[`item.index`]="{ item }">
      {{ item.index }}
    </template>
    <template #[`item.recurring`]="{ item }">
      {{ item.rec_pattern.replaceAll('_', ' ') }}
    </template>
    <template #[`item.start_date`]="{ item }">
      {{ new Date(item.start_date).toLocaleDateString() }}
    </template>
    <template #[`item.end_date`]="{ item }">
      {{ new Date(item.end_date).toLocaleDateString() }}
    </template>
    <template #[`item.start_time`]="{ item }">
      {{ new Date(item.start_date).toLocaleTimeString() }}
    </template>
    <template #[`item.duration`]="{ item }">
      {{ item.duration/60 }}min  ({{ $moment(item.start_date).add(item.duration, 's').format('HH:mm') }})
    </template>
  </v-data-table>
</template>

<script>
// import example from './example.js'
export default {
  data: () => ({
    headers: [
      { text: '#', value: 'index' },
      { text: 'Recurring', value: 'rec_pattern' },
      { text: 'Start date', value: 'start_date' },
      { text: 'End date', value: 'end_date' },
      { text: 'Start time', value: 'start_time' },
      { text: 'Duration', value: 'duration' },
      { text: 'Event name', value: 'text' },
      { text: 'Node', value: 'nodeOn' },
      { text: 'Value on', value: 'valueOn' },
      { text: 'Value off', value: 'valueOff' },
      { text: 'Status', value: 'active' },
      { text: 'Action', value: '' }
    ],
    items: []
  }),
  computed: {
    // items () {
    //   return example[0].config.configs
    // }
  },
  mounted () {
    top.webMI.data.read('AGENT.OBJECTS.TimerConfig', (e) => {
      console.log(e)
      this.items = JSON.parse(e.value)[0].config.configs
    })
  }
  // items: example.config.configs
}
</script>

<style>

</style>
