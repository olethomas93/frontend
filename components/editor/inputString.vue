<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="value"
    persistent
    width="290px"
    @update:return-value="setValue"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="value"
        label="value"
        readonly
        outlined
        dense
        filled
        v-bind="attrs"
        v-on="on"
      >
        <!-- <template #prepend>
          <v-icon :color="color" v-on="on">
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
        <v-text-field
          v-model="value"
          :label="item.displayname"
          :hint="item.description"
          persistent-hint
          @keydown.stop=""
        />
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="modal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
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
    item: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      modal: false,
      value: ''
    }
  },
  watch: {
    base: {
      immediate: true,
      handler (val) {
        top.webMI.data.read(this.base, (e) => {
          this.value = e.value
        })
      }
    }
  },
  methods: {
    setValue (val) {
      top.webMI.data.write(this.base, val)
    }
  }
}
</script>

<style>

</style>
