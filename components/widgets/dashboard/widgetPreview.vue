<template>
  <v-container>
    <v-row>
      <v-col v-for="(item,index) in items" :key="index" cols="4">
        <v-hover v-slot="{ hover }">
          <v-card @click="$emit('add:widget', item)">
            <v-overlay :value="hover" absolute>
              {{ $T('Select') }}
              <!-- <v-btn @click="$emit('add:widget', item)">
                Select
              </v-btn> -->
            </v-overlay>
            <atvise-visu-v3 style="height:200px" :settings="item.nodeid" />
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: 'SYSTEM.LIBRARY.ATVISE.OBJECTDISPLAYS._jmhVue.dashboard'
    }
  },
  data () {
    return {
      items: []
    }
  },
  mounted () {
    this.getWidgets()
  },
  methods: {
    async getWidgets () {
      const filter = {
        startAddress: this.base,
        vTypes: ['VariableTypes.ATVISE.Display'],
        endLevel: 1
      }
      this.items = await this.$browse(filter)
    }
  }
}
</script>

<style>
</style>
