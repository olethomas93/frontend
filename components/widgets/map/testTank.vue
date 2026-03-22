<template>
  <div>
    <l-circle
      v-if="position"
      ref="circle"
      :lat-lng="position"
      :radius="radius"
      :weight="2"
      :color="inAlarm ? alarmCount.color : undefined"
      :fill-color="inAlarm ? alarmCount.color : undefined"
      @mousedown="move($event)"
      @ready="ready"
    />
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    value: {
      type: Object,
      default: undefined
    },
    map: {
      type: Object,
      default: undefined
    },
    edit: {
      type: Boolean,
      default: true
    },
    radius: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      position: undefined
    }
  },
  computed: {
    getAlarmCount () { return this.$store.getters['alarming/getAlarmCount'] },
    alarmCount () {
      return this.getAlarmCount(this.value.nodeid, false)
    },
    inAlarm () {
      return this.alarmCount.alarms > 0
    },
    hasPosition () {
      return this.$lodash.get(this.value, 'childs.position')
    }
  },
  mounted () {
    if (this.hasPosition) {
      this.getPosition()
    }
  },
  methods: {
    ready () {
      this.$refs.circle.mapObject.bindTooltip(this.value.displayname,
        { permanent: true, direction: 'center' }
      ).openTooltip()
    },
    getPosition () {
      top.webMI.data.read(this.value.childs.position.nodeid, (data) => {
        if (!data.error) {
          this.position = JSON.parse(data.value)
        }
      })
    },
    savePosition () {
      const pos = this.position
      // const pos = { lat: 12, lng: 300 }
      // console.log(this.value.childs.position.nodeid)
      // console.log(this.position)
      // console.log(pos)
      top.webMI.data.write(this.value.childs.position.nodeid, JSON.stringify(pos))
    },
    move (e) {
      if (this.edit) {
        this.map.dragging.disable()
        this.map.on('mousemove', (data) => {
          this.position = { lat: data.latlng.lat, lng: data.latlng.lng }
        })
        this.map.on('mouseup', () => {
          this.map.dragging.enable()
          this.map.removeEventListener('mousemove')
          this.savePosition()
        })
      }
    }
  }
}
</script>

<style>

</style>
