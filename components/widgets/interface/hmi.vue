<template>
  <v-form style="height:100%">
    <v-container fluid style="height:100%">
      <template v-for="(item, key) in myitems">
        <component
          :is="getType(item)"
          :key="key"
          v-model="item.value"
          :base="base"
          :settings="item.nodeid"
          outlined
          :label="item.displayname"
          style="height:100%"
          @keydown.stop=""
          @keypress.stop=""
          @keyup.stop=""
        />
        <!-- <v-switch
          v-if="item.datatype === 'i=1'"
          :key="key"
          v-model="item.value"
          :label="item.displayname"
          @keydown.stop=""
          @change="write(item, $event)"
        />
        <v-text-field
          v-else-if="item.typedefinition === 'i=62'"
          :key="key"
          v-model="item.value"
          outlined
          :label="item.displayname"
          @keydown.stop=""
          @change="write(item, $event)"
        /> -->
      </template>
    </v-container>
  </v-form>
  <!-- <pre>
    {{ JSON.stringify(item, null, 2) }}
  </pre> -->
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: undefined
    },
    items: {
      type: [Object, String],
      default: () => { return {} }
    }
  },
  data () {
    return {
      myitems: {}
    }
  },
  async mounted () {
    if (this.items.childs === 'ondemand') {
      this.myitems = await this.getConfig()
    }
  },
  methods: {
    getConfig () {
      return this.$browse({
        startAddress: this.items.nodeid,
        mapping: ['nodeid:nodeid:splitnamespace', 'browsename:browsename', 'typedefinition:typedefinition:splitnamespace', 'displayname:displayname', 'description:description', 'value:value', 'datatype:datatype'],
        endLevel: 1
      }, true)
    },
    getType (item) {
      if (item.typedefinition === 'VariableTypes.ATVISE.Display') {
        return 'atvise-visu-v3'
      }
    }
  }
}
</script>

<style>

</style>
