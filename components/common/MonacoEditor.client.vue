<template>
  <div ref="container" :style="containerStyle" class="monaco-editor-wrapper" />
</template>

<script>
import * as monaco from 'monaco-editor'
import 'monaco-editor/min/vs/editor/editor.main.css'

export default {
  name: 'MonacoEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: undefined
    },
    language: {
      type: String,
      default: 'json'
    },
    theme: {
      type: String,
      default: 'vs-dark'
    },
    width: {
      type: [Number, String],
      default: '100%'
    },
    height: {
      type: [Number, String],
      default: '100%'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'update:value', 'change'],
  data () {
    return {
      editor: null
    }
  },
  computed: {
    containerStyle () {
      return {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
        height: typeof this.height === 'number' ? `${this.height}px` : this.height
      }
    },
    currentValue () {
      return this.modelValue ?? this.value ?? ''
    }
  },
  watch: {
    currentValue (val) {
      if (this.editor && val !== this.editor.getValue()) {
        this.editor.setValue(val || '')
      }
    },
    language (lang) {
      if (this.editor) {
        monaco.editor.setModelLanguage(this.editor.getModel(), lang || 'json')
      }
    },
    theme (theme) {
      if (this.editor) {
        monaco.editor.setTheme(theme || 'vs-dark')
      }
    },
    options: {
      deep: true,
      handler (opts) {
        if (this.editor) {
          this.editor.updateOptions(opts || {})
        }
      }
    }
  },
  mounted () {
    if (this.$refs.container) {
      this.initEditor()
    }
  },
  beforeUnmount () {
    this.disposeEditor()
  },
  methods: {
    initEditor () {
      this.disposeEditor()
      this.editor = monaco.editor.create(this.$refs.container, {
        value: this.currentValue || '',
        language: this.language || 'json',
        theme: this.theme || 'vs-dark',
        automaticLayout: true,
        ...this.options
      })
      this.editor.onDidChangeModelContent(() => {
        const value = this.editor.getValue()
        this.$emit('update:modelValue', value)
        this.$emit('update:value', value)
        this.$emit('change', value)
      })
    },
    disposeEditor () {
      if (this.editor) {
        this.editor.dispose()
        this.editor = null
      }
    }
  }
}
</script>

<style>
.monaco-editor-wrapper {
  min-height: 100px;
}
</style>
