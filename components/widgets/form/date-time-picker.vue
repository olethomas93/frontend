<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog
    ref="dialog"
    v-model="modal2"
    persistent
    width="580px"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="currentValue"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="{ ...$attrs, ...props }"
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
              variant="text"
              disabled
              color="primary"
              @click="modal2 = false"
            />
          <!-- <v-btn
            variant="text"
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
              variant="text"
              color="primary"
              @click="modal2 = false"
            >
              Cancel
            </v-btn>
            <v-btn
              variant="text"
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
  emits: ['update:modelValue', 'update:value', 'input'],
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    value: {
      type: [String],
      default: undefined
    }
  },
  data: () => ({
    modal2: false,
    time: '00:00',
    date: '2020-01-01'
  }),
  computed: {
    currentValue: {
      get () {
        return this.modelValue ?? this.value ?? ''
      },
      set (val) {
        this.$emit('update:modelValue', val)
        if (this.value !== undefined) {
          this.$emit('update:value', val)
        }
        this.$emit('input', val)
      }
    }
  },
  watch: {
    modal2 (val) {
      if (val === true) {
        const [date, time] = (this.currentValue || '').split(' ')
        this.time = time || '00:00'
        this.date = date || this.$moment().format('YYYY-MM-DD')
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
      const formatted = `${this.date} ${this.time}`
      this.currentValue = formatted.trim()
    }
  }
}
</script>

<style>
.v-picker__title{
  height:88px;
}
</style>
