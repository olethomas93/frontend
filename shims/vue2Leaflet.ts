type VueInstance = {
  mapObject?: any
  $parent?: VueInstance | null
  $watch?: (exp: string, cb: (val: any, oldVal: any) => void, options?: Record<string, any>) => void
}

/**
 * Traverses up the component tree to find the first ancestor that exposes a Leaflet mapObject.
 */
export const findRealParent = (parent?: VueInstance | null): VueInstance | undefined => {
  if (!parent) { return undefined }
  if (parent.mapObject) {
    return parent
  }
  if (parent.$parent) {
    return findRealParent(parent.$parent)
  }
  return undefined
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

/**
 * Basic implementation of the vue2-leaflet prop binder that keeps Leaflet layer props in sync.
 */
export const propsBinder = (vueElement: VueInstance & Record<string, any>, leafletElement: any, props: Record<string, any>) => {
  if (!vueElement || !leafletElement || !props) { return }
  Object.keys(props).forEach((key) => {
    if (!vueElement.$watch) { return }
    vueElement.$watch(key, (newVal) => {
      const setter = `set${capitalize(key)}`
      if (typeof leafletElement[setter] === 'function') {
        leafletElement[setter](newVal)
      } else {
        leafletElement.options = leafletElement.options || {}
        leafletElement.options[key] = newVal
      }
    }, { deep: true })
  })
}

export default {
  findRealParent,
  propsBinder
}
