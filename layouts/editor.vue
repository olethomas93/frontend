<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <TreeView />
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Editor</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import TreeView from '~/components/widgets/treeView.vue'

export default {
  components: { TreeView },
  data: () => ({ drawer: null })
}
</script>
