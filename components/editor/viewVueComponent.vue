<template>
  <div>
    <!-- <v-toolbar density="compact" :elevation="0" outlined>
      <template v-for="(btn, index) in buttons">
        <v-divider v-if="btn.divider" :key="index" vertical />
        <v-btn
          v-else
          :key="'btn_' + index"
          icon
          :disabled="btn.disabled()"
          @click="btn.method"
        >
          <v-icon>
            {{ btn.icon }}
          </v-icon>
        </v-btn>
      </template>
    </v-toolbar> -->
    <!-- <EditorScriptParameterList :base="base" :value="json?.script?.parameter" @remove:parameter="removeParameter" @add:parameter="addParameter" /> -->
    <!-- https://github.com/Kingwl/monaco-volar -->
    <splitpanes class="default-theme">
      <pane size="50" min-size="20" max-size="80">
        <MonacoEditor
          ref="editor2"
          v-model="script"
          height="600"
          theme="vs-dark"
          language="html"
          :options="options"
          @change="onChange"
          @keydown.ctrl.73="save"
        />
      </pane>
      <pane>
        <NodePicker label="Base address" @input="myBase=$event" />
        <PreviewVueComponent v-if="preview" ref="preview" :base="myBase" :component="base.replace('SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents/' ,'')" />
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import MonacoEditor from '~/components/common/MonacoEditor.client.vue'
import PreviewVueComponent from './previewVueComponent.vue'
import NodePicker from '@/components/editor/nodePicker.vue'
// import { xml2json, json2xml } from 'xml-js'

export default {
  components: {
    MonacoEditor,
    Splitpanes,
    Pane,
    PreviewVueComponent,
    NodePicker
  },
  props: {
    value: {
      type: Object,
      default: undefined
    },
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    }
  },
  data () {
    return {
      // json: '',
      myBase: undefined,
      preview: true,
      script: '',
      // sub: undefined,
      // changed: false,
      options: {
        // Monaco Editor Options
        minimap: false,
        automaticLayout: true,
        tabSize: 2,
        matchBrackets: 'always',
        renderIndentGuides: true,
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
  watch: {
    myBase () {
      this.preview = false
      this.$nextTick(() => {
        this.preview = true
      })
    }
  },
  // computed: {
  //   buttons () {
  //     return [
  //       {
  //         text: 'Save',
  //         icon: 'mdi-content-save-outline',
  //         disabled: () => { return !this.changed },
  //         method: () => { this.save() }
  //       },
  //       {
  //         divider: true
  //       },
  //       {
  //         text: 'Copy',
  //         icon: 'mdi-content-copy',
  //         disabled: () => { return false },
  //         method: () => {}
  //       },
  //       {
  //         text: 'Cut',
  //         icon: 'mdi-content-cut',
  //         disabled: () => { return false },
  //         method: () => {}
  //       },
  //       {
  //         text: 'Paste',
  //         icon: 'mdi-content-paste',
  //         disabled: () => { return false },
  //         method: () => {}
  //       },
  //       {
  //         divider: true
  //       },
  //       {
  //         text: 'Color',
  //         icon: 'mdi-palette-outline',
  //         disabled: () => { return false },
  //         method: () => {}
  //       }
  //     ]
  //   }
  // },
  // watch: {
  //   json: {
  //     deep: true,
  //     handler () {
  //       this.changed = true
  //     }
  //   },
  //   changed (val) {
  //     this.$emit('changed', val)
  //   }
  // },
  mounted () {
    this.loadComponent()
    this.$nextTick(() => {
      const editor2 = this.$refs.editor2
      // editor2.editor.layout()
      const container = editor2.$el
      container.onkeypress = (e) => { e.stopPropagation() }
      container.onkeydown = (e) => {
        e.stopPropagation()
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault()
          this.save()
          // console.log('CTRL + S')
        }
      }
    })
    // this.subscribeDebug()
  },
  destroyed () {
    // top.webMI.data.unsubscribe(this.sub)
  },
  methods: {
    subscribeDebug () {
      this.sub = top.webMI.data.subscribe(['SYSTEM.INFORMATION.LOGS.Debug', 'SYSTEM.INFORMATION.LOGS.Error'], (val) => {
        if (val.value.includes(`#${this.value.nodeid}#`)) {
          console.log(val)
        }
        if (val.value.includes(`'${this.value.nodeid}'`)) {
          console.error(val)
        }
      })
    },
    onChange (val) {
      // this.json.script.code._cdata = val
      this.changed = true
    },
    loadComponent () {
      top.webMI.data.read(this.value.nodeid, (data) => {
        this.script = this.hex2String(data.value)
      })
    },
    // getScript () {
    //   top.webMI.data.read(this.value.nodeid, (data) => {
    //     // https://www.npmjs.com/package/xml-js
    //     this.json = JSON.parse(xml2json(data.value, { spaces: 2, compact: true, alwaysArray: false }))
    //     const temp = this.json.script.code._cdata.replaceAll(/console.(log|warn|debug|info|error)\('#(.*?)# '\+/g, 'console.$1(')
    //     this.script = temp // this.json.script.code._cdata
    //     this.$nextTick(() => {
    //       this.changed = false
    //     })
    //   })
    // },
    save () {
      // console.log('save')
      top.webMI.data.write(this.value.nodeid, this.string2Hex(this.script))
      // Component reload hack
      this.preview = false
      this.$nextTick(() => {
        this.preview = true
      })
    },
    removeParameter (item) {
      const index = this.$lodash.findIndex(this.json.script.parameter, item)
      this.json.script.parameter.splice(index, 1)
    },
    addParameter () {
      const parameter = {
        _attributes: {
          name: '',
          relative: 'false',
          trigger: 'false',
          type: 'boolean'
        }
      }
      this.json.script.parameter.push(parameter)
    },
    hex2String (hexString) {
      const raw = hexString.replace(/ /g, '')
      const bytes = new Uint8Array(raw.length / 2)
      for (let i = 0, j = 0; i < raw.length; i += 2, j++) {
        bytes[j] = parseInt(raw.substr(i, 2), 16)
      }
      return new TextDecoder('utf-8').decode(bytes)
    },
    string2Hex (string) {
      const encoder = new TextEncoder()
      const bytes = encoder.encode(string)
      let hexString = ''
      bytes.forEach((byte) => {
        hexString += byte.toString(16).padStart(2, '0')
      })
      return hexString
    }
  }
}
</script>

<style>
.splitpanes.default-theme .splitpanes__pane {
  background: transparent;
}

.splitpanes__pane {
  padding:0px;
  overflow-y: scroll;
  /* box-shadow: 0 0 5px rgba(0, 0, 0, .2) inset; */
  /* justify-content: center;
  align-items: center; */
  /* display: flex; */
}

/* .splitpanes--vertical > .splitpanes__splitter {
  min-width: 6px;
  background: linear-gradient(90deg, #ccc, #111);
}

.splitpanes--horizontal > .splitpanes__splitter {
  min-height: 6px;
  background: linear-gradient(0deg, #ccc, #111);
} */
</style>
