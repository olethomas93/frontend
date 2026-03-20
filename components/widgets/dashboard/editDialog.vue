<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog
    v-if="value"
    :value="value"
    height="600"
    width="1000"
    fullscreen
    @input="$emit('input', !value)"
  >
    <v-card>
      <v-card-title>
        Edit
        <v-spacer />
        <v-btn icon @click="$emit('input', false)">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height:700px;overflow-y:scroll;">
        <v-container fluid>
          <v-row align="start">
            <v-col cols="6">
              <v-expansion-panels v-model="panels" accordion multiple>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    Basic
                  </v-expansion-panel-header>
                  <v-expansion-panel-content v-if="object">
                    <div class="d-flex flex-row">
                      <v-text-field
                        v-model="object.item.icon"
                        label="Icon"
                        outlined
                        class="pr-2"
                        density="compact"
                        clearable
                        @keydown.stop=""
                      />
                      <v-text-field
                        v-model="object.item.label"
                        label="Label"
                        outlined
                        class="pl-2"
                        density="compact"
                        clearable
                        @keydown.stop=""
                      />
                    </div>
                    <dashboard-input-address v-model="object.item.base" :base="base" label="Base" :types="types" />
                    <dashboard-input-widget
                      v-model="object.item.widget"
                      base="SYSTEM.LIBRARY.ATVISE.OBJECTDISPLAYS._jmhVue.dashboard"
                      label="Widget"
                      :types="['VariableTypes.ATVISE.Display']"
                    />
                    <v-text-field
                      :value="object.item.html"
                      label="html"
                      outlined
                      @change="object.item.html = $event"
                      @keydown.8.stop=""
                    />
                    <editor-input-color v-model="object.item.color" :label="$T('Color')" />
                    <v-checkbox v-model="object.item.disableAlarmBell" :label="$T('Disable alarm bell on card')" />
                    <p>Theme</p>
                    <v-btn-toggle
                      v-model="object.item.theme"
                      color="primary"
                    >
                      <v-btn value="auto">
                        Auto
                      </v-btn>
                      <v-btn value="dark">
                        Dark
                      </v-btn>
                      <v-btn value="light">
                        Light
                      </v-btn>
                    </v-btn-toggle>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  v-if="object.item.html"
                >
                  <v-btn @click="getProps">
                    Get props
                  </v-btn>
                  <MonacoEditor
                    ref="editor2"
                    v-model="props"
                    width="550"
                    height="400"
                    theme="vs-dark"
                    language="json"
                    :options="monacoOptions"
                    _change="onChange"
                  />
                </v-expansion-panel>
                <div v-else>
                  <v-expansion-panel
                    v-for="(param,i) in _params"
                    :key="i"
                  >
                    <v-expansion-panel-header>
                      {{ i }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <template v-for="(item,index) in param.items">
                        <editor-input-color v-if="item.valuetype === 'color'" :key="`color-${param.name || i}-${index}`" v-model="object.item.query[item.name]" :label="item.desc || item.name" :hint="item.scope" />
                        <dashboard-input-address v-else-if="item.valuetype === 'address'" :key="`address-${param.name || i}-${index}`" v-model="object.item.query[item.name]" :label="item.desc || item.name" />
                        <v-select
                          v-else-if="item.valuetype === 'enum'"
                          :key="`enum-${param.name || i}-${index}`"
                          _model="object.item.query[item.name]"
                          :value="object.item.query[item.name] || item.defaultvalue"
                          :label="item.desc || item.name"
                          :items="item.config.split(';')"
                          outlined
                          @change="object.item.query[item.name] = $event"
                        />
                        <v-text-field
                          v-else
                          :key="`input-${param.name || i}-${index}`"
                          :value="object.item.query[item.name] || item.defaultvalue"
                          :label="item.desc || item.name"
                          :type="item.valuetype === 'number' ? 'number' : undefined"
                          outlined
                          density="compact"
                          clearable
                          @change="object.item.query[item.name] = $event"
                          @keydown.stop=""
                        />
                      </template>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </div>
              </v-expansion-panels>
            </v-col>
            <v-col cols="6" style="height:300px">
              <dash-card
                v-if="object"
                :dark="object.item.theme==='dark'"
                :light="object.item.theme==='light'"
                :color="object.item.color"
                :title="$T(object.item.label)"
                :offline="true"
                :disable-alarm-bell="object.item.disableAlarmBell || false"
                :base="object.item.base"
                style="display:inline-block;"
              >
                <template #titleIcon>
                  <v-icon v-if="object.item.icon">
                    {{ object.item.icon }}
                  </v-icon>
                </template>
                <template #icons>
                  <v-btn icon @click="key=Math.random()">
                    <v-icon>
                      mdi-refresh
                    </v-icon>
                  </v-btn>
                </template>
                <atvise-visu-v3
                  v-if="object.item.widget"
                  ref="widget"
                  :key="key"
                  :settings="object.item.widget"
                  :base="object.item.base"
                  :query="object.item.query"
                  @mounted="getParameters"
                />
                <component
                  :is="object.item.html"
                  v-else-if="object.item.html"
                  ref="html"
                  v-bind="JSON.parse(props)"
                  :base="object.item.base"
                />
              </dash-card>
              <!-- <pre>{{ JSON.stringify(object, null, 2) }}</pre> -->
            </v-col>
          </v-row>
        </v-container>
        <!-- <editor-editor v-model="selected" :types="types" v-on="$listeners" /> -->
        <!-- <tree-view base="AGENT.OBJECTS" :types="['i=61','ObjectTypes.PROJECT','VariableTypes.PROJECT.measurement']" @update:active="selected = $event[0]" /> -->
      </v-card-text>
      <!-- <v-card-actions>
        <v-btn>Close</v-btn>
        <v-btn @click="$emit('add', selected)">Add</v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script>
import MonacoEditor from '~/components/common/MonacoEditor.client.vue'
import dashCard from '~/components/common/dashCard.vue'

export default {
  components: {
    dashCard,
    MonacoEditor
  },
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    value: {
      type: Boolean,
      default: false
    },
    object: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      theme: 'auto',
      panels: [0],
      selected: undefined,
      types: [
        'i=61',
        'ObjectTypes.PROJECT',
        'VariableTypes.PROJECT.measurement',
        'VariableTypes.ATVISE.Display'
      ],
      key: 1,
      props: '{}',
      monacoOptions: {
        // Monaco Editor Options
        // minimap:true,
        automaticLayout: true,
        matchBrackets: 'always',
        // renderIndentGuides:true,
        dragAndDrop: true,
        suggest: {
          showWords: true
        },
        suggestOnTriggerCharacters: true,
        parameterHints: {
          cycle: true,
          enabled: true
        },
        scrollBeyondLastLine: false,
        statusBar: {
          visible: true
        }
      }
    }
  },
  computed: {
    _params () {
      const items = {
        root: {
          items: []
        }
      }
      const parameters = this.$lodash.get(this.object, 'parameters', {})
      Object.keys(parameters).forEach((i) => {
        const group = this.object.parameters[i].group
        if (this.object.parameters[i].behavior === 'hidden') {
          return
        }
        if (group) {
          if (items[group]) {
            items[group].items.push(this.object.parameters[i])
          } else {
            items[group] = { items: [this.object.parameters[i]] }
          }
        } else {
          items.root.items.push(this.object.parameters[i])
        }
        return this.object.parameters[i]
      })
      return items
    }
  },
  watch: {
    'object.item.query': {
      deep: true,
      handler (val) {
        const refreshOnChange = this.$lodash.get(this.object, 'parameters.refreshOnChange.defaultvalue', 'false')

        if (refreshOnChange === 'true') {
          this.key = parseInt(Math.random() * 100)
        }
      }
    }
    // 'object.item.widget': {
    //   handler () {
    //     setTimeout(() => {
    //       this.$set(this.object, 'parameters', this.$refs.widget.parametersObj)
    //     }, 500)
    //   }
    // },
    // value: {
    //   handler () {
    //     setTimeout(() => {
    //       this.$set(this.object, 'parameters', this.$refs.widget.parametersObj)
    //     }, 500)
    //   }
    // }
  },
  methods: {
    addWidget (item) {
      console.log(item.nodeid)
      // eslint-disable-next-line vue/no-mutating-props
      this.object.item.widget = item.nodeid
    },
    getParameters () {
      this.$set(this.object, 'parameters', this.$refs.widget.parametersObj)
    },
    getProps () {
      this.props = JSON.stringify(this.$refs.html.$props, null, 2)
    }
  }
}
</script>

<style>

</style>
