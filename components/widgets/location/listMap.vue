<template>
  <v-container style="height:calc(100vh - 64px)" :fluid="true" :style="{paddingTop: large ? null : 0}" :fill-height="true">
    <v-row ref="row" style="height:100%">
      <v-col :style="{maxHeight: height, padding: large ? null : '0'}" cols="12" md="6">
        <!-- <atvise-visu-v3 :query="{fishFarming: fishFarming}" settings="SYSTEM.LIBRARY.ATVISE.OBJECTDISPLAYS._jmhVue.location-list" @current-items="test">
          1
        </atvise-visu-v3> -->
        <locationList :fish-farming="fishFarming" @current-items="locations = $event" />
      </v-col>
      <v-col v-if="large" style="height:height" cols="12" md="6">
        <!-- <atvise-visu-v3 style="height:100%" :locations="locations" settings="SYSTEM.LIBRARY.ATVISE.OBJECTDISPLAYS._jmhVue.location-map">
          1
        </atvise-visu-v3> -->
        <!--        <locationMap :locations="locations" :use-id-as-name="useIdAsName" :cluster-grid-size="clusterGridSize" :minimum-cluster-size="minimumClusterSize" />-->
        <map-general :items="locations" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    fishFarming: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      locations: [],
      height: '500px'
    }
  },
  computed: {
    large () {
      return this.$vuetify.breakpoint.mdAndUp
    }
  },
  beforeMount () {
    const self = this
    setTimeout(function () {
      self.height = self.$refs.row.clientHeight + 'px'
    }, 500)
  },
  methods: {
    test (data) {
      this.locations = data
    }
  }
}
</script>

<style>

</style>
