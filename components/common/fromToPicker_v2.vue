<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    persistent
    lazy
    full-width
    width="290px"
  >
    <template v-slot:activator="{ props }">
      <v-btn variant="plain" icon v-bind="props">
        <v-icon>date_range</v-icon>
      </v-btn>
      <v-btn-toggle
        v-show="$vuetify.breakpoint.mdAndUp"
        v-model="value"
        mandatory
        dark
        style="background:transparent;"
        @change="set(value)"
      >
        <v-btn variant="plain">
          I dag
        </v-btn>
        <v-btn variant="plain">
          Siste 2 dager
        </v-btn>
        <v-btn variant="plain">
          Siste 7 dager
        </v-btn>
        <!-- <v-btn variant="plain">
              Denne måned
            </v-btn> -->
      </v-btn-toggle>
    </template>
    <div class="pa-3">
      <v-btn block @click="set(0)">
        I dag
      </v-btn>
      <v-btn block @click="set(1)">
        Siste 2 dager
      </v-btn>
      <v-btn block @click="set(2)">
        Siste 7 dager
      </v-btn>
      <!-- <v-btn block @click="set(3)">Denne måned</v-btn> -->
    </div>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    modal: false,
    value: 0
    // dateFrom: new Date(new Date().getTime() - 6 * 60 * 60 * 1000),
    // dateTo: new Date()
  }),
  methods: {
    update () {
      // var from = new Date(this.dateFrom).getTime();
      // var to = new Date(this.dateTo).getTime();
      // this.$emit("update", { from: from, to: to });
    },
    update7 () {
      // var to = new Date().getTime();
      // var from = to - 7 * 24 * 60 * 60 * 1000;
      // this.$emit("update", { from: from, to: to });
    },
    set (val) {
      let str = ''
      this.value = val
      switch (val) {
        case 0: // I dag
          str = 'I dag'
          this.dateTo = this.$moment().endOf('day').valueOf()
          this.dateFrom = this.$moment().startOf('day').valueOf()
          break
        case 1: // siste døgn
          str = 'Siste to døgn'
          this.dateTo = this.$moment().endOf('day').valueOf()
          this.dateFrom = this.$moment().subtract(1, 'd').startOf('day').valueOf()
          break
        case 2: // denne uke
          str = 'Siste 7 dager'
          this.dateTo = this.$moment().endOf('day').valueOf()
          this.dateFrom = this.$moment().startOf('day').subtract(7, 'd').valueOf()
          break
        case 3: // denne måned
          str = 'Denne måned'
          this.dateTo = this.$moment().endOf('day').valueOf()
          this.dateFrom = this.$moment().startOf('month').valueOf()

          break
        default:
      }
      this.modal = false
      this.$emit('update', { from: this.dateFrom, to: this.dateTo, string: str })
    }
  }
}
</script>

<style>
</style>
