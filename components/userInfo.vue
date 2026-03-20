<template>
  <div :style="{background: mini ? 'transparent' : 'transparent'}">
    <v-list
      nav
      density="compact"
      class="pa-0"
      color="rgba(0,0,0,0)"
      _style="height:64px;"
    >
      <!-- <v-list-item style="margin-left:3px;height:56px;"> -->
      <v-list-item style="height:56px;" @click="dialog=true">
        <v-tooltip left>
          <template #activator="{ props }">
            <v-avatar v-if="name" size="36" color="primary" v-bind="props">
              <span class="text-white text-h6">{{ name.slice(0,2) }}</span>
            </v-avatar>
          </template>
          <span>{{ name }}</span>
        </v-tooltip>
        <v-list-item-title v-if="!mini">
          {{ name }}
        </v-list-item-title>
        <!-- <v-list-item-action>
          <v-menu bottom left>
            <template #activator="{ props }">
              <v-btn icon v-bind="props" @click.stop>
                <v-icon>
                  mdi-dots-vertical
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="item in menuItems"
                :key="item.title"
                :class="[item.class] || ''"
                @click="item.click"
              >
                <v-list-item-action>
                  <v-icon v-if="item.icon">
                    {{ item.icon }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
              <v-list-item style="margin-left:3px;height:56px;">
                
                  <v-btn @click="logout">
                    Logg ut
                  </v-btn>
                
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-action> -->
      </v-list-item>
    </v-list>
    <v-dialog v-model="dialog" width="600">
      <v-card>
        <v-card-title>
          {{ $T('Userinfo') }}
        </v-card-title>
        <v-card-text>
          <pre>
            {{ JSON.stringify($store.state.atvise.userData, null, 2) }}
          </pre>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">
            {{ $T('Close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  props: {
    mini: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialog: false,
    darkMode: false
  }),
  computed: {
    name () {
      const name = this.$lodash.get(this.$store.state.auth.user, 'name') || this.$lodash.get(this.$store.state.atvise.userData, 'fullname') || this.$lodash.get(this.$store.state.atvise.userData, 'Email') || this.$lodash.get(this.$store.state.atvise.userData, 'username')
      return name // this.$store.state.auth.user.name || this.$store.state.atvise.userData.fullname || this.$store.state.atvise.userData.Email || this.$store.state.atvise.userData.username
    },
    menuItems () {
      const items = [
        {
          title: 'Mørk/lys',
          icon: 'mdi-invert-colors',
          click: () => { this.invertColors() }
        },
        {
          title: 'Brukerstøtte',
          icon: 'mdi-chat',
          class: 'intercom_launcher',
          click: () => {}
        }
      ]
      return items
    },
    num () {
      return (Math.random() * 9).toFixed(0)
    },
    imgStr () {
      return this.$keycloak.tokenParsed.name.split(' ')[0].charAt(0).toLowerCase() + this.$keycloak.tokenParsed.name.split(' ')[1].charAt(0).toLowerCase()
    }
  },
  methods: {
    invertColors () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    logout () {
      try {
        top.webMI.data.logout((e) => {
          if (!e[''].error) {
            this.$store.commit('auth/SET_USER', {})
            // logout OK
          } else {
            // logout NOT ok
          }
        })
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>

<style scoped>

</style>
