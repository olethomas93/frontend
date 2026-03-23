<template>
  <div style="user-select:none;height:100%">
    <component
      :is="widget"
      v-if="widget"
      class="pa-0"
      style="width: 100%;height:100%"
      :base="myBase"
      :settings="settings"
      :args="args"
      :overwrites="overwrites"
      :parameters="parameters"
      :hover="hover"
      :event-bus="eventBus"
      :query2="query"
      v-bind="$attrs"
      @title="emitTitle"
      @timestamp="$emit('timestamp', $event)"
      @openDialog="openDialog"
      @closeDialog="closeDialog"
      @vue:mounted="$emit('mounted')"
    />
    <atvise-dialog :dialog="dialog" :config="dialogConfig" @close="dialog=false" />
  </div>
</template>

<script>
import { defineAsyncComponent, markRaw } from 'vue'
import atviseDialog from '@/components/dialogs/atviseDialog'
import { widget } from '@/global/mixin.js'

let webMI = {}
import('@/global/webMI_mixin').then((data) => {
  webMI = data.webMI
})

const options = {
  props: {
    base: {
      type: String,
      default: undefined
    },
    settings: {
      type: String
    },
    eventBus: {
      type: String
    },
    args: {
      type: [Object, String]
    },
    overwrites: {
      type: [Object, String]
    },
    query: {
      type: Object
    },
    maxHeight: {
      type: Number
    },
    scaleToMax: {
      type: Boolean,
      default: true
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  components: {
    atviseDialog
  },
  data: () => ({
    myBase: '',
    widget: undefined,
    parameters: [],
    hover: false,
    dialog: false,
    dialogConfig: {}
  }),
  computed: {
    innerSettings () {
      try {
        return JSON.parse(this.settings)
      } catch (error) {
        return { widget: this.settings }
      }
    },
    arguments () {
      try {
        if (typeof this.args === 'string') {
          return JSON.parse(this.args)
        }
        return this.args
      } catch (error) {
        return []
      }
    },
    argumentsObj () {
      try {
        const obj = {}
        this.arguments.forEach((argument) => {
          obj[argument.name] = argument
        })
        return obj
      } catch (error) {
        return {}
      }
    },
    substitutesArr () {
      return this.parameters
        .filter(p => p.substitute)
        .map((parameter) => {
          if (this.argumentsObj[parameter.name]) {
            try {
              const prefix = this.$parent.query[this.argumentsObj[parameter.name].prefix] || ''
              parameter.value = prefix + this.argumentsObj[parameter.name].value
            } catch (error) {
              parameter.value = this.argumentsObj[parameter.name].value
            }
          }
          return parameter
        })
    }
  },
  mounted () {
    this.myBase = this.base || this.$route.query.base
    this.init()
  },
  watch: {
    base () {
      this.$nextTick(() => {
        this.myBase = this.base || this.$route.query.base
        this.init()
      })
    },
    '$route.query.base' () {
      this.myBase = this.base || this.$route.query.base
      this.init()
    },
    innerSettings () {
      this.$nextTick(() => { this.init() })
    }
  },
  methods: {
    emitTitle () {},
    openDialog (config) {
      this.dialogConfig = config
      this.dialog = true
    },
    closeDialog () {
      this.dialogConfig = {}
      this.dialog = false
    },
    onhover (val) {
      this.hover = val
    },

    init () {
      this.myBase = this.base || this.$route.query.base
      this.widget = markRaw(defineAsyncComponent(() => new Promise((resolve) => {
        this.loadWidget(resolve)
      })))
    },

    async loadWidget (resolve) {
      const widgetName = this.innerSettings.widget
      console.debug('[atviseVisuV3] loadWidget called', { widgetName, innerSettings: this.innerSettings })

      if (!widgetName) {
        console.warn('[atviseVisuV3] No widgetName in innerSettings')
        resolve({ template: '<div></div>', data: () => ({}) })
        return
      }

      // Step 1: fetch raw HTML+script from atvise using the browser's webMI
      // session (the server cannot forward the /webMI/ cookie to the proxy).
      console.debug('[atviseVisuV3] fetching CtrlGetWidget via webMI.customRequest for', widgetName)
      let rawHtml = ''
      let rawScript = ''
      try {
        const widgetData = await new Promise((res, rej) => {
          top.webMI.data.customRequest(
            'GET',
            `/customScripts/CtrlGetWidget?widget=${encodeURIComponent(widgetName)}`,
            (data) => {
              if (!data) { rej(new Error('empty response from CtrlGetWidget')) } else { res(data) }
            }
          )
        })
        rawHtml = widgetData.html ?? widgetData.result ?? ''
        rawScript = widgetData.script ?? ''
      } catch (err) {
        console.error('[atviseVisuV3] CtrlGetWidget fetch failed for', widgetName, err)
        resolve({ template: '<div>ERROR: CtrlGetWidget fetch failed</div>', data: () => ({}) })
        return
      }

      // Step 2: send raw HTML to server for DOM processing (linkedom — no
      // DOMParser needed in Node; server needs no auth for this step).
      console.debug('[atviseVisuV3] posting to /api/webmi/widget-template for', widgetName)
      let fetchResult
      try {
        fetchResult = await $fetch('/api/webmi/widget-template', {
          method: 'POST',
          body: {
            html: rawHtml,
            script: rawScript,
            scaleToMax: this.scaleToMax
          }
        })
        console.debug('[atviseVisuV3] widget-template response:', {
          templateLength: (fetchResult.template || '').length,
          scriptLength: (fetchResult.script || '').length,
          paramCount: (fetchResult.parameters || []).length,
          templatePreview: (fetchResult.template || '').slice(0, 400)
        })
      } catch (err) {
        console.error('[atviseVisuV3] widget-template fetch failed for', widgetName, err)
        resolve({ template: '<div>ERROR: server template processing failed</div>', data: () => ({}) })
        return
      }
      const { template, script, parameters } = fetchResult

      this.parameters = parameters

      // Apply client-side translations (requires Pinia store — cannot run on server)
      const translatedTemplate = this.$store.getters['translation/translateText'](template)
      const translatedScript = this.$store.getters['translation/translateText'](script)
      console.debug('[atviseVisuV3] building Vue component for', widgetName)

      // Build the widget's behaviour function from the processed script
      let visuFuncError = null
      try {
        // eslint-disable-next-line no-new-func
        this.visuFunc = new Function('self', 'var self = this\n' + translatedScript)
      } catch (err) {
        visuFuncError = err
        console.error('[atviseVisuV3] new Function() failed:', err, '\nScript was:\n', translatedScript)
      }

      let vueComp
      try {
        vueComp = this.buildComponent(translatedTemplate)
      } catch (err) {
        console.error('[atviseVisuV3] buildComponent() failed:', err, '\nTemplate was:\n', translatedTemplate)
        resolve({ template: '<div>ERROR: buildComponent failed</div>', data: () => ({}) })
        return
      }
      console.debug('[atviseVisuV3] component ready', widgetName, visuFuncError ? '(visuFunc errored)' : '(visuFunc OK)')
      vueComp.name = 'widget'
      resolve(vueComp)
    },

    /**
     * Assemble the final Vue component options from the server-provided template.
     * Applies {{substitute}} replacements (needs runtime argument values from the
     * component hierarchy, so must stay client-side).
     */
    buildComponent (template) {
      let options
      try {
        if (!this.preview) {
          options = this.visuFunc()
        }
      } catch (error) {
        options = undefined
      }

      if (!options) {
        options = {
          data () { return {} },
          created () {},
          mounted: this.visuFunc
        }
      }

      const funcData = options.data()

      // Apply substitute replacements now that we have the runtime argument values
      options.template = this.replaceSubstitute(template)
      options.mixins = [widget, webMI]

      // Merge atv:parameter defaults into component data
      this.parameters.forEach((param) => {
        if (param.name !== 'darkColor' && param.name !== 'lightColor') {
          funcData[param.name] = this.getSetting(param)
        }
      })

      // Merge atv:argument values (may override parameter defaults)
      if (this.arguments) {
        this.arguments.forEach((arg) => {
          if (arg.name === 'base') {
            this.myBase = (this[arg.prefix] || '') + (arg.value || '')
          } else {
            const prefix = arg.prefix || undefined
            if (prefix) {
              funcData[arg.name] = this.$parent[prefix] + (arg.value || '')
            } else {
              funcData[arg.name] =
                Number(arg.value) ||
                (arg.value === 'true' ? true : arg.value === 'false' ? false : undefined) ||
                arg.value
            }
          }
        })
      }

      // eslint-disable-next-line no-new-func
      options.data = new Function('', 'return ' + JSON.stringify(funcData))
      return options
    },

    replaceSubstitute (text) {
      let result = text
      this.substitutesArr.forEach((sub) => {
        result = result.replaceAll(sub.substitute, sub.value || sub.defaultvalue)
      })
      return result
    },

    visuFunc () {},

    getSetting (val) {
      switch (val.valuetype) {
        case 'bool':
          return val.defaultvalue === 'true'
        case 'number':
          return Number(val.defaultvalue)
        default:
          return val.defaultvalue
      }
    }
  }
}

export default options
</script>
