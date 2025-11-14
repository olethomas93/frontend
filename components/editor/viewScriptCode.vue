<template>
  <div>
    <v-toolbar dense :elevation="0" outlined>
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
    </v-toolbar>
    <EditorScriptParameterList :base="base" :value="json?.script?.parameter" @remove:parameter="removeParameter" @add:parameter="addParameter" />
    <MonacoEditor
      ref="editor2"
      v-model="script"
      height="600"
      theme="vs-dark"
      language="javascript"
      :options="options"
      @change="onChange"
    />
  </div>
</template>

<script>
import MonacoEditor from '~/components/common/MonacoEditor.client.vue'
import { xml2json, json2xml } from 'xml-js'

export default {
  components: {
    MonacoEditor
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
      json: '',
      script: '',
      sub: undefined,
      changed: false,
      options: {
        // Monaco Editor Options
        minimap: false,
        automaticLayout: true,
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
  computed: {
    buttons () {
      return [
        {
          text: 'Save',
          icon: 'mdi-content-save-outline',
          disabled: () => { return !this.changed },
          method: () => { this.save() }
        },
        {
          divider: true
        },
        {
          text: 'Copy',
          icon: 'mdi-content-copy',
          disabled: () => { return false },
          method: () => {}
        },
        {
          text: 'Cut',
          icon: 'mdi-content-cut',
          disabled: () => { return false },
          method: () => {}
        },
        {
          text: 'Paste',
          icon: 'mdi-content-paste',
          disabled: () => { return false },
          method: () => {}
        },
        {
          divider: true
        },
        {
          text: 'Color',
          icon: 'mdi-palette-outline',
          disabled: () => { return false },
          method: () => {}
        }
      ]
    }
  },
  watch: {
    json: {
      deep: true,
      handler () {
        this.changed = true
      }
    },
    changed (val) {
      this.$emit('changed', val)
    }
  },
  mounted () {
    this.getScript()
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
    this.subscribeDebug()
  },
  destroyed () {
    top.webMI.data.unsubscribe(this.sub)
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
    getScript () {
      top.webMI.data.read(this.value.nodeid, (data) => {
        // https://www.npmjs.com/package/xml-js
        this.json = JSON.parse(xml2json(data.value, { spaces: 2, compact: true, alwaysArray: false }))
        const temp = this.json.script.code._cdata.replaceAll(/console.(log|warn|debug|info|error)\('#(.*?)# '\+/g, 'console.$1(')
        this.script = temp // this.json.script.code._cdata
        this.$nextTick(() => {
          this.changed = false
        })
      })
    },
    save () {
      console.log('save')
      // https://frightanic.com/software-development/regex-match-last-occurrence/
      this.script = this.script.replaceAll(/console.debug\((.*?)\)(?!.*\))/g, `call('console.debug', {text:'SCRIPT #${this.value.nodeid}# ' + $1})`)
      // console.log(this.script)
      this.json.script.code._cdata = this.script
      const jsonString = JSON.stringify(this.json)
      // jsonString = jsonString.replaceAll(/console.(log|warn|debug|info|error)\(/g, `console.$1('#${this.value.nodeid}# '+`)
      // jsonString = jsonString.replaceAll(/console.debug\((.*?)\)/g, `call('console.debug', {text:'SCRIPT #${this.value.nodeid}# ' + $1})`)

      const options = { compact: true, ignoreComment: true, spaces: 2 }
      const xml = json2xml(jsonString, options)
      top.webMI.data.call('JMH_Editor', {
        method: 'updateScript',
        updateType: 0,
        scriptNodeId: this.value.nodeid,
        scriptCode: xml
      }, (res) => {
        console.log('Result:', res)
        if (res.error === 0) {
          this.changed = false
        }
      })
      // top.webMI.data.write([this.value.nodeid], [xml])
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
    }
  }
}
</script>

<style>

</style>
