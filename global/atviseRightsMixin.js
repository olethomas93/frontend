// Legges til på widgets for å ta seg av abbonering av verdier
export default {
  props: {
  },
  data: () => ({
    rights: {}
  }),
  async mounted () {
    this.rights = await this.getRights()
  },
  methods: {
    getRights () {
      return new Promise((resolve) => {
        const base = this.base || this.webMI?.query.base || this.$route.query.base
        top.webMI.data.getRights(base, (e) => {
          resolve(e.rights)
        })
      })
    }
  }
}
