export default ({ app }, inject) => {
  inject('T', translate)
}

function translate (string) {
  if (string?.length > 0) {
    return this.$store.getters['translation/translateText'](`T{${string}}`)
  } else {
    return ''
  }
}
