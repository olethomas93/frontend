<template>
  <div>
    <v-row>
      <v-btn icon density="compact" @click="dialog = true">
        <v-icon>
          mdi-dots-horizontal
        </v-icon>
      </v-btn>
      <v-btn-toggle
        :value="isRelative"
        :group="false"
        density="compact"
        color="primary"
        @change="setRelative"
      >
        <v-btn icon :value="true">
          <v-icon>
            mdi-alpha-r
          </v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-text-field
        density="compact"
        hide-details
        variant="solo"
        flat
        :disabled="isRelative"
        :value="text"
        @input="setText"
        @keydown.stop=""
      />
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>
          Pick node
        </v-card-title>
        <v-card-text style="height:600px;overflow: scroll;">
          <tree-view v-if="dialog" :base="codeBase" @update:active="selected = $event[0]" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="variant="outlined"" @click="selectNode">
            {{ $T('Ok') }}
          </v-btn>
          <v-btn variant="variant="outlined"" @click="dialog = false">
            {{ $T('Cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      dialog: false,
      selected: ''
    }
  },
  computed: {
    text () {
      if (this.isRelative) {
        return this.$lodash.get(this.value, 'RelativePath.Elements.RelativePathElement.TargetName.Name._text', '')
      } else {
        return this.$lodash.get(this.value, '_attributes.value', '')
      }
    },
    isRelative () {
      // return this.value.RelativePath !== undefined
      return this.$lodash.get(this.value, '_attributes.relative', 'false') === 'true'
    },
    codeBase () {
      return this.isRelative ? this.base.split('.').slice(0, -1).join('.') : 'AGENT.OBJECTS'
    }
  },
  methods: {
    selectNode () {
      if (this.isRelative) {
        const text = this.selected.nodeid.replace(this.codeBase, '').replace('.', '')
        this.$set(this.value.RelativePath.Elements.RelativePathElement.TargetName.Name, '_text', text)
      } else {
        this.$set(this.value._attributes, 'value', 'ns=1;s=' + this.selected.nodeid)
      }
      this.dialog = false
    },
    setRelative (val) {
      console.log(val)
      if (val === true) {
        const obj = {
          Elements: {
            RelativePathElement: {
              TargetName: {
                NamespaceIndex: {
                  _text: '1'
                },
                Name: {
                  _text: ''
                }
              }
            }
          }
        }
        this.$set(this.value._attributes, 'relative', 'true')
        this.$set(this.value, 'RelativePath', obj)
      } else {
        delete this.value.RelativePath
        this.$set(this.value._attributes, 'relative', 'false')
        this.$set(this.value._attributes, 'value', '')
      }
    },
    setText (val) {
      this.$set(this.value._attributes, 'value', val)
    }
  }
}
</script>

<style>

</style>
