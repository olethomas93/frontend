<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog
    ref="dialog"
    v-model="modal2"
    :return-value.sync="dateTime"
    persistent
    width="580px"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    _input="$emit('input', dateTime )"
  >
    <template #activator="{ on }">
      <v-text-field
        v-model="value"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="$attrs"
        v-on="on"
      />
    </template>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6" style="padding:0;">
          <v-date-picker
            v-if="modal2"
            v-model="date"
            first-day-of-week="1"
            locale="nb-NO"
            format="24hr"
            :full-width="true"
          >
            <v-spacer />
            <v-btn
              text
              disabled
              color="primary"
              @click="modal2 = false"
            />
          <!-- <v-btn
            text
            color="primary"
            @click="$refs.dialog.save(value)"
          >
            OK
          </v-btn> -->
          </v-date-picker>
        </v-col>
        <v-col cols="12" md="6" style="padding:0;">
          <v-time-picker
            v-if="modal2"
            v-model="time"
            format="24hr"
            :full-width="true"
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="modal2 = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              _click="$refs.dialog.save(value)"
              @click="ok"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: [String],
      default: ''
    }
  },
  data: () => ({
    modal2: false,
    time: '00:00',
    date: '2020-01-01'
  }),
  computed: {
    // dateTime () {
    //   return `${this.date} ${this.time}`
    // }
    dateTime: {
      get () {
        return `${this.date} ${this.time}`
      },
      set (val) {
        // this.time = this.value.split(' ')[1]
        // this.date = this.value.split(' ')[0]
      }
    }
  },
  watch: {
    modal2 (val) {
      if (val === true) {
        this.time = this.value.split(' ')[1]
        this.date = this.value.split(' ')[0]
      }
    }
  },
  mounted () {
    // console.log(this.value)
    // this.time = this.value.split(' ')[1]
    // this.date = this.value.split(' ')[0]
  },
  methods: {
    ok () {
      this.modal2 = false
      // this.$refs.dialog.save(this.dateTime)
      this.$emit('input', `${this.date} ${this.time}`)
    }
  }
}
</script>

<style>
.v-picker__title{
  height:88px;
}
</style>
