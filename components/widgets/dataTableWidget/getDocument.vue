<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-btn icon color="success" target="_blank" @click="getDocument(item.nodeid, item.displayname, item.childs.type.value)">
    <v-icon>mdi-download-circle</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {
        return {
          nodeid: '',
          displayname: '',
          childs: {
            type: {
              value: ''
            }
          }
        }
      }
    }
  },
  methods: {
    getDocument (nodeid, displayName, type) {
      try {
        const self = this
        const file = nodeid.split('=')[2]
        // window.open('customScripts/getDocument?file=' + file + '&format=binary', '_blank');
        top.webMI.data.customRequest('GET', 'customScripts/getDocument?file=' + file + '&format=binary', 'responseType=arraybuffer', function (data) {
          // console.log(data)
          // Now lets create a download link
          const root = self.$el.getRootNode()
          const a = root.createElement('a') // Create <a>
          a.href = `data:application/pdf;base64, ${self.arrayBufferToBase64(data)}`
          a.download = displayName
          // Lets download the file
          a.click()
          // this.loading = false
        })
      } catch (error) {
        this.document = []
      }
    },
    arrayBufferToBase64 (buffer) {
      let binary = ''
      const bytes = new Uint8Array(buffer)
      const len = bytes.byteLength
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
    }
  }
}
</script>

<style>

</style>
