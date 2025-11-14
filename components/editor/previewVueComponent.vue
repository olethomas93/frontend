<template>
  <div>
    <component
      :is="widget"
      v-if="widget"
      :base="base"
    />
  </div>
</template>
<script>
import { defineAsyncComponent } from 'vue'
import * as VueRuntime from 'vue'
import { loadModule } from 'vue3-sfc-loader'

export default {
  props: {
    base: {
      type: String,
      default: undefined
    },
    component: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      widget: undefined,
      options: {
        moduleCache: { vue: VueRuntime },
        getFile: (filename) => {
          return new Promise((resolve) => {
            console.log('filename: ', filename)
            top.webMI.data.read(`SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents/${filename}`, (data) => {
              console.log(data)
              resolve(this.hex2String(data.value))
            })
          })
        },
        addStyle: (textContent) => {
          const existingStyle = document.getElementById('preview')

          if (existingStyle) {
            // Hvis et style-element med samme id allerede eksisterer, fjern det
            existingStyle.parentNode.removeChild(existingStyle)
          }
          const style = Object.assign(document.createElement('style'), { textContent })
          style.id = 'preview'
          const ref = document.head.getElementsByTagName('style')[0] || null
          document.head.insertBefore(style, ref)
        },
        async handleModule (type, getContentData, path, options) {
          switch (type) {
            case '.css':
              options.addStyle(await getContentData(false))
              return null
            case '.js':
              return getContentData(true)
          }
        }
      }
    }
  },
  mounted () {
    this.getCode()
  },
  destroyed () {
    top.webMI.data.unsubscribe(this.sub)
  },
  methods: {
    hex2String (hexString) {
      const raw = hexString.replace(/ /g, '')
      const bytes = new Uint8Array(raw.length / 2)
      for (let i = 0, j = 0; i < raw.length; i += 2, j++) {
        bytes[j] = parseInt(raw.substr(i, 2), 16)
      }
      return new TextDecoder('utf-8').decode(bytes)
    },
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    createName (id) {
      const temp = id.replace('SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents/', '').replace('.vue', '').split('/')
      const arr = temp.map((item) => {
        return this.capitalizeFirstLetter(item)
      })
      return arr.join('')
    },
    getCode () {
      const nodeid = this.component
      this.widget = undefined
      const asyncComponent = () => loadModule(nodeid, this.options)
      this.widget = defineAsyncComponent(asyncComponent)
    }
  }
}
</script>
