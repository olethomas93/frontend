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

      // Step 1: fetch raw HTML+script from atvise using the browser's webMI session.
      // Strategy:
      //   a) Try CtrlGetWidget — returns parsed { html, script } for most displays.
      //      If it returns HTTP 404 that display is not in the custom script index;
      //      do NOT retry, go straight to fallback.
      //      If it returns empty html (session not yet established), retry with delay.
      //   b) Fall back to webMI.data.read — reads the raw SVG from the OPC-UA node
      //      directly. The raw value contains inline <script> tags which the server
      //      will extract.
      console.debug('[atviseVisuV3] fetching widget for', widgetName)
      let rawHtml = ''
      let rawScript = ''

      // Helper: call CtrlGetWidget once and return the response object
      const ctrlGetWidget = () => new Promise((res, rej) => {
        top.webMI.data.customRequest(
          'GET',
          `/customScripts/CtrlGetWidget?widget=${encodeURIComponent(widgetName)}`,
          (data) => {
            if (!data) { rej(new Error('no response')) } else { res(data) }
          }
        )
      })

      // Helper: read the display node value directly from OPC-UA
      const readNode = () => new Promise((res, rej) => {
        top.webMI.data.read(widgetName, (data) => {
          if (data?.value) { res(data.value) } else { rej(new Error(`webMI.data.read failed for ${widgetName}: ${data?.error}`)) }
        })
      })

      const sleep = ms => new Promise(r => setTimeout(r, ms))
      const retryDelays = [1500, 3000]
      let usedFallback = false

      for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
        try {
          const widgetData = await ctrlGetWidget()
          // Permanent error (e.g. 404) — CtrlGetWidget doesn't serve this display
          if (widgetData.httpstatus >= 400) {
            console.warn('[atviseVisuV3] CtrlGetWidget returned HTTP', widgetData.httpstatus, 'for', widgetName, '— falling back to webMI.data.read')
            break
          }
          const html = widgetData.html ?? widgetData.result ?? ''
          if (html) {
            rawHtml = html
            rawScript = widgetData.script ?? ''
            break
          }
          // Empty html but no error code = session not ready yet; retry
          console.warn('[atviseVisuV3] CtrlGetWidget returned empty html (attempt', attempt, ') – session not ready?', widgetData)
        } catch (err) {
          console.warn('[atviseVisuV3] CtrlGetWidget attempt', attempt, 'threw:', err)
        }
        if (attempt < retryDelays.length) {
          console.debug('[atviseVisuV3] retrying CtrlGetWidget in', retryDelays[attempt], 'ms…')
          await sleep(retryDelays[attempt])
        }
      }

      // If CtrlGetWidget couldn't supply HTML, fall back to direct OPC-UA node read
      if (!rawHtml) {
        try {
          console.debug('[atviseVisuV3] trying webMI.data.read for', widgetName)
          rawHtml = await readNode()
          rawScript = '' // script is embedded in the raw SVG; server will extract it
          usedFallback = true
          console.debug('[atviseVisuV3] webMI.data.read succeeded, rawHtml length:', rawHtml.length)
        } catch (err) {
          console.error('[atviseVisuV3] webMI.data.read also failed for', widgetName, err)
        }
      }

      if (!rawHtml) {
        console.error('[atviseVisuV3] Could not load widget HTML for', widgetName)
        resolve({ template: `<div>ERROR: could not load display "${widgetName}"</div>`, data: () => ({}) })
        return
      }
      console.debug('[atviseVisuV3] raw HTML obtained (usedFallback=' + usedFallback + ') length:', rawHtml.length)

      // Step 2: send raw HTML to server for DOM processing (linkedom — no
      // DOMParser needed in Node; server needs no auth for this step).
      // If browser fetch failed, pass `widget` name so server can try directly.
      console.debug('[atviseVisuV3] posting to /api/webmi/widget-template for', widgetName)
      let fetchResult
      try {
        fetchResult = await $fetch('/api/webmi/widget-template', {
          method: 'POST',
          body: { html: rawHtml, script: rawScript, scaleToMax: this.scaleToMax }
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

      // Build the widget's behaviour function from the processed script.
      // Pattern A ("return-options"): script starts with `return {` and
      //   yields `{ data, mounted, methods, computed }` — wrap in an IIFE.
      // Pattern B (mounted-hook): script body runs directly; inject `var self = this`.
      const isReturnOptions = translatedScript.trimStart().startsWith('return')
      let atvOptions = {}
      let scriptError = null
      try {
        if (isReturnOptions) {
          // eslint-disable-next-line no-new-func
          const fn = new Function(translatedScript)
          atvOptions = fn() ?? {}
        } else {
          // eslint-disable-next-line no-new-func
          this.visuFunc = new Function('self', 'var self = this\n' + translatedScript)
        }
      } catch (err) {
        scriptError = err
        console.error('[atviseVisuV3] script compile failed:', err, '\nScript was:\n', translatedScript)
      }

      let vueComp
      try {
        vueComp = this.buildComponent(translatedTemplate, parameters, atvOptions)
      } catch (err) {
        console.error('[atviseVisuV3] buildComponent() failed:', err, '\nTemplate was:\n', translatedTemplate)
        resolve({ template: '<div>ERROR: buildComponent failed</div>', data: () => ({}) })
        return
      }
      console.debug('[atviseVisuV3] component ready', widgetName, scriptError ? '(script error: ' + scriptError.message + ')' : '(OK)')
      vueComp.name = 'widget'
      resolve(vueComp)
    },

    /**
     * Assemble the final Vue component options from the server-provided template.
     *
     * @param {string}  template   - Processed HTML template string from the server.
     * @param {Array}   parameters - atv:parameter definitions extracted from SVG.
     * @param {Object}  atvOptions - Vue options returned by a "return-options" script
     *                               (`{ data, mounted, methods, computed }`).
     *                               Empty object for "mounted-hook" scripts.
     */
    buildComponent (template, parameters, atvOptions) {
      // ── 1. Build the parameter data payload ───────────────────────────────
      // Collect atv:parameter defaults (skip theme colours — provided by computed).
      const paramData = {}
      const params = parameters || this.parameters
      params.forEach((param) => {
        if (param.name !== 'darkColor' && param.name !== 'lightColor') {
          paramData[param.name] = this.getSetting(param)
        }
      })

      // Overlay atv:argument values (runtime overrides from the caller).
      const args = this.arguments || []
      args.forEach((arg) => {
        if (arg.name === 'base') {
          this.myBase = (this[arg.prefix] || '') + (arg.value || '')
        } else if (arg.prefix) {
          paramData[arg.name] = (this.$parent?.[arg.prefix] ?? '') + (arg.value ?? '')
        } else {
          const v = arg.value
          paramData[arg.name] =
            (v === 'true' ? true : v === 'false' ? false : (Number(v) || v))
        }
      })

      // Serialize parameters once — deserialized (deep-copied) per instance in data().
      const paramDataJson = JSON.stringify(paramData)

      // ── 2. Capture lifecycle hooks / methods / computed from atvise script ─
      const atvMounted = typeof atvOptions.mounted === 'function' ? atvOptions.mounted : null
      const atvMethods = atvOptions.methods ?? {}
      const atvComputed = atvOptions.computed ?? {}

      // Self reference for "mounted-hook" pattern (visuFunc used as mounted body)
      const visuFuncRef = this.visuFunc

      // ── 3. Assemble final component options ────────────────────────────────
      return {
        template: this.replaceSubstitute(template),

        // Only the webMI mixin — it provides this.webMI, cleanup on unmount, etc.
        // The `widget` mixin is intentionally excluded: displays manage their own
        // data via BrowseNodes / OPC-UA reads in their own script; layering the
        // subscription widget mixin on top causes conflicts and noise.
        mixins: [webMI],

        // Explicit props keep the contract clear and avoid mixin conflicts.
        props: {
          base: { type: String, default: undefined },
          preview: { type: Boolean, default: false },
          hover: { type: Boolean, default: false },
          settings: { type: [Object, String], default: undefined },
          eventBus: { default: undefined }
        },

        inject: ['theme'],

        data () {
          // Call the atvise script's data() with the component instance as `this`
          // so any `this.base` / `this.xxx` references inside it resolve correctly.
          let scriptData = {}
          try {
            if (typeof atvOptions.data === 'function') {
              scriptData = atvOptions.data.call(this) ?? {}
            }
          } catch (err) {
            console.warn('[widget data] atvOptions.data() threw:', err)
          }

          // Deep-copy parameter values per instance, then merge over script defaults.
          const paramsCopy = JSON.parse(paramDataJson)
          const result = { ...scriptData, ...paramsCopy }

          // ── Pre-populate the nested `props` passthrough object ──────────────
          // Many atvise displays use a `props` data object that is spread onto a
          // child component via `<child-component v-bind="props"/>`.  Without
          // pre-population the child mounts with empty/default values and only
          // receives the real values after the parent's `mounted()` hook runs —
          // which is too late for lifecycle methods that need the data on first
          // mount (e.g. viewer.vue calls `init()` in mounted() only when
          // `this.base.length > 0`).
          if (result.props && typeof result.props === 'object') {
            // `base` comes from the component's own prop (set by atviseVisuV3).
            result.props.base = this.base ?? ''
            // All other keys: seed from parameter defaults where the key exists.
            Object.keys(result.props).forEach((key) => {
              if (key !== 'base' && Object.prototype.hasOwnProperty.call(paramsCopy, key)) {
                result.props[key] = paramsCopy[key]
              }
            })
          }

          return result
        },

        computed: {
          ...atvComputed,
          darkColor () { return this.theme?.isDark ? '#ffffff' : 'rgba(0,0,0,0.7)' },
          lightColor () { return this.theme?.isDark ? 'rgba(0,0,0,0.7)' : '#ffffff' }
        },

        methods: atvMethods,

        mounted () {
          // "Return-options" pattern: call the script's mounted hook.
          if (atvMounted) {
            try { atvMounted.call(this) } catch (err) { console.error('[widget mounted] error:', err) }
          } else if (typeof visuFuncRef === 'function') {
            // "Mounted-hook" pattern: run the script body directly with self = this.
            try { visuFuncRef.call(this, this) } catch (err) { console.error('[widget visuFunc] error:', err) }
          }
        }
      }
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
