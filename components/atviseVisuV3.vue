<template>
  <!-- <v-hover @input="onhover"> -->
  <!-- <div slot-scope="{ hover }" style="height: 100%; width: 100%;user-select:none;"> -->
  <div slot-scope="{ hover }" style="user-select:none;height:100%">
    <!-- <resize-observer @notify="handleResize" /> -->
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
      v-on="$listeners"
      @title="emitTitle"
      @timestamp="$emit('timestamp', $event)"
      @openDialog="openDialog"
      @closeDialog="closeDialog"
      @hook:mounted="$emit('mounted')"
    />
    <atvise-dialog :dialog="dialog" :config="dialogConfig" @close="dialog=false" />
  </div>
  <!-- </v-hover> -->
</template>

<script>
import Vue from 'vue'
import atviseDialog from '@/components/dialogs/atviseDialog'
import { widget } from '@/global/mixin.js'
import { APIdashboard } from '@/global/APIService.js'
// import { webMI } from '@/global/webMI_mixin_old'
const test = true
let webMI = {}
if (test) {
  import('@/global/webMI_mixin')
    .then((data) => {
      webMI = data.webMI
    })
} else {
  // import('@/global/webMI_mixin_old')
  //   .then((data) => {
  //     webMI = data.webMI
  //   })
}

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
    svg: null,
    disabled: false,
    comp: undefined,
    parameters: [],
    apiDashboard: undefined,
    hover: false,
    dialog: false,
    dialogConfig: {}
  }),
  computed: {
    innerSettings () {
      let settingsJSON
      try {
        settingsJSON = JSON.parse(this.settings)
      } catch (error) {
        settingsJSON = { widget: this.settings }
      }
      return settingsJSON
    },
    arguments () {
      try {
        if (typeof this.args === 'string') {
          return JSON.parse(this.args)
        } else {
          return this.args
        }
      } catch (error) {
      }
    },
    argumentsObj () {
      try {
        const args = this.arguments
        const obj = {}
        args.map((argument) => {
          obj[argument.name] = argument
          return argument
        })
        return obj
      } catch (error) {
        return {}
      }
    },
    parametersObj () {
      const obj = {}
      this.parameters.map((parameter) => {
        obj[parameter.name] = parameter
        return parameter
      })
      return obj
    },
    // substitutesObj () {
    //   const obj = {}
    //   this.parameters.map((parameter) => {
    //     if (parameter.substitute.length > 0) {
    //       obj[parameter.substitute] = parameter
    //       // Sjekker om vi har en override fra default verdi
    //       if (this.argumentsObj[parameter.name]) {
    //         const prefix = this.$parent.query[this.argumentsObj[parameter.name].prefix] || ''
    //         obj[parameter.substitute].value = prefix + this.argumentsObj[parameter.name].value
    //       }
    //     }
    //   })
    //   return obj
    // },
    substitutesArr () {
      const arr = []
      this.parameters.map((parameter) => {
        if (parameter.substitute) {
          // obj[parameter.substitute] = parameter
          // Sjekker om vi har en override fra default verdi
          if (this.argumentsObj[parameter.name]) {
            try {
              const prefix = this.$parent.query[this.argumentsObj[parameter.name].prefix] || ''
              parameter.value = prefix + this.argumentsObj[parameter.name].value
            } catch (error) {
              parameter.value = this.argumentsObj[parameter.name].value
            }
          }
          arr.push(parameter)
        }
        return parameter
      })
      return arr
    }
  },
  mounted () {
    this.apiDashboard = new APIdashboard(this)
    this.myBase = this.base || this.$route.query.base
    this.init()
  },
  watch: {
    base () {
      this.$nextTick(function () {
        this.myBase = this.base || this.$route.query.base
        this.init()
      })
    },
    '$route.query.base' () {
      this.myBase = this.base || this.$route.query.base
      this.init()
    },
    innerSettings (to, from) {
      this.$nextTick(function () {
        this.init()
      })
    }
  },
  methods: {
    emitTitle (event) {
      // this.$emit('title', event)
      // console.log('emitTitle', event, this)
      // this.$emit('title', event)
    },
    openDialog (config, query) {
      this.dialogConfig = config
      this.dialog = true
    },
    closeDialog () {
      this.dialogConfig = {}
      this.dialog = false
    },
    handleResize (data) {
      const width = this.$el.clientWidth
      const height = this.$el.clientHeight
      this.$emit('resize', { width, height })
    },
    onhover (val) {
      this.hover = val
    },
    init () {
      const self = this
      this.myBase = this.base || this.$route.query.base
      this.widget = Vue.component('Widget', function (resolve) {
        self.get(resolve)
      })
    },
    get (resolve) {
      this.getSVG(this.settings, true, null, resolve)
    },
    async getSVG (path, root, clone, resolve) {
      // Get widget from atvise
      const parent = document.createElement('div')
      const div1 = document.createElement('div')
      div1.style.height = '100%'
      div1.style.width = '100%'
      const div2 = document.createElement('div')
      div2.style.height = '0%'
      div2.style.width = '100%'
      const widget = await this.apiDashboard.getWidgetV4(
        this,
        this.innerSettings.widget
      )
      const doc = this.parseHTML(this.$store.getters['translation/translateText'](widget.html))
      // Find first svg (main)
      const SVG = doc.querySelector('svg')
      SVG.setAttribute('viewBox', `0 0 ${SVG.getAttribute('width')} ${SVG.getAttribute('height')}`)
      if (this.scaleToMax) {
        SVG.setAttribute('style', `height:100%;width:100%;max-width:${SVG.getAttribute('width')}px;display:block;margin:auto;`)
      } else {
        SVG.setAttribute('style', 'height:100%;width:100%;')
      }
      // SVG.setAttribute('style', 'height:100%')
      // Get all parameters
      this.parameters = this.getParams(SVG)
      // Pull script from svg
      const convertScript = (script) => {
        if (script.substr(0, 10).includes('return')) {
          script = script.replaceAll(' webMI.', ' this.webMI.')
        } else {
          // Only replace if there is not a period (.) before webMI
          script = script.replace(/(?<!\.)webMI\./g, 'self.webMI.')
          // script = script.replaceAll('webMI.', ' self.webMI.')
        }
        script = script.replaceAll('document.getElementById(\'', 'self.$el.querySelector(\'#')
        script = script.replaceAll('document.getElementById("', 'self.$el.querySelector("#')
        script = script.replaceAll('document.', 'self.$el.')
        // script = top.webMI.unescapeHTML(script)
        return script
        // // script = 'var self = this\n' + this.htmlDecode(script)
        // script = this.htmlDecode(script)
        // scriptTxt += script
      }
      const translatedScript = this.$store.getters['translation/translateText'](widget.script)
      const scriptTxt = 'var self = this\n' + convertScript(translatedScript)
      // let scriptTxt = 'var self = this\n'
      doc.querySelectorAll('script').forEach((node) => {
        // let script = node.innerHTML || ''
        // script = script.replace('<![CDATA[', '').replace(']]>', '')
        node.remove()
        // if (script.substr(0, 10).includes('return')) {
        //   script = script.replaceAll(' webMI.', 'this.webMI.')
        // } else {
        //   script = script.replaceAll('webMI.', 'self.webMI.')
        // }
        // script = script.replaceAll('document.getElementById(\'', 'self.$el.querySelector(\'#')
        // script = script.replaceAll('document.getElementById("', 'self.$el.querySelector("#')
        // script = script.replaceAll('document.', 'self.$el.')
        // // script = 'var self = this\n' + top.webMI.unescapeHTML(script)
        // // script = 'var self = this\n' + this.htmlDecode(script)
        // script = this.htmlDecode(script)
        // scriptTxt += script
      })
      // eslint-disable-next-line no-new-func
      this.visuFunc = new Function('self', scriptTxt)
      // if (scriptNode) {
      //   let script = scriptNode.innerHTML || ''
      //   script = script.replace('<![CDATA[', '').replace(']]>', '')
      //   scriptNode.remove()
      //   console.log(script)
      //   if (script.substr(0, 10).includes('return')) {
      //     script = script.replaceAll(' webMI.', 'this.webMI.')
      //   } else {
      //     script = script.replaceAll('webMI.', 'self.webMI.')
      //   }
      //   script = script.replaceAll('document.getElementById(\'', 'self.$el.querySelector(\'#')
      //   script = script.replaceAll('document.getElementById("', 'self.$el.querySelector("#')
      //   script = script.replaceAll('document.', 'self.$el.')
      //   // script = 'var self = this\n' + top.webMI.unescapeHTML(script)
      //   script = 'var self = this\n' + this.htmlDecode(script)
      //   // eslint-disable-next-line no-new-func
      //   this.visuFunc = new Function('self', script)
      // }
      SVG.querySelectorAll('svg').forEach((svg) => {
        // Erstatter alle svg med foreign element
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        const transform = svg.getAttribute('transform')
        if (transform) { g.setAttribute('transform', transform) }
        g.setAttribute('id', svg.getAttribute('id'))
        g.setAttribute('height', svg.getAttribute('height'))
        g.setAttribute('width', svg.getAttribute('width'))
        const foreign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
        foreign.setAttribute('x', svg.getAttribute('x'))
        foreign.setAttribute('y', svg.getAttribute('y'))
        foreign.setAttribute('height', svg.getAttribute('height'))
        foreign.setAttribute('width', svg.getAttribute('width'))
        g.appendChild(foreign)
        svg.parentNode.appendChild(g)
        const atVisu = document.createElement('atvise-visu-v3')
        atVisu.setAttribute('settings', `${svg.getAttribute('xlink:href')}`)
        atVisu.setAttribute('args', JSON.stringify(this.getParams(svg, 'atv:argument')))
        atVisu.setAttribute('overwrites', JSON.stringify(this.getParams(svg, 'atv:overwrite')))
        // atVisu.setAttribute('v-on:title', '$emit("title",$event)')
        atVisu.setAttribute('v-bind:base', 'base')
        // atVisu.setAttribute('v-bind', 'query2')
        foreign.appendChild(atVisu)
        svg.remove()
      })
      SVG.querySelectorAll('[id]').forEach((node) => {
        const id = node.getAttribute('id')
        node.setAttribute('ref', id)
        // if (id !== 'html') {
        //   node.removeAttribute('id')
        // }
      })
      div1.appendChild(SVG)
      // console.log(SVG)
      const html = SVG.querySelector('#html')

      if (html) {
        if (html.tagName === 'foreignObject') {
          div2.appendChild(html.firstElementChild)
        } else {
          div2.appendChild(html.querySelector('foreignObject').firstElementChild)
        }
        const height1 = parseInt(SVG.getAttribute('height'))
        let height2 = parseInt(html.getAttribute('height'))
        if (html.getAttribute('transform')) {
          const transform = html.getAttribute('transform').split('(')[1].split(')')[0].split(',') // matrix(1,0,0,1,0,0) => [1,0,0,1,0,0]
          const transY = transform[3]
          height2 = parseInt(height2 * transY)
        }
        const div2Height = (100 / height1) * height2
        if (div2Height === 100) {
          div1.style.display = 'none'
        }
        div1.style.height = `${100 - div2Height}%`
        div2.style.height = `${div2Height}%`
        SVG.setAttribute('viewBox', `0 0 ${SVG.getAttribute('width')} ${height1 - height2}`)
        // html.remove()
      }
      // Må fjerne visibility (hvor det er visible) fra alle elementer. Hvis ikke vil de fortsatt være synlig selv om parent element er satt hidden
      // const elements = div2.querySelectorAll('[visibility="hidden"]')
      // const arr = Array.from(elements)
      // arr.forEach((element) => {
      //   element.removeAttribute('visibility')
      // })
      parent.appendChild(div1)
      parent.appendChild(div2)
      const vueComp = this.test2(parent)
      vueComp.name = 'widget'
      resolve(vueComp)
      // this.parameters = data.parameter.parameters
      // // Hvis widget inneholder forreign element og første div har ref="html", så skal kun html del brukes i widget. Ikke SVG
      // let isHtml
      // if (data.html) {
      //   const tempDiv = document.createElement('div')
      //   tempDiv.innerHTML = data.html
      //   const first = tempDiv.firstChild
      //   const ref = first.getAttribute('ref')
      //   isHtml = ref === 'html'
      // }

      // if (isHtml) {
      //   parent.innerHTML = data.html
      // } else {
      //   const rep = this.replaceSubstitute(data.svg)
      //   let mySVG = self.parseSVG(rep)
      //   // let mySVG = self.parseSVG(data.svg)
      //   mySVG = mySVG.getElementsByTagName('svg')
      //   mySVG[0].querySelectorAll('svg[transform]').forEach((svg) => {
      //     // console.log('SVG', svg)
      //     const g = document.createElement('g')
      //     const transform = svg.getAttribute('transform')
      //     g.setAttribute('transform', transform)
      //     svg.removeAttribute('transform')
      //     svg.parentElement.appendChild(g).appendChild(svg)
      //   })
      //   // eslint-disable-next-line no-new-object
      //   mySVG = new Object(mySVG[0])
      //   parent.appendChild(mySVG)
      // }
    },
    replaceSubstitute (text) {
      let temp = text
      this.substitutesArr.map((sub) => {
        temp = temp.replaceAll(sub.substitute, sub.value || sub.defaultvalue)
        return sub
      })
      return temp
    },
    // translate (text) {
    //   let temp = text
    //   // eslint-disable-next-line no-useless-escape
    //   const arr = Array.from(text.matchAll(/\T{([^}]+)\}/g))
    //   arr.map((trans) => {
    //     const source = trans[0]
    //     const translation = this.$store.getters['translation/getTranslation'](trans[1])
    //     temp = temp.replaceAll(source, translation)
    //     return translation
    //   })
    //   return temp
    // },
    parseSVG (doc) {
      const parser = new DOMParser()
      return parser.parseFromString(doc, 'image/svg+xml')
    },
    parseHTML (doc) {
      const parser = new DOMParser()
      return parser.parseFromString(doc, 'text/html')
    },
    parseSVGtoString (doc) {
      const oSerializer = new XMLSerializer()
      return oSerializer.serializeToString(doc)
    },
    visuFunc () {},
    /**
     * Henter liste over underliggende noder på svg f.eks atv:parameter og atv:argument
     */
    getParams (svg, _type) {
      const type = _type || 'atv:parameter'
      const parameters = []
      const el = svg.getElementsByTagName(type)
      for (let e = 0; e < el.length; e++) {
        const params = {}
        for (let i = 0; i < el[e].attributes.length; i++) {
          const name = el[e].attributes[i].name
          let value = el[e].attributes[i].value

          if (value === undefined) {
            // console.log('name:', name)
            // console.log('value:', el[e].attributes[i].value)
            // console.log(this.argumentsObj)
            value = this.argumentsObj[el[e].attributes[i].value].value
          }
          params[name] = value
        }
        parameters.push(params)
      }
      return parameters
    },
    setSubstitutes (svg, params) {
      for (const e in params) {
        for (const i in params[e]) {
          if (i === 'substitute') {
            const test = params[e][i].replace(/\$/g, '\\$')
            svg.innerHTML = svg.innerHTML.replace(
              new RegExp(test, 'g'),
              params[e].defaultvalue
            )
          }
        }
      }
      return svg
    },
    getSetting (val) {
      switch (val.valuetype) {
        case 'bool':
          return val.defaultvalue === 'true'
        // break;
        case 'number':
          return Number(val.defaultvalue)
        // break;
        default:
          return val.defaultvalue
        // break;
      }
    },
    test2 (doc) {
      // Get the function
      // console.log('visuFunc:', this.visuFunc)
      let options
      try {
        if (!this.preview) {
          options = this.visuFunc()
        }
      } catch (error) {
        // console.log(error)
        options = undefined
      }

      if (!options) {
        options = {
          data () {
            return {}
          },
          // Hack!! JRA 10.11.2021
          created () {
            // if (!this.base) {
            //   this.base = this.$lodash.clone(this.query.base)
            // }
          },
          mounted: this.visuFunc
        }
      }
      const funcData = options.data()
      options.template = this.replaceSubstitute(this.parseSVGtoString(doc))
      options.template = options.template.replaceAll('stroke="#000001"', 'v-bind:stroke="darkColor"')
      options.template = options.template.replaceAll('fill="#000001"', 'v-bind:fill="darkColor"')
      options.template = options.template.replaceAll('stroke="#ffffe"', 'v-bind:stroke="lightColor"')
      options.template = options.template.replaceAll('fill="#fffffe"', 'v-bind:fill="lightColor"')
      options.mixins = [widget, webMI]
      // options.mixins = [widget]

      if (this.parameters) {
        const params = this.parameters
        // this.$emit('parameters', params)
        for (const i in params) {
          if (params[i].name !== 'darkColor' && params[i].name !== 'lightColor') {
            // console.log('param:', params[i].name)
            funcData[params[i].name] = this.getSetting(params[i])

            // Setter parameter fra settings
            // if (this.innerSettings) {
            //   if (this.innerSettings[params[i].name]) {
            //     funcData[params[i].name] = this.innerSettings[params[i].name]
            //   }
            // }
          }
        }
      }

      // add new values
      if (this.arguments) {
        // console.log('args:', this.args)
        // const args = JSON.parse(this.args)
        const args = this.arguments
        for (const ii in args) {
          if (args[ii].name === 'base') {
            this.myBase = this[args[ii].prefix] || ''
            this.myBase += args[ii].value || ''
          } else {
            const prefix = args[ii].prefix || undefined
            if (prefix) {
              // If prefix is set use value from parent
              funcData[args[ii].name] = this.$parent[prefix] + (args[ii].value || '')
            } else {
              funcData[args[ii].name] =
                Number(args[ii].value) ||
                (args[ii].value === 'true'
                  ? true
                  : args[ii].value === 'false'
                    ? false
                    : undefined) ||
                args[ii].value
            }
          }
        }
      }

      // Pack the data as a return in a function
      const str = 'return ' + JSON.stringify(funcData)
      // eslint-disable-next-line no-new-func
      options.data = new Function('', str)
      return options
    },
    htmlDecode (input) {
      const doc = new DOMParser().parseFromString(input, 'text/html')
      return doc.documentElement.textContent
    }
  }
}

export default options
</script>

<style>

</style>
