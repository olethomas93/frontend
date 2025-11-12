
export class APIdashboard {
  constructor (vm) {
    this.vm = vm
    this.socket = vm.$socket
    this.init()
  }

  init () {
    this.locationId = this.vm.$route.params.id
    this.customerId = this.vm.$route.params.customerId
    // this.customerId = 'leroy_aurora'
    this.baseUrl = '/api/v2'
  }

  async getDashboards () {
    this.locationId = this.vm.$route.params.id
    this.customerId = this.vm.$route.params.customerId
    const urlPart = this.locationId ? `${this.customerId}/locations/${this.locationId}/dashboard` : `${this.customerId}/dashboard`
    const { data } = await this.vm.$axios.get(`${this.baseUrl}/customers/${urlPart}`)
    return data
  }

  getDashboard (dash) {
    return new Promise((resolve) => {
      const test = top.webMI.data.read(dash, function (data) {
        resolve(data.value)
      })
      console.log(test)
    })
    // const { data } = await this.vm.$axios.get(`${this.baseUrl}${this.vm.$route.path}`)
    // return data.dash.value.value
  }

  updateDashboard (dash) {
    return new Promise((resolve) => {
      // const customerId = 'leroy_aurora'
      // const locationId = this.vm.$route.params.id
      const dashId = this.vm.$route.params.dashboard
      const nodes = [
        {
          nodeId: `dashboards.${dashId}.dash`, // `ns=1;s=AGENT.OBJECTS.customers.${customerId}.${locationId}.dashboards.${dashId}.dash`,
          dataType: 'String',
          value: dash
        }
      ]
      this.socket.emit('write_v2', { nodes, customerId: this.customerId, locationId: this.locationId }, (test, data) => {
      })
    })
  }

  async getWidget (vm, display) {
    const { data } = await this.vm.$axios.get(`${this.baseUrl}/customers/${this.customerId}/locations/${this.locationId}/widget/${display}`)
    return data
  }

  getWidgetV4 (vm, display) {
    return new Promise((resolve) => {
      const widget = display
      top.webMI.data.customRequest('GET', `/customScripts/CtrlGetWidget?widget=${widget}`, (data) => {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty('script')) {
          resolve(data)
        } else {
          resolve({ html: data.result })
        }
      })
      // top.webMI.data.call('JMH_getWidget', { widget }, (data) => {
      //   // eslint-disable-next-line no-prototype-builtins
      //   if (data.hasOwnProperty('script')) {
      //     resolve(data)
      //   } else {
      //     resolve({ html: data.result })
      //   }
      // })
    })
    // return new Promise((resolve) => {
    //   top.webMI.data.read(decodeURIComponent(display), (data) => {
    //     resolve({ html: data.value })
    //   })
    // })
    // const { data } = await this.vm.$axios.get(`${this.baseUrl}/customers/${this.customerId}/locations/${this.locationId}/widget/*${display}`)
    // return data
  }
}

export class APIservice {
  constructor (vm) {
    this.vm = vm
    this.socket = vm.$socket
    this.init()
  }

  init () {
    this.locationId = this.vm.$route.params.id
    this.customerId = this.vm.$route.params.customerId
    this.baseUrl = '/api/v2'
  }

  /**
   *
   * @param {*} nodes
   * @param {*} locationId
   */
  read (nodes, locationId, commonData = false) {
    console.log(nodes)
    return new Promise((resolve) => {
      top.webMI.data.read(nodes, (data) => {
        resolve(data)
      })
    })
    // if (!commonData) {
    //   const { data } = await this.vm.$axios.get(`${this.baseUrl}/customers/${this.customerId}/locations/${locationId || this.locationId}/opcua/${nodes}`)
    //   return data
    // } else {
    //   const { data } = await this.vm.$axios.get(`${this.baseUrl}/customers/${this.customerId}/opcua/data/read/${nodes}`)
    //   return data
    // }
  }

  /**
   *
   * @param {nodeId, dataType, value} nodes
   */
  async write (nodes, commonData = false) {
    if (!commonData) {
      const { data } = await this.vm.$axios.post(`${this.baseUrl}/customers/${this.customerId}/locations/${this.locationId}/opcua/data/write`, nodes)
      return data
    } else {
      const { data } = await this.vm.$axios.post(`${this.baseUrl}/customers/${this.customerId}/opcua/data/write`, nodes)
      return data
    }
    // return new Promise((resolve, reject) => {
    //   this.socket.emit('write_v2', { nodes, locationId: this.locationId, customerId: this.customerId }, (error, data) => {
    //     // console.log(error)
    //     if (error) {
    //       reject(error)
    //     }
    //     resolve(data)
    //   })
    // })
  }

  async getHistoryNumeric ({ node, variable, from, to }) {
    try {
      // const dateFrom = '2021-04-01'
      // const dateTo = '2021-04-10'
      return await this.vm.$axios.get(`${this.baseUrl}/customers/${this.customerId}/locations/${this.locationId}/units/${node}/history/numeric/${variable}/${from}/${to}`)
    } catch (error) {
      const err = error
      return err
    }
  }

  async getHistoryBinary ({ node, variable, from }) {
    try {
      console.log('get history binary')
      return await this.vm.$axios.get(`${this.baseUrl}/customers/${this.customerId}/locations/${this.locationId}/units/${node}/history/binary/${variable}/${from}`)
    } catch (error) {
      const err = error
      return err
    }
  }

  // Henter total antall kilo på flåte, historisk
  async getSilosHistory ({ from, to }) {
    // Check date type
    return await this.vm.$axios.get(`${this.baseUrl}/customers/${this.customerId}/locations/${this.locationId}/silos/history/${from}/${to}`)
  }

  adminWrite (nodes) {
    return new Promise((resolve, reject) => {
      this.socket.emit('write_v3', { nodes }, (error, data) => {
        if (error) {
          reject(error)
        }
        resolve(data)
      })
    })
  }

  readAllAttributes (nodes) {
    return new Promise((resolve) => {
      this.socket.emit('readAllAttributes', { nodes, locationId: this.locationId }, (test, data) => {
        resolve(data)
      })
    })
  }

  browse (data) {
    return new Promise((resolve) => {
      data.locationId = this.locationId
      data.customerId = this.customerId
      this.socket.emit('browse_v2', data, (test, result) => {
        for (const i in result) {
          result[i].children = []
          result[i].key = parseInt(Math.random() * 100000) // Genererer unik id for bruk i treeview, kan ikke bruke base da den ikke er unik på elementer som er shared.
          if (data.nodeId) {
            result[i].parent = data.nodeId
          }
        }
        resolve(result)
      })
    })
  }

  getCustomers () {
    return this.vm.$axios.get(`${this.baseUrl}/customers`)
  }

  getLocations (customerId) {
    customerId = customerId || this.customerId
    console.log('get locations***********************************************************')
    const data = this.vm.$axios.get(`${this.baseUrl}/customers/${customerId}/locations`)
    return data
  }

  async getUnits (address, endLevel = 1, vTypes = [], subtype = false) {
    const query = this.vm.$route.query
    const parameters = JSON.parse(query.parameters)
    let base
    if (parameters) {
      base = parameters.base
    }
    const ret = await this.browseNodes(base, endLevel, vTypes, subtype)
    return ret.map((node) => {
      return {
        type_definition: node.TypeDefinition,
        id: node.nodeid,
        name: node.name
      }
    })
    // debugger
    // return ret
    // const { data } = await this.vm.$axios.get(`${this.baseUrl}/customers/${this.customerId}/locations/${this.locationId}/units`)
    // return data
  }

  browseNodes (address, endLevel = 0, vTypes = [], subtype = false) {
    return new Promise((resolve, reject) => {
      top.webMI.data.call('BrowseNodes', { startAddress: 'ns=1;s=' + address, endLevel, vTypes, subtype, mapping: ['nodeid:nodeid:splitnamespace', 'name:browsename', 'TypeDefinition:typedefinition:splitnamespace'] }, (data) => {
        const arr = this.objToArr(data)
        resolve(arr)
      })
    })
  }

  objToArr (data) {
    const arr = []
    for (const i in data) {
      data[i].childs = data[i].childs !== 'ondemand' ? this.objToArr(data[i].childs) : []
      arr.push(data[i])
    }
    return arr
  }

  getSiloHistory (unit, from, to) {
    // Check format
    if (typeof from === 'object') {
      // lets format the timestamp
      from = this.vm.$moment(from).format('YYYY-MM-DD')
      to = this.vm.$moment(to).format('YYYY-MM-DD')
    }
    // const { data } = await this.vm.$axios.get(`${this.baseUrl}/customers/${this.customerId}/locations/${this.locationId}/silos/history/${from}/${to}`)
    const data = []
    if (data.length !== 0) {
      // const consumption = JSON.parse(data[0].outputArguments[3].value[0].value)
      // const fill = JSON.parse(data[0].outputArguments[3].value[1].value)
      const kg = data
      return [kg, [], []]
    } else {
      return []
    }
  }

  getSilosTotal (unit) {
    return new Promise((resolve) => {
      // this.socket.emit('getSilosTotal', { customerId: this.customerId, locationId: this.locationId, unit }, (test, data) => {
      //   const kg = JSON.parse(data[0].outputArguments[3].value[0].value)
      //   const today = JSON.parse(data[0].outputArguments[3].value[1].value)
      //   const yesterday = JSON.parse(data[0].outputArguments[3].value[2].value)
      //   resolve([kg, today, yesterday])
      // })
    })
  }

  // browseLocation () {
  //   return new Promise((resolve) => {
  //     this.socket.emit('browseLocation', { locationId: this.locationId }, (test, data) => {
  //       resolve(data)
  //     })
  //   })
  // }

  // getAlarms (vm, callback) {
  //   webMI.data.call('APIv2', { script: 'alarms', method: 'GET', base: vm.$store.getters['userData/getRootBase'] }, function (data) {
  //     callback(data)
  //   })
  // }

  // getScans (vm, callback) {
  //   webMI.data.call('API', { script: 'levelScanner.getScans', right: vm.$store.getters['userData/getRight'](), base: vm.base }, function (data) {
  //     callback(data)
  //   })
  // }

  // getMapLocations (vm, callback) {
  //   webMI.data.call('API', { script: 'map.getLocations', right: vm.$store.getters['userData/getRight'](), base: vm.$store.getters['userData/getBase'] }, function (data) {
  //     callback(data)
  //   })
  // }

  // getLocations (vm, callback) {
  //   webMI.data.call('API', { script: 'location.getLocations', right: vm.$store.getters['userData/getRight'](), base: vm.base }, function (data) {
  //     callback(data)
  //   })
  // }

  // getCustomers (vm, callback) {
  //   webMI.data.call('API', { script: 'customer.getCustomers', right: vm.$store.getters['userData/getRight']() }, function (data) {
  //     callback(data)
  //   })
  // }

  // getWeatherTrend (vm, type, callback) {
  //   const script = type === 'hist' ? 'weather.getWeatherTrend' : 'weather.getForecastTrend'
  //   webMI.data.call('API', { script, right: vm.$store.getters['userData/getRight'](), base: vm.base, from: vm.from, to: vm.to }, function (data) {
  //     callback(data)
  //   })
  // }

  // getOxygenTrend (vm, callback) {
  //   webMI.data.call('API', { script: 'oxygen.getHistoryTrend', right: vm.$store.getters['userData/getRight'](), base: vm.base, from: vm.from, to: vm.to }, function (data) {
  //     callback(data)
  //   })
  // }

  // getFeedTypes () {
  //   // webMI.data.call('API',{script:"feed.getTypes",right: vm.$store.getters['userData/getRight']()},function(data){
  //   //   callback(data);
  //   // })

  // }
}
