<template>
  <v-btn
    v-show="items.length > 0"
    text
    icon
    @click="click(item.nodeid + '.tickets')"
  >
    <v-badge :color="items.length > 0 ? 'primary' : 'transparent'" :overlap="true">
      <span slot="badge">{{ items.length > 0 ? items.length: '' }}</span>
      <!-- <v-icon class="blink_me" v-if="item.tickets.new > 0">
        mdi-ticket
      </v-icon> -->
      <v-icon>
        mdi-ticket-outline
      </v-icon>
    </v-badge>
  </v-btn>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => { return {} }
    },
    value: {
      type: Object,
      default: () => { return {} }
    },
    icon: {
      type: String,
      default: 'mdi-map-marker'
    }
  },
  computed: {
    // newTickets () {
    //   return items.filter
    // },
    items () {
      return this.value ? this.toArray(this.value) : []
    }
  },
  methods: {
    click (address) {
      this.$router.push({ query: { base: address, display: address + '.default' } })
    },
    toArray (data) {
      return Object.keys(data).map((i) => {
        return data[i]
      })
    }
  }
}
</script>

<style>

</style>
