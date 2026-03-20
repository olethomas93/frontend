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
import { defineAsyncComponent } from 'vue'
import atviseDialog from '@/components/dialogs/atviseDialog'
import { widget } from '@/global/mixin.js'

let webMI = {}
import('@/global/webMI_mixin').then((data) => {
  webMI = data.webMI
})

const options = {
  inject: ['theme'],
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
      this.widget = defineAsyncComponent(() => new Promise((resolve) => {
        this.loadWidget(resolve)
      }))
    },

    async loadWidget (resolve) {
      // Fetch the pre-processed template from the server.
      // All DOM parsing and SVG transformation happens in server/api/webmi/widget-template.post.ts
      // using linkedom — no DOMParser needed here.
      const { template, script, parameters } = await $fetch('/api/webmi/widget-template', {
        method: 'POST',
        body: {
          widget: this.innerSettings.widget,
          scaleToMax: this.scaleToMax
        }
      })

      this.parameters = parameters

      // Apply client-side translations (requires Pinia store — cannot run on server)
      const translatedTemplate = this.$store.getters['translation/translateText'](template)
      const translatedScript = this.$store.getters['translation/translateText'](script)

      // Build the widget's behaviour function from the processed script
      // eslint-disable-next-line no-new-func
      this.visuFunc = new Function('self', 'var self = this\n' + translatedScript)

      const vueComp = this.buildComponent(translatedTemplate)
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
