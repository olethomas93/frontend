import Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader/dist/vue2-sfc-loader.esm.js'
console.log('----------------------------SFC LOADER loaded!!--------------------------------------------------')
const options = {
  moduleCache: { vue: Vue },
  getFile: (filename) => {
    return new Promise((resolve) => {
      // console.log('filename: ', filename)
      top.webMI.data.read(`SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents/${filename}`, (data) => {
        resolve(hex2String(data.value))
      })
    })
  },
  addStyle: (textContent) => {
    const style = Object.assign(document.createElement('style'), { textContent })
    const ref = document.head.getElementsByTagName('style')[0] || null
    document.head.insertBefore(style, ref)
  }
}

// function browse () {
//   top.webMI.data.call('JMH_GetVueComponents', {}, (data) => {
//     for (const i in data) {
//       const nodeid = data[i]
//       // console.log(nodeid)
//       const name = createName(nodeid)
//       // loadModule(nodeid, options).then((component) => {
//       //   Vue.component(capitalizeFirstLetter(name), component)
//       // })
//       Vue.component(name, Vue.defineAsyncComponent(() => loadModule(nodeid, options)))
//     }
//   })
// }
function browse () {
  top.webMI.data.call('BrowseNodes', {
    startAddress: 'SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents',
    endLevel: 0,
    vTypes: ['VariableTypes.ATVISE.Resource.OctetStream', 'i=61']
  }, (res) => {
    if (!res) {
      return
    }
    const data = flattenVueComponentNamesWithCleanup(res)
    for (const i in data) {
      const nodeid = data[i]
      // console.log(nodeid)
      const name = createName(nodeid)
      // loadModule(nodeid, options).then((component) => {
      //   Vue.component(capitalizeFirstLetter(name), component)
      // })
      Vue.component(name, Vue.defineAsyncComponent(() => loadModule(nodeid, options)))
    }
  })
}

function flattenVueComponentNamesWithCleanup (obj) {
  const flatArray = []

  function traverse (node) {
    // Sjekk om nøkkelen eksisterer og slutter på .vue
    if (node.name && node.name.endsWith('.vue')) {
      // Fjerner de spesifikke delene fra strengen
      const cleanedName = node.name.replace(/SYSTEM\.LIBRARY\.(ATVISE|PROJECT)\.RESOURCES\/vueComponents\//g, '')

      // Sjekker om det rensede navnet ikke inneholder en underscore i begynnelsen av noen del av stien
      if (!/\/_/.test(cleanedName) && !cleanedName.startsWith('_')) {
        flatArray.push(cleanedName) // Legger til det rensede navnet hvis det ikke starter med eller inneholder en underscore i begynnelsen av en sti-del
      }
    }

    // Hvis det finnes barn, gå gjennom hvert barn rekursivt
    if (node.childs) {
      Object.keys(node.childs).forEach((childKey) => {
        traverse(node.childs[childKey])
      })
    }
  }

  // Start traversering fra roten av objektet
  Object.keys(obj).forEach((key) => {
    traverse(obj[key])
  })

  return flatArray
}

// // Definer objektet ditt her
// const obj = {
//   'ServerTime.vue': {
//     childs: null,
//     name: 'SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents/ServerTime.vue',
//     text: 'ServerTime.vue'
//   },
//   'buttons.vue': {
//     childs: null,
//     name: 'SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents/buttons.vue',
//     text: 'buttons.vue'
//   }
//   // Legg til resten av objektstrukturen her
// }

// const flatArray = flattenVueComponentNamesWithCleanup(obj)
// console.log(flatArray)
setTimeout(() => {
  browse()
}, 2000)

function createName (id) {
  const temp = id.replace('SYSTEM.LIBRARY.ATVISE.RESOURCES/vueComponents/', '').replace('.vue', '').split('/')
  const arr = temp.map((item) => {
    return capitalizeFirstLetter(item)
  })
  return arr.join('')
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function hex2String (hexString) {
  const raw = hexString.replace(/ /g, '')
  const bytes = new Uint8Array(raw.length / 2)
  for (let i = 0, j = 0; i < raw.length; i += 2, j++) {
    bytes[j] = parseInt(raw.substr(i, 2), 16)
  }
  return new TextDecoder('utf-8').decode(bytes)
}
