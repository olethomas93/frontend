<template>
  <v-container class="fill-height">
    <v-row class="justify-center">
      <v-card
        class="rounded px-6 py-8"
        light
        style="box-shadow: 0 0 40px 4px #111118 !important;"
        width="350"
      >
        <div class="justify-center rounded" style="width:100%">
          <center>
            <v-img
              class="white--text align-end"
              _height="120px"
              _width="120px"
              :src="logo"
            />
            <!-- <v-card-title>Velkommen</v-card-title> -->
          </center>
        </div>
        <v-card-title>{{ $T(text) }}</v-card-title>
        <template v-if="loginWith.includes('atviseLocal')">
          <v-card-text>{{ $T('Login in with local Atvise user') }}</v-card-text>
          <!-------------------------- LOGIN LOCAL USER-------------------------------->
          <v-text-field
            v-model="user"
            placeholder="username"
            prepend-inner-icon="mdi-account"
            outlined
            tabindex="1"
            autofocus
            :error-messages="formError"
            @keydown.stop=""
          />
          <v-text-field
            v-model="password"
            type="password"
            placeholder="password"
            prepend-inner-icon="mdi-lock"
            outlined
            tabindex="2"
            @keydown.stop=""
            @keydown.enter="login(true)"
          />
          <v-btn
            tabindex="3"
            dark
            block
            _color="primary"
            height="50"
            nuxt
            @keydown.enter="login(true)"
            @click="login(true)"
          >
            LOG IN
          </v-btn>
          <v-divider :thickness="3" class="border-opacity-50 ma-4" />
        </template>
        <!-------------------------- AAD SECTION -------------------------------->
        <template v-if="loginWith.includes('aad')">
          <v-card-text>{{ $T('Click here for signin with AAD') }}</v-card-text>
          <v-card-actions class="justify-center" :style="{background:color}">
            <v-btn
              :dark="dark"
              block
              text
              _color="primary"
              height="50"
              nuxt
              @click="loginAAD"
            >
              {{ $T(btnText) }}
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-row>
  </v-container>
  <!-------------------------- Login == atviselocal -------------------------------->
  <!-- <v-container v-else-if="loginWith === 'atviseLocal'" class="fill-height">
    <v-row class="justify-center">
      <v-card
        class="rounded"
        light
        style="box-shadow: 0 0 40px 4px #111118 !important;"
        width="300"
      >
        <div class="justify-center rounded" style="width:100%;background-color:#ffffff">
          <center>
            <v-img
              class="white--text align-end"
              _height="120px"
              width="300px"
              :src="logo"
            />
          </center>
        </div>
        <v-card-text>
          <v-text-field
            v-model="user"
            placeholder="username"
            prepend-inner-icon="mdi-account"
            outlined
            tabindex="1"
            autofocus
            @keydown.stop=""
            @keydown.enter="login"
          />
          <v-text-field
            v-model="password"
            type="password"
            placeholder="password"
            prepend-inner-icon="mdi-lock"
            outlined
            tabindex="2"
            @keydown.stop=""
            @keydown.enter="login"
          />
        </v-card-text>
        <v-card-actions class="justify-center" :style="{background: $vuetify.theme.currentTheme.primary }">
          <v-btn
            tabindex="3"
            dark
            block
            text
            _color="primary"
            height="50"
            nuxt
            @keydown.enter="login"
            @click="login"
          >
            LOG IN >
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container> -->
</template>

<script>

// import { mapMutations } from 'vuex'

export default {
  layout: 'login',
  data () {
    return {
      error: null,
      formError: null,
      user: '',
      password: ''
    }
  },
  computed: {
    loginWith () {
      // return top.webMIConfig.auth.loginWith || 'aad'
      return this.$config.atvise.login
    },
    logo () {
      return this.$lodash.get(top.config, 'nuxt.login.logo.src', 'logos/logo.png')
    },
    aadlogo () {
      return this.$lodash.get(top.config, 'nuxt.login.aadlogo.src', 'logos/aadlogo.png')
    },
    color () {
      return this.$lodash.get(top.config, 'nuxt.login.color', '#00a3e0')
    },
    dark () {
      return this.$lodash.get(top.config, 'nuxt.login.dark', true)
    },
    text () {
      return this.$lodash.get(top.config, 'nuxt.login.text', 'Welcome!')
    },
    btnText () {
      return this.$lodash.get(top.config, 'nuxt.login.btnText', 'To login AD >')
    },
    usrName () {
      return this.$lodash.get(top.config, 'nuxt.login.usrNameInput', '')
    },
    usrPwd () {
      return this.$lodash.get(top.config, 'nuxt.login.usrPwdInput', '')
    }
  },
  mounted () {
    if (this.loginWith === 'auth0') {
      this.login()
    }
  },
  methods: {
    async login (local) {
      try {
        // await this.$auth.loginWith('auth0', { params: { prompt: 'select_account' } })
        if (local === true) {
          const res = await this.$auth.loginWith('atviseLocal', this.user, this.password)
          this.checklogin(res)
        } else if (this.loginWith === 'aad') {
          await this.$auth.loginWith(this.loginWith, { params: { prompt: 'select_account' } })
        } else if (this.loginWith === 'atviseLocal') {
          await this.$auth.loginWith('atviseLocal', this.user, this.password)
        } else if (this.loginWith === 'auth0') {
          await this.$auth.loginWith('auth0')
        }
      } catch (e) {
        this.formError = `Login failed: ${e.message}`
      }
    },
    loginAAD () {
      this.$auth.loginWith('aad', { params: { prompt: 'select_account' } })
    },
    checklogin (res) {
      if (res[''].username === '') {
        this.formError = 'Login failed!'
      }
    },
    async logout () {
      try {
        await this.$store.dispatch('logout')
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>
