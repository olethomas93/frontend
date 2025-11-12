<template>
  <v-data-table dense :headers="headers" :items="items" :items-per-page="-1" hide-default-footer>
    <template #[`item._attributes.name`]="{ item }">
      <v-text-field
        v-model="item._attributes.name"
        dense
        hide-details
        flat
        solo
        @keydown.stop=""
      />
    </template>
    <template #[`item._attributes.type`]="{ item }">
      <v-select
        v-model="item._attributes.type"
        dense
        hide-details
        flat
        solo
        :items="types"
      />
    </template>
    <template #[`item._attributes.trigger`]="{ item }">
      <v-checkbox
        v-model="item._attributes.trigger"
        dense
        hide-details
        :disabled="item._attributes.type !== 'interval'"
        :true-value="'true'"
        :false-value="'false'"
      />
    </template>
    <template #[`item._attributes.value`]="{ item }">
      <EditorScriptNodePicker :base="base" :value="item" />
    </template>
    <template #[`item.delete`]="{ item }">
      <v-btn icon @click="removeParameter(item)">
        <v-icon>
          mdi-delete-outline
        </v-icon>
      </v-btn>
    </template>
    <template #[`body.append`]="{}">
      <tr>
        <td />
        <td />
        <td />
        <td />
        <td>
          <v-btn icon @click="addParameter">
            <v-icon>
              mdi-plus
            </v-icon>
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, Object],
      default: undefined
    },
    base: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      test: true,
      headers: [
        { text: 'Name', value: '_attributes.name', width: 150 },
        { text: 'Type', value: '_attributes.type', width: 200 },
        { text: 'Trigger', value: '_attributes.trigger', width: 100 },
        { text: 'Value', value: '_attributes.value' },
        { text: 'Action', value: 'delete', width: 50 }
      ]
    }
  },
  computed: {
    items () {
      return Array.isArray(this.value) ? this.value : [this.value]
    },
    types () {
      return [
        'alarm',
        'boolean',
        'http',
        'http.ip',
        'http.request',
        'http.response',
        'http.session',
        'interval',
        'node',
        'node.servertime',
        'node.sourcetime',
        'node.status',
        'node.value',
        'number',
        'once',
        'session',
        'session.user',
        'startup',
        'shutdown',
        'string',
        'timer'
      ]
    }
  },
  methods: {
    removeParameter (item) {
      this.$emit('remove:parameter', item)
    },
    addParameter () {
      this.$emit('add:parameter')
    }
  }
}
</script>

<style>

</style>
