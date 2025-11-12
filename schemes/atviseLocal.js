export default class MyOwnScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name
    this.options = options
  }

  mounted () {
  }

  async login (user, password) {
    try {
      await this.atviseLogin(user, password)
      this.fetchUser()
    } catch (e) {
      console.error('Login failed!')
      return e
    }
  }

  atviseLogin (user, password) {
    return new Promise((resolve, reject) => {
      top.webMI.data.login(user, password, (e) => {
        if (e[''].username.length > 0) {
          resolve(e)
        } else {
          reject(e)
        }
        // console.log(e)
        // resolve(e)
      })
    })
  }

  reset () {
    top.location.reload()
    // console.log('reset')
  }

  fetchUser () {
    this.$auth.setUser({
      username: 'Your Name',
      role: 'none'
    })
  }

  logout () {
    return this.$auth.reset()
  }
}
