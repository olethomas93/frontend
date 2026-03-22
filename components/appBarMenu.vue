<template>
  <v-menu
    left
    bottom
    dark
    style="z-index:999"
  >
    <template #activator="{ props }">
      <v-btn
        icon
        v-bind="props"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, index) in languages"
        :key="'02_' + index"
        :prepend-icon="item.icon"
        :title="item.text"
        @click="item.function"
      />
      <v-divider />
      <slot name="user" />
      <v-list-item
        v-for="(item, index) in items"
        :key="'01_' + index"
        :prepend-icon="item.icon"
        :title="item.text"
        @click="item.function"
      />
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          text: this.$T('Log out'),
          icon: 'mdi-logout',
          function: this.logout
        }
        // {
        //   text: 'Reload',
        //   icon: 'mdi-reload',
        //   function: () => { top.location.reload() }
        // },
        // {
        //   text: 'Log out',
        //   icon: 'mdi-logout',
        //   function: () => { top.webMI.data.logout() }
        // }
      ]
    }
  },
  computed: {
    languages () {
      const languages = Object.keys(top.project.languages).map((i) => {
        return {
          text: top.project.languages[i],
          icon: 'mdi-translate',
          function: () => {
            this.$store.commit('atvise/SET_LANGUAGE', i)
            this.$store.dispatch('translation/loadTranslations')
            top.switchLanguage(i)
          }
        }
      })
      return languages
    }
  },
  methods: {
    logout () {
      this.$auth.logout()
      // top.location.reload()
    }
  }

}
</script>

<style>

</style>
