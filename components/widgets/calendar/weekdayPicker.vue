<template>
  <v-chip-group
    v-model="test2"
    multiple
    active-class="primary--text"
    @change="input"
  >
    <v-chip
      v-for="(day, index) in days"
      :key="index"
      :value="day.value"
    >
      {{ day.short }}
    </v-chip>
  </v-chip-group>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          1: false,
          2: false,
          3: true,
          4: false,
          5: false,
          6: false,
          7: false
        }
      }
    }
  },
  data () {
    return {
      test2: [],
      test: {},
      days: [
        {
          short: 'M',
          name: this.$T('Monday'),
          value: 1
        },
        {
          short: 'T',
          name: this.$T('Tuesday'),
          value: 2
        },
        {
          short: 'O',
          name: this.$T('Wednesday'),
          value: 3
        },
        {
          short: 'T',
          name: this.$T('Thursday'),
          value: 4
        },
        {
          short: 'F',
          name: this.$T('Friday'),
          value: 5
        },
        {
          short: 'L',
          name: this.$T('Saturday'),
          value: 6
        },
        {
          short: 'S',
          name: this.$T('Sunday'),
          value: 7
        }
      ]
    }
  },
  watch: {
    value: {
      deep: false,
      immediate: true,
      handler (val) {
        this.test2 = []
        for (const i in val) {
          console.log(val[i])
          if (val[i] === true) {
            this.test2.push(Number(i))
          }
        }
      }
    },
    test: {
      deep: true,
      handler (val) {
        this.$emit('input', val)
      }
    }
  },
  mounted () {
  },
  methods: {
    input (val) {
      const temp = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false
      }
      this.test2.forEach((item) => {
        temp[item] = true
      })
      this.test = temp
    }
  }
}
</script>

<style>

</style>
