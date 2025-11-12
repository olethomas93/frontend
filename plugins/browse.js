export default ({ app }, inject) => {
  inject('browse', browse)
}

function browse (filter, toArray = false) {
  return new Promise((resolve) => {
    top.webMI.data.call('BrowseNodes', {
      startAddress: filter.startAddress,
      endLevel: filter.endLevel || 1,
      vTypes: filter.vTypes || [],
      includeStartAddress: filter.includeStartAddress || false,
      mapping: filter.mapping || ['nodeid:nodeid:splitnamespace', 'browsename:browsename', 'typedefinition:typedefinition:splitnamespace', 'displayname:displayname', 'description:description']
      // mapping: ['nodeid:nodeid:splitnamespace', 'name:browsename', 'TypeDefinition:typedefinition:splitnamespace', 'datatype:datatype', 'displayname:displayname', 'description:description', 'value:value']
    }, (data) => {
      // if (recursive) {
      //   data = _toArray(data)
      //   const test = []
      //   startTraverse(data[0], 'childs', (data) => {
      //     test.push(data)
      //   })
      //   resolve(test)
      // } else {
      //   // for (const i in data) {
      //   //   data[i].name = this.getName(data[i])
      //   //   data[i].desc = await this.read(data[i].nodeid + '.beskrivelse') || await this.read(data[i].nodeid + '.betjener')
      //   //   data[i].display = this.getDisplay(data[i], this.display)// this.display.includes('ObjectTypes') || this.display.includes('AGENT')  ? this.display : data[i].nodeid + '.' + this.display
      //   //   arr.push(data[i])
      //   // }
      //   // this.items = arr
      // }
      if (toArray) {
        let items = _toArray(data)
        if (items[0].index >= 0) {
          items = items.sort((a, b) => { return a.index - b.index })
        }
        resolve(items)
      } else {
        resolve(data)
      }
    })
  })
}

function _toArray (obj) {
  const arr = []
  if (obj === null) {
    return []
  }
  Object.keys(obj).forEach((data) => {
    arr.push(obj[data])
  })
  return arr
}

// function startTraverse (parent, childkey, cb) {
//   const node = parent
//   const child = childkey
//   node[child] = _toArray(node[child])
//   for (let i = 0; i < node[child].length; i++) {
//     // cb(node);
//     traverse(node[child][i])
//   }
//   function traverse (childnode) {
//     childnode[child] = _toArray(childnode[child])
//     if (childnode[child].length === 0) {
//       cb(childnode)
//       return
//     }
//     for (let j = 0; j < childnode[child].length; j++) {
//       cb(childnode)
//       traverse(childnode[child][j])
//     }
//   }
// }
