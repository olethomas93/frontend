<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="value"
    persistent
    width="290px"
    _update:return-value="setValue"
    @update:return-value="$emit('setValue', $event)"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="value"
        _value="value"
        :label="label"
        readonly
        outlined
        variant="filled"
        v-bind="props"
      >
        <!-- <template #prepend>
          <v-icon :color="color" v-bind="props">
            mdi-palette
          </v-icon>
        </template> -->
      </v-text-field>
    </template>
    <v-card>
      <v-card-title>
        Edit
      </v-card-title>
      <v-card-text>
        <slot>
          <v-text-field
            v-model="value"
            clearable
            :label="label"
            @keydown.stop=""
          />
        </slot>
        <v-spacer />
        <v-btn
          variant="text"
          color="primary"
          @click="modal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          color="primary"
          @click="$refs.dialog.save(value)"
        >
          OK
        </v-btn>
      </v-card-text>
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
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
    // item: {
    //   type: Object,
    //   default: () => { return {} }
    // }
  },
  data () {
    return {
      modal: false
      // value: ''
    }
  }
  // watch: {
  //   base: {
  //     immediate: true,
  //     handler (val) {
  //       top.webMI.data.read(this.base, (e) => {
  //         this.value = e.value
  //       })
  //     }
  //   }
  // },
  // methods: {
  //   setValue (val) {
  //     console.log(val)
  //     top.webMI.data.write(this.base, val)
  //   }
  // }
}
</script>

<style>

</style>
