<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    min-width="auto"
    @update:return-value="update"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="date"
        :label="label"
        _prepend-icon="mdi-calendar"
        readonly
        v-bind="{ ...$attrs, ...props }"
      />
    </template>
    <v-date-picker
      v-model="date"
      no-title
      scrollable
      locale="no"
      :first-day-of-week="1"
      show-week
      :type="type"
    >
      <v-spacer />
      <v-btn
        variant="text"
        color="primary"
        @click="menu = false"
      >
        Cancel
      </v-btn>
      <v-btn
        variant="text"
        color="primary"
        @click="setDate(date)"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'date'
    },
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Date'
    }
  },
  data () {
    return {
      date: '',
      // date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        // console.log('value changed')
        this.date = val
      }
    }
  },
  methods: {
    setDate (date) {
      this.menu = false
      this.$refs.menu.save(date)
      this.$emit('date', this.date)
      this.$emit('input', this.date)
    },
    update () {
      this.$emit('input', this.date)
    }
  }
}
</script>

<style>

</style>
