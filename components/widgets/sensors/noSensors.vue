<template>
  <v-card>
    <v-card-title>Ingen sensorikk funnet</v-card-title>
    <v-card-text>
      <p>
        Denne lokasjonen har ikke sensorikk. For å automatisk legge
        inn forespørsel kan du trykke på knappen nedenfor.
      </p>
      <v-btn @click="bootIntercom">
        Send forespørsel
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {

  mounted () {

  },
  methods: {
    bootIntercom () {
      this.$intercom('showNewMessage', 'Send meg et fristende tilbud på ny sensorikk #maritim')
    }
  }
}
</script>

<style>

</style>
