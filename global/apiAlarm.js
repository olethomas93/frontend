export default class APIalarm {
  constructor (vm) {
    this.vm = vm
    this.init()
  }

  init () {
    // this.customerId = this.vm.$store.state.customers[0].id // this.vm.$store.state.auth.user['https://jmhansen.no/jm.roles'][0] // this.vm.$store.state.authUser.group[0]
    // this.locationId = this.vm.$route.params.id
    // this.isAdmin = this.vm.$store.state.auth.user['https://jmhansen.no/jm.roles'][0] === 'admin'
    // this.baseUrl = '/api/v2'
  }

  list () {
    return new Promise((resolve, reject) => {
      top.webMI.data.call('AlarmList', {}, (data) => {
        resolve(data)
      })
    })
  }

  /**
   *
   * @returns List of all alarm conditions
   */
  conditions () {
    return new Promise((resolve, reject) => {
      // this.socket.emit('alarming', { customerId: this.customerId, func: 'conditions' }, (error, data) => {
      //   if (error) {
      //     reject(error)
      //   }
      //   // data = data.map((cond) => {
      //   //   const nodeIdArr = cond.split('.')
      //   //   return { nodeId: cond, customerId: nodeIdArr[3], locationId: nodeIdArr[4] }
      //   // })
      //   resolve(data)
      // })
    })
  }

  /**
   *
   * @param {*} id
   * @returns Configuration of given alarm
   */
  configuration (id) {
    return new Promise((resolve, reject) => {
      // this.socket.emit('alarming', { customerId: this.customerId, func: 'configuration', id }, (error, data) => {
      //   if (error) {
      //     reject(error)
      //   }
      //   resolve(data)
      // })
    })
  }

  acknowledge (id, _options) {
    return new Promise((resolve, reject) => {
      top.webMI.data.call('AlarmAcknowledge', { address: id, comment: _options.comment }, (data) => {
        resolve(data)
      })
    })
    // return new Promise((resolve, reject) => {
    //   const options = _options || {}
    //   options.user = this.vm.$store.state.auth.user.email
    //   let url
    //   if (this.customerId === 'admin') {
    //     url = `${this.baseUrl}/admin/opc/alarming/acknowledge`
    //   } else {
    //     url = `${this.baseUrl}/customers/${this.customerId}/opcua/alarming/acknowledge`
    //   }
    //   this.vm.$axios.post(url, { id, options }).then((data) => {
    //     resolve(data.data)
    //   })
    // })
  }

  shelve (id, _options) {
    return new Promise((resolve, reject) => {
      top.webMI.data.call('AlarmShelve', { address: id }, (data) => {
        resolve(data)
      })
      // const options = _options || {}
      // options.user = this.vm.$store.state.auth.user.email
      // let url
      // if (this.customerId === 'admin') {
      //   url = `${this.baseUrl}/admin/opc/alarming/shelve`
      // } else {
      //   url = `${this.baseUrl}/customers/${this.customerId}/opcua/alarming/shelve`
      // }
      // this.vm.$axios.post(url, { id, options }).then((data) => {
      //   resolve(data.data)
      // })
    })
  }

  unshelve (id, _options) {
    return new Promise((resolve, reject) => {
      top.webMI.data.call('AlarmUnshelve', { address: id }, (data) => {
        resolve(data)
      })
    })
  }

  comment (id, _options) {
    return new Promise((resolve, reject) => {
      top.webMI.data.call('AlarmComment', { address: id, comment: _options.comment }, (data) => {
        resolve(data)
      })
    })
  }

  // /**
  //  * Adds a ticket to the location, then adds the ticket number and comment to the alarm
  //  * @param {Object} alarm
  //  * @param {Object} _options
  //  */
  // addTicket (alarm, _options) {
  //   return new Promise((resolve, reject) => {
  //     const customerId = alarm.address.split('.')[3]
  //     const locationId = alarm.address.split('.')[4]
  //     const obj = {
  //       name: `${alarm.customer} - ${alarm.location}`,
  //       email: `${customerId}.${locationId}@noemail.com`,
  //       subject: `Alarm: ${alarm.eventtext.nb}`,
  //       message:
  //         `Kunde: ${alarm.customer}
  //         Lokasjon: ${alarm.location}
  //         Enhet: ${alarm.device}
  //         SourceNode: ${alarm.SourceNode}
  //         AlarmId: ${alarm.AlarmId}
  //         ReciveTime: ${new Date(alarm.ReceiveTime).toLocaleString()}

  //         Kommentar: ${_options.comment}`
  //     }

  //     this.socket.emit('ticket', obj, (error, data) => {
  //       if (error) {
  //         reject(error)
  //       }
  //       this.comment(alarm.address, { comment: `ticket: #${data}, ${_options.comment}` })
  //       resolve(data)
  //     })
  //   })
  // }

  disable (id, _options) {
    return new Promise((resolve, reject) => {
      const options = _options || {}
      options.user = this.vm.$keycloak.fullName
      // this.socket.emit('alarming', { func: 'disable', id, options }, (error, data) => {
      //   if (error) {
      //     reject(error)
      //   }
      //   resolve(data)
      // })
    })
  }

  enable (id, _options) {
    return new Promise((resolve, reject) => {
      const options = _options || {}
      options.user = this.vm.$keycloak.fullName
      // this.socket.emit('alarming', { func: 'enable', id, options }, (error, data) => {
      //   if (error) {
      //     reject(error)
      //   }
      //   resolve(data)
      // })
    })
  }
}
