// https://github.com/nuxt-community/auth-module/issues/713
import { Auth0Scheme } from '@nuxtjs/auth-next/dist/runtime.js'

// Runtime configurable openID scheme
export default class auth0Rt extends Auth0Scheme {
  constructor ($auth, options) {
    const configOptions = {
      ...options,
      ...$auth.ctx.$config.auth.strategies[options.name]
    }
    super($auth, configOptions)
  }
}
