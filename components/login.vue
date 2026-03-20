<template>
  <v-container class="fill-height">
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
              class="text-white align-end"
              _height="120px"
              width="300px"
              src="\logo.png"
            />
            <!-- <v-card-title>JM UX</v-card-title> -->
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
          >
            <!-- <template slot="append-outer">
              <v-icon>
                mdi-keyboard
              </v-icon>
            </template> -->
          </v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            placeholder="password"
            prepend-inner-icon="mdi-lock"
            outlined
            tabindex="2"
            @keydown.stop=""
            @keydown.enter="login"
          >
            <!-- <template slot="append-outer">
              <v-icon>
                mdi-keyboard
              </v-icon>
            </template> -->
          </v-text-field>
        </v-card-text>
        <v-card-actions class="justify-center" :style="{background: $vuetify.theme.currentTheme.primary }">
          <v-btn
            tabindex="3"
            dark
            block
            variant="text"
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
  </v-container>
</template>

<script>
export default {
  inject: ['theme'],
  data () {
    return {
      user: '',
      password: ''
    }
  },
  methods: {
    login () {
      // top.webMI.data.login(this.user, this.password)
      this.$auth.loginWith('atviseLocal', this.user, this.password)
    }
  }
}
</script>
