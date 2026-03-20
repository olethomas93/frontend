<template>
  <v-snackbar
    v-model="show"
    light
    color="warning"
    top
    right
  >
    <v-icon>mdi-alert</v-icon>
    {{ message }}

    <template #action="{ attrs }">
      <v-btn
        color="red"
        variant="text"
        v-bind="attrs"
        @click="show = false"
      >
        {{ $store.getters['translation/translateText']('T{Close}') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    show: false,
    message: ''
  }),
  watch: {
    '$store.state.alerts' (state) {
      // Lets show some custom messages
      this.show = true
      if (state.type === 'custom') {
        this.message = state.message
        // this.alert = { act: true, message: state.message }
      } else if (state.body === 'Unauthorized') {
        // this.alert = { act: true, message: `Woops, an error occurred with state: ${state.body}, kontakt IT -avdelingen for å få riktig tilgangsnivå.` }
      } else {

        // this.alert = { act: true, message: 'Woops, an error occurred with state: Det oppstod en uventet feil' }
      }

      setTimeout(() => {
        this.alert = { act: false, message: '' }
      }, 15000)
    }
  }

}
</script>

<style>

</style>
