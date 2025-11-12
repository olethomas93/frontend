<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="config"
    persistent
    width="500"
    _update:return-value="setValue"
  >
    <v-card>
      <v-card-title>
        <v-text-field v-model="config.text" style="font-size:x-large" placeholder="Event name" @keydown.stop="" />
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon :color="config.color">
                mdi-circle
              </v-icon>
            </v-list-item-avatar>
            <calendar-color-picker v-model="config.color" />
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>
                mdi-clock-outline
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="pl-3">
              <!-- Hele dagen -->
              {{$T('Time span')}}
            </v-list-item-content>
            <!-- <v-list-item-action>
              <v-switch v-model="allDay" />
            </v-list-item-action> -->
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon />
            </v-list-item-avatar>
            <calendar-date-picker
              v-model="config.startDate"
              flat
              solo
              hide-details
              dense
              :hide-time="allDay"
              @input="startDateChanged"
            />
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon />
            </v-list-item-avatar>
            <calendar-date-picker
              v-model="durationDateTime"
              flat
              solo
              hide-details
              dense
              :hide-time="allDay"
              @input="durationChanged"
            />
          </v-list-item>
          <v-divider />
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>
                mdi-reload
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-select
                v-model="config.repeatPeriod"
                :items="repeatPeriods"
                flat
                solo
                dense
                hide-details
              />
            </v-list-item-content>
          </v-list-item>
          <div v-if="Number(config.repeatPeriod) >= 1">
            <v-list-item v-if="Number(config.repeatPeriod) > 1">
              <v-list-item-avatar>
                <v-icon />
              </v-list-item-avatar>
              <v-list-item-content>
                <calendar-weekday-picker v-if="Number(config.repeatPeriod) === 2" v-model="config.weekdays" class="pl-3" />
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <!-- <v-icon>
                  mdi-reload
                </v-icon> -->
              </v-list-item-avatar>
              <v-list-item-content>
                <v-select
                  v-model="repeat"
                  :items="repeats"
                  flat
                  solo
                  dense
                  hide-details
                  @input="setRepeat"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="repeat === 1">
              <v-list-item-avatar>
                <v-icon />
              </v-list-item-avatar>
              <calendar-date-picker
                v-model="config.endDate"
                hide-time
                flat
                solo
                hide-details
                dense
              />
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon />
              </v-list-item-avatar>
              <v-select
                v-model="config.filter"
                :items="filters"
                flat
                solo
                dense
                hide-details
              />
            </v-list-item>
          </div>
          <v-divider />
          <div v-for="(item, index) in extraItems" :key="index">
            <v-list-item v-if="item.text.length > 0" dense>
              <v-list-item-content style="padding-left:68px;">
                {{ $T(item.text) }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <!-- <p>{{ $T(item.text) }}</p> -->
              <v-list-item-avatar>
                <v-icon />
              </v-list-item-avatar>
              <component :is="item.component" v-model="config[item.variable]" v-bind="item.props" class="pa-3" />
            </v-list-item>
          </div>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          @click="del(config)"
        >
          {{ $T('Delete') }}
        </v-btn>
        <v-spacer />
        <v-btn
          outlined
          color="primary"
          @click="cancel"
        >
          {{ $T('Cancel') }}
        </v-btn>
        <v-btn
          outlined
          color="primary"
          _click="$refs.dialog.save(config)"
          @click="setValue(config)"
        >
          {{ $T('Ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    extraItems: {
      type: [Array],
      default: () => {
        return []
      }
    },
    value: {
      type: Object,
      default: () => {
        return {
          row: '_1683270194443',
          active: 'true',
          // start_date: 'Mon May 01 2023 07:00:00',
          // end_date: 'Mon Feb 01 9999 00:00:00',
          nodeOn: '',
          valueOn: '',
          valueOff: '',
          // event_pid: '',
          // event_length: '28800',
          // rec_pattern: 'week_1___1,2,3,4,5',
          // rec_type: 'week_1___1,2,3,4,5#no',
          text: '',
          repeatPeriod: '-1',
          startDate: 1682917200000,
          endDate: 1687644000000,
          duration: '28800',
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
      }
    }
  },
  data () {
    return {
      allDay: false,
      config: {},
      modal: false,
      durationDateTime: '',
      durationDate: '',
      durationTime: '',
      repeat: 0,
      days: ['M', 'T', 'O', 'T', 'F', 'L', 'S']
    }
  },
  computed: {
    repeats () {
      return [
        {
          text: this.$T('Forever'),
          value: 0
        },
        {
          text: this.$T('Until date'),
          value: 1
        }
      ]
    },
    filters () {
      return [
        {
          text: this.$T('No filter'),
          value: 0
        },
        {
          text: this.$T('Not holidays'),
          value: 1
        },
        {
          text: this.$T('Only holidays'),
          value: 2
        }
      ]
    },
    repeatPeriods () {
      return [
        {
          text: this.$T('No repeat'),
          value: '0'
        },
        {
          text: this.$T('Daily'),
          value: '1'
        },
        {
          text: this.$T('Weekly'),
          value: '2'
        },
        {
          text: this.$T('Monthly'),
          value: '3'
        }
      ]
    }
  },
  watch: {
    allDay (val) {
      if (val === true) {
        this.startTime = '00:00'
        this.durationTime = '23:59'
      }
    },
    value: {
      immediate: true,
      handler (val) {
        this.init(val)
      }
    }
  },
  mounted () {
  },
  methods: {
    init (val) {
      this.config = JSON.parse(JSON.stringify(val))
      if (this.value.duration) {
        const temp = new Date(this.value.startDate).getTime() + (this.value.duration * 1000)
        this.durationDateTime = new Date(temp)
        this.durationDate = this.$moment(this.startDateTime).format('YYYY-MM-DD') // this.durationDateTime.toISOString().split('T')[0]
        this.durationTime = this.durationDateTime.toTimeString().slice(0, 5)
      }
      if (this.value.endDate) {
        if (new Date(this.config.endDate).getTime() >= 4073583600000) {
          this.repeat = 0
        } else {
          this.repeat = 1
        }
      }
    },
    setValue (val) {
      this.modal = false
      this.$emit('input', val)
      this.$emit('save', val)
      // if (this.base) {
      //   top.webMI.data.write(this.base, val)
      // }
    },
    cancel () {
      this.modal = false
      this.$emit('cancel')
    },
    del (val) {
      this.modal = false
      this.$emit('delete', val)
    },
    setRepeat (val) {
      // console.log('set repeat:', val)
      if (val === 0) {
        this.endDate = new Date(2099, 1, 1)
        this.config.endDate = new Date(2099, 1, 1).getTime()
      } else {
        this.config.endDate = new Date().getTime()
      }
    },
    startDateChanged (val) {
      console.log(new Date(val))
      // console.log('startDate changed: ', val)
      console.log(this.config.duration)
      console.log(new Date(new Date(val).getTime() + (this.config.duration * 1000)))
      this.durationDateTime = new Date(val).getTime() + (this.config.duration * 1000)
    },
    durationChanged (val) {
      // console.log('Duration changed: ', val)
      this.config.duration = (new Date(val).getTime() / 1000) - (new Date(this.config.startDate).getTime() / 1000)
    }
  }
}
</script>

<style>

</style>
