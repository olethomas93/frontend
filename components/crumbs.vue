<template>
  <v-breadcrumbs
    :items="crumbs"
    divider="/"
  >
    <template #item="{ item }">
      <v-breadcrumbs-item
        :disabled="item.disabled"
        :to="item.to"
        exact
        @click="navigate(item)"
      >
        {{ splitAndTranslate(item.text ) }}
        <!-- {{ item.text.toUpperCase() }} -->
        <!-- {{ $T(item.text).toUpperCase() }} -->
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  props: {
    defaultBase: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    iframePath: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    crumbs: []
  }),
  watch: {
    $route: {
      immediate: true,
      handler (val) {
        this.buildBreadcrumbs(null, val.query.base)
      }
    },
    iframePath (val) {
      try {
        this.buildBreadcrumbs(undefined, val)
      } catch (error) {
        // console.error('error parsing url')
      }
    }
  },
  mounted () {
    this.crumbs = []
  },
  methods: {
    splitAndTranslate (text) {
      const arr = text.split(' - ')
      if (arr.length === 2) {
        return (this.$T(arr[0]) + ' - ' + this.$T(arr[1])).toUpperCase()
      } else if (arr.length === 1) {
        return this.$T(arr[0]).toUpperCase()
      } else {
        return this.$T(text).toUpperCase()
      }
    },
    navigate (data) {
      this.$router.push({ query: data.to.query })
    },
    buildBreadcrumbs (url, _base) {
      top.webMI.data.call('JMH_getCrumbs', { address: _base, home: JSON.stringify(top.webMIConfig.nuxt.home) }, (e) => {
        this.crumbs = e
        this.$nextTick(() => {
          this.$el.scrollBy(1000, 0)
        })
      })
    },
    getRoute (path) {
      const display = path.includes('AGENT.DISPLAYS') ? path : `${path}.default`
      const base = path
      return { path: '/', query: { display, parameters: JSON.stringify({ base }), iframe: 'content' } }
    }
    // getdescription (path) {
    //   return new Promise((resolve) => {
    //     if (path.includes('AGENT.DISPLAYS')) {
    //       resolve('')
    //     } else {
    //       top.webMI.data.call('BrowseNodes', {
    //         startAddress: path,
    //         includeStartAddress: true,
    //         endLevel: 1,
    //         mapping: ['displayname:displayname']
    //       }, (e) => {
    //         // console.log(e)
    //         resolve({ desc: e[Object.keys(e)[0]].displayname, path })
    //       })
    //       // top.webMI.data.read(path + '.description', (e) => {
    //       //   resolve({ desc: e.value.en, path })
    //       // })
    //     }
    //   })
    // }
  }
}
</script>

<style>

</style>
