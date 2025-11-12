import { defineNuxtPlugin } from '#app'
import { defineAsyncComponent } from 'vue'
import { loadModule } from 'vue3-sfc-loader'

function hex2String (hexString: string) {
  const raw = hexString.replace(/ /g, '')
  const bytes = new Uint8Array(raw.length / 2)
  for (let i = 0, j = 0; i < raw.length; i += 2, j++) {
    bytes[j] = parseInt(raw.substr(i, 2), 16)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

function capitalizeFirstLetter (value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function createName (id: string) {
  const temp = id.replace('SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents/', '').replace('.vue', '').split('/')
  const arr = temp.map((item) => capitalizeFirstLetter(item))
  return arr.join('')
}

function flattenVueComponentNamesWithCleanup (obj: Record<string, any>) {
  const flatArray: string[] = []

  function traverse (node: any) {
    if (node.name && node.name.endsWith('.vue')) {
      const cleanedName = node.name.replace(/SYSTEM\.LIBRARY\.(ATVISE|PROJECT)\.RESOURCES\/vueComponents\//g, '')
      if (!/\/_/.test(cleanedName) && !cleanedName.startsWith('_')) {
        flatArray.push(cleanedName)
      }
    }

    if (node.childs) {
      Object.keys(node.childs).forEach((childKey) => {
        traverse(node.childs[childKey])
      })
    }
  }

  Object.keys(obj || {}).forEach((key) => {
    traverse(obj[key])
  })

  return flatArray
}

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp

  const options = {
    moduleCache: { vue: vueApp },
    getFile: (filename: string) => {
      return new Promise((resolve) => {
        top.webMI.data.read(`SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents/${filename}`, (data: any) => {
          resolve(hex2String(data.value))
        })
      })
    },
    addStyle: (textContent: string) => {
      const style = Object.assign(document.createElement('style'), { textContent })
      const ref = document.head.getElementsByTagName('style')[0] || null
      document.head.insertBefore(style, ref)
    }
  }

  const registerComponent = (nodeId: string) => {
    const name = createName(nodeId)
    const component = defineAsyncComponent(() => loadModule(nodeId, options))
    vueApp.component(name, component)
  }

  const browse = () => {
    top.webMI.data.call('BrowseNodes', {
      startAddress: 'SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents',
      endLevel: 0,
      vTypes: ['VariableTypes.ATVISE.Resource.OctetStream', 'i=61']
    }, (res: Record<string, any>) => {
      if (!res) { return }
      const data = flattenVueComponentNamesWithCleanup(res)
      data.forEach((nodeid) => registerComponent(`SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents/${nodeid}`))
    })
  }

  setTimeout(() => {
    browse()
  }, 2000)
})
