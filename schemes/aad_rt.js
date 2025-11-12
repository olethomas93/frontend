// https://github.com/nuxt-community/auth-module/issues/713
import { OpenIDConnectScheme } from '@nuxtjs/auth-next/dist/runtime.js'

// Runtime configurable openID scheme
export default class aadRt extends OpenIDConnectScheme {
  constructor ($auth, options) {
    const configOptions = {
      ...options,
      ...$auth.ctx.$config.auth.strategies[options.name]
    }
    super($auth, configOptions)
  }
}
