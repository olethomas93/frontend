<template>
  <div style="height:100%">
    <v-sheet
      tile
      height="64"
      class="d-flex"
    >
      <v-toolbar flat>
        <v-btn
          variant="outlined"
          class="mr-4"
          color="grey-darken-2"
          @click="value=''"
        >
          {{ $T('Today') }}
        </v-btn>
        <v-btn
          icon
          class="ma-2"
          @click="$refs.calendar.prev()"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          icon
          class="ma-2"
          @click="$refs.calendar.next()"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <!-- <date-picker v-model="value" :type="pickerType" /> -->
        <v-spacer />
        <div style="width:200px">
          <v-select
            v-model="type"
            :items="types"
            density="compact"
            variant="outlined"
            hide-details
            class="ma-2"
          />
        </div>
      </v-toolbar>
    </v-sheet>
    <v-sheet style="height: calc(100% - 64px)">
      <v-calendar
        ref="calendar"
        v-model="value"
        :interval-format="format"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :interval-height="24"
        :locale="locale"
        @change="getEvents"
        @click:event="clickEvent"
        @click:more="viewWeek"
        @click:date="viewWeek"
        @click:time="startTime"
      />
    </v-sheet>
    <calendar-dialog
      ref="dialog"
      v-model="editConfig"
      :extra-items="compExtraItems"
      @save="storeSettings"
      @delete="del"
      @cancel="mode = 'none'"
    />
  </div>
</template>

<script>
import { datetime, RRule, RRuleSet } from 'rrule'

export default {
  props: {
    base: {
      type: String,
      default: undefined
    },
    extraItems: {
      type: [String],
      default: '[]'
    }
  },
  data: () => ({
    showDialog: false,
    type: 'month',
    // types: ['month', 'week'],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    value: '',
    atviseEvents: [],
    holidayEvents: [],
    editConfig: {
      text: ''
    },
    configs: [],
    start: undefined,
    end: undefined,
    mode: 'none',
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null
  }),
  computed: {
    locale () {
      return this.$store.getters['atvise/getLanguage']
    },
    compExtraItems () {
      return JSON.parse(this.extraItems)
    },
    types () {
      return [
        {
          text: this.$T('Month'),
          value: 'month'
        },
        {
          text: this.$T('Week'),
          value: 'week'
        }
      ]
    },
    pickerType () {
      return 'date' // this.type === 'month' ? 'month' : 'date'
    },
    events () {
      return [...this.atviseEvents, ...this.holidayEvents]
    }
  },
  watch: {
    configs: {
      deep: true,
      handler () {
        // this.getEvents(this)
        this.atviseEvents = this.calcEvents()
      }
    }
  },
  mounted () {
  },
  methods: {
    removeTz (date) {
      return new Date(date).toISOString().replace('T', ' ').slice(0, 16)
    },
    calcEvents () {
      const arr = []
      // Loop through all configs
      this.configs.forEach((config) => {
        const byweekday = []
        if (config.repeatPeriod >= 2) {
          Object.keys(config.weekdays).forEach((i) => {
            if (config.weekdays[i] === true) {
              byweekday.push(Number(i) - 1)
            }
          })
        }
        const fullDay = config.duration === '86400'
        const startDate = new Date(config.startDate)
        const endDate = new Date(config.endDate)
        let startTimeDate = ''
        if (fullDay) {
          startTimeDate = startDate
          startTimeDate.setHours(0, 0, 0, 0, 0)
        } else {
          startTimeDate = startDate
          startTimeDate.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds())
          // startTimeDate = new Date(this.start.year, this.start.month - 1, this.start.day, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds())
        }
        const options = {
          interval: 1,
          byweekday,
          dtstart: datetime(startTimeDate.getFullYear(), startTimeDate.getMonth() + 1, startTimeDate.getDate(), startTimeDate.getHours(), startTimeDate.getMinutes()),
          until: datetime(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate(), endDate.getHours(), endDate.getMinutes())
        }
        const freq = this.getFreq(config.repeatPeriod)
        if (freq) {
          options.freq = freq
        } else {
          options.freq = RRule.DAILY
          options.count = 1
        }
        const ruleset = new RRuleSet()
        // const rule = new RRule(options)
        ruleset.rrule(new RRule(options))
        // ruleset.exdate(datetime(2023, 6, 7, 7, 0, 0))
        const temp = ruleset.between(datetime(this.start.year, this.start.month, this.start.day - 7), datetime(this.end.year, this.end.month, this.end.day + 7))
        temp.forEach((event) => {
          const startTime = new Date(event)
          const isHoliday = this.isHoliday(startTime)
          const endTime = fullDay ? startTime.getTime() + Number((config.duration * 1000) - 1) : startTime.getTime() + (config.duration * 1000)
          if (config.filter === 0 || (!isHoliday && config.filter === 1) || (isHoliday && config.filter === 2)) {
            arr.push({
              id: config.row,
              name: config.text,
              start: this.removeTz(startTime),
              end: this.removeTz(endTime),
              timed: !fullDay,
              color: config.color
            })
          }
        })
      })
      return arr
    },
    isHoliday (date) {
      const temp = new Date(date)
      const year = temp.getFullYear()
      const holidays = this.getHolidays(year)
      const res = holidays.filter((item) => {
        return this.$moment(item.date).isSame(temp, 'date')
      })
      return res.length > 0
    },
    // calcEvents () {
    //   const arr = []
    //   // Loop through all configs
    //   this.configs.forEach((config) => {
    //     // The span of the calendar
    //     const startDate = new Date(config.startDate)
    //     const endDate = new Date(config.endDate)
    //     const fullDay = config.duration === '86400'
    //     // Time and date for the first event
    //     let startTimeDate = ''
    //     if (fullDay) {
    //       startTimeDate = new Date(this.start.year, this.start.month - 1, this.start.day, 0, 0, 0)
    //     } else {
    //       startTimeDate = new Date(this.start.year, this.start.month - 1, this.start.day, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds())
    //     }
    //     // Make all the events
    //     for (let index = startTimeDate; index <= new Date(this.end.date); index = new Date(index.getTime() + (1000 * 60 * 60 * 24))) {
    //       const date = index
    //       const endTime = fullDay ? date.getTime() + Number((config.duration * 1000) - 1) : date.getTime() + Number(config.duration * 1000)
    //       if (config.repeatPeriod === '1') {
    //         if (date >= startDate && date <= endDate) {
    //           arr.push({
    //             id: config.row,
    //             name: config.text,
    //             start: date,
    //             end: new Date(endTime),
    //             timed: !fullDay,
    //             color: 'success'
    //           })
    //         }
    //       } else if (config.repeatPeriod === '2') {
    //         const test = this.dayInConfig(date, config)
    //         if (date >= startDate && date <= endDate && test) {
    //           arr.push({
    //             id: config.row,
    //             name: config.text,
    //             start: date,
    //             end: new Date(endTime),
    //             timed: !fullDay,
    //             color: 'success'
    //           })
    //         }
    //       }
    //     }
    //   })
    //   console.log(arr)
    //   return arr
    // },
    getEventsAtvise (start, end) {
      return new Promise((resolve) => {
        top.webMI.data.read(this.base, (data) => {
          this.configs = JSON.parse(data.value)[0].config.configs
          resolve(this.calcEvents())
        })
      })
    },
    dayInConfig (date, config) {
      let day = date.getDay()
      day = day === 0 ? 7 : day
      return config.weekdays[`${day}`]
    },
    async getEvents ({ start, end }) {
      console.log('start:', start)
      console.log('end:', end)
      this.start = start
      this.end = end
      this.atviseEvents = await this.getEventsAtvise(start, end)
      // console.log(this.timerConfig)
      const holidays = this.getHolidays(start.year)
      this.holidayEvents = holidays.map((item) => {
        return {
          name: item.name,
          start: item.date,
          end: item.date,
          timed: false,
          color: 'red' // this.colors[this.rnd(0, this.colors.length - 1)]
        }
      })
      // this.events = [...this.events, ...events]
    },
    getEventColor (event) {
      return event.color
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    getHolidays (year) {
      const easterDate = this.calculateEasterDate(year)
      const holidays = [
        {
          date: new Date(year, 0, 1),
          name: '1. Nyttårsdag'
        },
        {
          date: new Date(year, 4, 1),
          name: 'Arbeidernes dag'
        },
        {
          date: new Date(year, 4, 17),
          name: '17. mai'
        },
        {
          date: new Date(year, easterDate.getMonth(), easterDate.getDate() - 3),
          name: 'Skjærtorsdag'
        },
        {
          date: new Date(year, easterDate.getMonth(), easterDate.getDate() - 2),
          name: 'Langfredag'
        },
        {
          date: easterDate,
          name: 'Første påskedag'
        },
        {
          date: new Date(year, easterDate.getMonth(), easterDate.getDate() + 1),
          name: 'Andre påskedag'
        },
        {
          date: new Date(year, easterDate.getMonth(), easterDate.getDate() + 39),
          name: 'Kristi himmelfartsdag'
        },
        {
          date: new Date(year, easterDate.getMonth(), easterDate.getDate() + 49),
          name: 'Første pinsedag'
        },
        {
          date: new Date(year, easterDate.getMonth(), easterDate.getDate() + 50),
          name: 'Andre pinsedag'
        },
        {
          date: new Date(year, 11, 25),
          name: '1. Juledag'
        },
        {
          date: new Date(year, 11, 26),
          name: '2. Juledag'
        }
      ]
      return holidays
    },
    secondSunday (month, year) {
      const d = new Date(year, month, 1)
      const offset = 7 - d.getDay() + 7
      return offset + 7
    },
    calculateEasterDate (year) {
      const a = year % 19
      const b = Math.floor(year / 100)
      const c = year % 100
      const d = Math.floor(b / 4)
      const e = b % 4
      const f = Math.floor((b + 8) / 25)
      const g = Math.floor((b - f + 1) / 3)
      const h = (19 * a + b - d - g + 15) % 30
      const i = Math.floor(c / 4)
      const k = c % 4
      const l = (32 + 2 * e + 2 * i - h - k) % 7
      const m = Math.floor((a + 11 * h + 22 * l) / 451)
      const n = Math.floor((h + l - 7 * m + 114) / 31)
      const p = (h + l - 7 * m + 114) % 31
      const date = new Date(year, n - 1, p + 1)
      return date
    },
    format (data) {
      // console.log(data)
      return data.time
    },
    clickEvent (event) {
      if (event.event.id) {
        this.mode = 'edit'
        this.editConfig = this.$lodash.find(this.configs, { row: event.event.id })
        this.$refs.dialog.modal = true
      }
    },
    viewWeek ({ date }) {
      this.value = date
      this.type = 'week'
    },
    startTime (val) {
      if (this.mode === 'none') {
        const test = new Date(val.year, val.month - 1, val.day, val.hour)
        this.addEvent(test.getTime())
      }
    },
    addEvent (now = new Date().getTime()) {
      this.mode = 'add'
      // const now = new Date().getTime()
      this.editConfig = {
        row: '_' + now,
        active: 'true',
        nodeOn: '',
        valueOn: '',
        valueOff: '',
        text: '',
        repeatPeriod: '0',
        startDate: now,
        endDate: new Date(2099, 1, 1),
        duration: 7200,
        weekdays: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false
        },
        color: '#00A3E0',
        filter: 0
      }
      this.$refs.dialog.modal = true
    },
    storeSettings (val) {
      if (this.mode === 'edit') {
        const index = this.$lodash.findIndex(this.configs, { row: val.row })
        if (index > -1) {
          this.$set(this.configs, index, JSON.parse(JSON.stringify(val)))
        }
      } else {
        this.configs.push(val)
      }
      const temp = [
        {
          id: '',
          config: {
            configs: []
          }
        }
      ]
      temp[0].config.configs = this.configs
      top.webMI.data.write([this.base], [JSON.stringify(temp)])

      this.mode = 'none'
    },
    del (val) {
      if (this.mode === 'edit') {
        const index = this.$lodash.findIndex(this.configs, { row: val.row })
        if (index > -1) {
          this.$delete(this.configs, index)
          const temp = [
            {
              id: '',
              config: {
                configs: []
              }
            }
          ]
          temp[0].config.configs = this.configs
          top.webMI.data.write([this.base], [JSON.stringify(temp)])
        }
      }
      this.mode = 'none'
    },
    getFreq (val) {
      console.log('get freq val', val)
      switch (val) {
        case '0':
          return undefined
        case '1':
          return RRule.DAILY
        case '2':
          return RRule.WEEKLY
        default:
          return RRule.HOURLY
      }
    }
  }
}
</script>

<style scoped>

</style>
