<template>
  <v-container>
    <v-row>
      <v-col cols="4" v-for="i in items" :key="i.nodeid">
        <v-hover v-slot="{ hover }">
          <v-card height="264">
            <v-card-title primary-title>
              {{ i.browsename }}
            </v-card-title>
            <v-overlay :value="hover" :absolute="true" opacity="0.4">
              <v-btn @click="addWidget(i)">
                Add widget
              </v-btn>
            </v-overlay>
            <v-card-text style="height: calc(100% - 85px);zoom:0.7;">
              <atvise-visu-v3 :base="base" :settings="i.nodeid" />
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
  <!-- <div style="position:relative">
    <v-hover v-slot="{ hover }" v-for="i in items" :key="i.nodeid">
      <div>
        <v-overlay :value="hover" :absolute="true" opacity="0.4">
          <v-btn @click="addWidget(i)">
            Add widget
          </v-btn>
        </v-overlay>
        <atvise-visu-v3 :base="base" :settings="i.nodeid" />
      </div>
    </v-hover>
  </div> -->
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: 'AGENT.OBJECTS'
    },
    item: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      overlay: true,
      items: []
    }
  },
  watch: {
    base () {
      this.getDisplays()
    }
  },
  mounted () {
    this.getDisplays()
  },
  methods: {
    addWidget (item) {
      this.$emit('add-widget', { base: this.base, item })
    },
    async getDisplays () {
      const filter = {
        startAddress: this.base,
        vTypes: ['VariableTypes.ATVISE.Display'],
        endLevel: 1
      }
      try {
        const items = await this.$browse(filter, true)
        this.items = items.filter((item) => { return item.browsename === '_widget' || item.browsename === 'widget' || item.browsename === '_trend' || item.browsename === 'trend' })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
