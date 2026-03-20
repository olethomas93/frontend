<template>
  <div>
    <div ref="editor" style="height:100%" />
    <v-dialog
      ref="dialog"
      v-model="modal"
      :return-value.sync="value"
      persistent
      width="600px"
      @update:return-value="setValue"
    >
      <template #activator="{ props }">
        <pre class="code" v-bind="props">{{ value }}</pre>
      </template>
      <v-card>
        <v-card-title>
          Edit
        </v-card-title>
        <v-card-text>
          <MonacoEditor
            ref="editor2"
            v-model="value"
            width="550"
            height="400"
            theme="vs-dark"
            language="json"
            :options="options"
            _change="onChange"
          />
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
  </div>
</template>

<script>
// import CodeEditor from 'simple-code-editor'
import MonacoEditor from '~/components/common/MonacoEditor.client.vue'

export default {
  components: {
    // CodeEditor,
    MonacoEditor
  },
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
      value: '{}',
      options: {
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
  watch: {
    base: {
      immediate: true,
      handler (val) {
        top.webMI.data.read(this.base, (e) => {
          this.value = e.value
        })
      }
    },
    modal (val) {
      if (val === true) {
        this.$nextTick(() => {
          const editor2 = this.$refs.editor2
          editor2.editor.layout()
          const container = editor2.$el
          container.onkeypress = (e) => { e.stopPropagation() }
          container.onkeydown = (e) => { e.stopPropagation() }

          // const code = this.$refs.editor.$el.querySelector('code')
          // code.style.top = '-22px'
          // const textarea = this.$refs.editor.$el.querySelector('textarea')
          // textarea.onkeypress = (e) => { e.stopPropagation() }
          // textarea.onkeydown = (e) => { e.stopPropagation() }
          // textarea.onkeyup = (e) => { e.stopPropagation() }
        })
      }
    }
    // $refs: {
    //   deep: true,
    //   handler (val) {
    //     console.log(val)
    //   }
    // }
  },
  mounted () {
    // console.log(this.$refs)
  },
  methods: {
    setValue (val) {
      top.webMI.data.write(this.base, val)
    }
  }
}
</script>

<style>
  .code{
    outline-width: thin;
    outline-color: #9d9999;
    outline-style: solid;
    border-radius: 4px;
    padding: 10px;
  }
</style>
