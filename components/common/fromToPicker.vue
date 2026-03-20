<template>
  <div style="width:250px">
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="30"
      :return-value.sync="fromTo"
      transition="scale-transition"
      offset-y
      @update:return-value="update"
    >
      <template #activator="{ props }">
        <v-text-field
          v-model="fromTo"
          _label="$T('Range')"
          prepend-icon="mdi-calendar"
          density="compact"
          hide-details
          readonly
          v-bind="attrs"
          v-bind="props"
        />
      </template>
      <v-date-picker
        v-model="fromTo"
        :no-title="true"
        range
        scrollable
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
          @click="$refs.menu.save(fromTo)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => { return { from: 0, to: 0 } }
    }
  },
  data () {
    return {
      menu: false,
      fromTo: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.fromTo = [this.value.from, this.value.to]
      }
    }
  },
  methods: {
    update (val) {
      if (val[0] < val[1]) {
        this.$emit('input', { from: val[0], to: val[1] })
      } else {
        this.$emit('input', { from: val[1], to: val[0] })
      }
    }
  }
}
</script>

<style>
</style>
