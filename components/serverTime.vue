<template>
  <div>
    <v-icon small style="vertical-align: middle;">mdi-calendar</v-icon>
    <span style="vertical-align: middle;">{{ `${UTCdate}` }}</span>
    <v-icon style="vertical-align: middle;" small>mdi-clock-outline</v-icon>
    <span style="vertical-align: middle;"> {{ `${UTCTime}` }} </span>
  </div>
</template>
<script>
export default {
  name: 'ServerTime',
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS.CurrentTime'
    }
  },
  data() {
    return {
      UTCdate: '-',
      UTCTime: '-'
    }
  },
  mounted() {
    this.getValue()
    this.int = setInterval(this.getValue, 10000)
  },
  methods: {
    getValue() {
      top.webMI.data.read(this.base, (data) => {
        const dayArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const CT = new Date(data.value)
        const month = CT.getUTCMonth() < 9 ? '0' + (CT.getUTCMonth() + 1) : CT.getUTCMonth() + 1
        const date = CT.getUTCDate() < 10 ? '0' + CT.getUTCDate() : CT.getUTCDate()
        const day = CT.getUTCDay()
        const hours = CT.getUTCHours() < 10 ? '0' + CT.getUTCHours() : CT.getUTCHours()
        const min = CT.getUTCMinutes() < 10 ? '0' + CT.getUTCMinutes() : CT.getUTCMinutes()
        this.UTCdate = dayArray[day] + ' ' + date + '-' + month
        this.UTCTime = 'UTC ' + hours + ':' + min
      })
    }
  }
}
</script>
