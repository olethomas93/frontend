import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import Lodash from 'lodash'
import * as THREE from 'three'
import 'vue-resize/dist/vue-resize.css'
import VueResize from 'vue-resize'

Object.defineProperty(Vue.prototype, '$lodash', { value: Lodash })
Vue.use(Lodash)
// Vue.component('l-custom', CustomMarker)
// import av alle widgets til dashboard, https://vuejs.org/v2/guide/components-registration.html#Automatic-Global-Registration-of-Base-Components
const requireComponent = require.context(
  // The relative path of the components folder
  '@/components/widgets',
  // Whether or not to look in subfolders
  true,
  // The regular expression used to match base component filenames
  /// Base[A-Z]\w+\.(vue|js)$/
  /[a-zA-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach((fileName) => {
  // Get component config
  const componentConfig = requireComponent(fileName)
  // Get PascalCase name of comp onent
  let componentName = // upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  // )
  const fileArr = fileName.split('/')
  const name1 = fileArr.pop()
  const name2 = fileArr.pop()

  // if component is in folder below widgets add folder name to component name
  if (name2 === 'widgets') {
    componentName = camelCase(name1.replace(/\.\w+$/, ''))
  } else {
    componentName = camelCase((name2 + upperFirst(name1)).replace(/\.\w+$/, ''))
  }

  // Register component globally
  // console.log('component name:', componentName)
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})

Object.defineProperty(Vue.prototype, '$three', { value: THREE })
Vue.use(THREE)

Vue.use(VueResize)
