import { defineNuxtPlugin } from '#app'

type BrowseFilter = {
  startAddress: string
  endLevel?: number
  vTypes?: string[]
  includeStartAddress?: boolean
  mapping?: string[]
}

type BrowseResponse = Record<string, any>

function toArray (obj: any): any[] {
  if (obj === null || obj === undefined) {
    return []
  }
  return Object.keys(obj).map((key) => obj[key])
}

function browse (filter: BrowseFilter, toArrayFlag = false): Promise<BrowseResponse | BrowseResponse[]> {
  return new Promise((resolve) => {
    top.webMI.data.call('BrowseNodes', {
      startAddress: filter.startAddress,
      endLevel: filter.endLevel ?? 1,
      vTypes: filter.vTypes ?? [],
      includeStartAddress: filter.includeStartAddress ?? false,
      mapping: filter.mapping ?? ['nodeid:nodeid:splitnamespace', 'browsename:browsename', 'typedefinition:typedefinition:splitnamespace', 'displayname:displayname', 'description:description']
    }, (data: BrowseResponse) => {
      if (toArrayFlag) {
        let items = toArray(data)
        if (items[0]?.index >= 0) {
          items = items.sort((a, b) => a.index - b.index)
        }
        resolve(items)
      } else {
        resolve(data)
      }
    })
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('browse', browse)
  nuxtApp.vueApp.config.globalProperties.$browse = browse
})
