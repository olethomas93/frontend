<template>
  <v-tooltip open-delay="500" :right="true" :color="color">
    <template #activator="{ on }">
      <v-icon :color="color" v-on="on">
        {{ icon }}
      </v-icon>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => { return {} }
    }
    // value: {
    //   type: Boolean,
    //   dafault: false
    // }
  },
  data () {
    return {
      value: false
    }
  },
  computed: {
    unbound () {
      return this.item.childs.unbound?.value || false
    },
    color () {
      if (this.unbound) {
        return 'grey'
      } else if (this.value) {
        return 'success'
      } else {
        return 'error'
      }
    },
    text () {
      if (this.unbound) {
        return 'No datasource'
      } else if (this.value) {
        return 'ONLINE'
      } else {
        return 'OFFLINE'
      }
    },
    icon () {
      if (this.unbound) {
        return 'mdi-wifi-off'
      } else if (this.value) {
        return 'mdi-wifi'
      } else {
        return 'mdi-wifi-off'
      }
    }
  },
  mounted () {
    this.checkOnline()
    this.int = setInterval(this.checkOnline, 30000)
  },
  destroyed () {
    clearInterval(this.int)
  },
  methods: {
    checkOnline () {
      top.webMI.data.read(this.item.nodeid + '.connected', (data) => {
        this.value = data.value
      })
    }
  }
}
</script>

<style>

</style>
