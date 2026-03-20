<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="value"
    persistent
    width="800px"
    @update:return-value="$emit('input', value)"
  >
    <template #activator="{ props }">
      <v-text-field
        :value="value"
        :label="label"
        :readonly="false"
        outlined
        density="compact"
        variant="filled"
        @change="$emit('input', $event)"
        @keydown.stop=""
      >
        <template #prepend>
          <v-icon v-bind="props">
            mdi-widgets
          </v-icon>
        </template>
      </v-text-field>
    </template>
    <v-card>
      <v-card-title>
        {{ $T('Select widget') }}
      </v-card-title>
      <v-card-text style="overflow:scroll;height:600px">
        <dashboard-widget-preview @add:widget="update" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          color="primary"
          @click="modal = false"
        >
          {{ $T('Cancel') }}
        </v-btn>
        <!-- <v-btn
          variant="text"
          color="primary"
          @click="$refs.dialog.save(val1)"
        >
          {{ $T('OK') }}
        </v-btn> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    // item: {
    //   type: Object,
    //   default: () => { return {} }
    // },
    label: {
      type: String,
      default: 'Value'
    },
    value: {
      type: String,
      default: undefined
    },
    types: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      modal: false,
      val1: undefined
    }
  },
  // watch: {
  //   base: {
  //     immediate: true,
  //     handler (val) {
  //       top.webMI.data.read(this.base, (e) => {
  //         // this.value = e.value
  //       })
  //     }
  //   }
  // },
  methods: {
    update (val) {
      // console.log(val)
      // this.val1 = val.nodeid
      this.$refs.dialog.save(val.nodeid)
      // this.modal = false
    }
  }
}
</script>

<style>

</style>
