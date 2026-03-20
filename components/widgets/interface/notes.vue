<template>
  <v-container>
    <v-card-actions>
    <v-text-field disabled color="primary" v-model="oldTfm" label="Documentation ID:"></v-text-field>
    <v-spacer/>
    <v-text-field disabled color="primary" v-model="room" label="Room:"></v-text-field>
    </v-card-actions>
    <v-card-actions>
    <v-textarea v-model="text" active bg-color="primary" rows="1" auto-grow label="Information" :disabled="!engEditMode"
      @keydown.8.stop="" @keydown.enter.prevent="text += '\n'"></v-textarea>
      </v-card-actions>
    <v-card-actions>
    <v-textarea v-model="editableText" :disabled="!editMode" active variant="outlined" auto-grow label="Notepad"
      @keydown.8.stop="" @keydown.enter.prevent="editableText += '\n'"></v-textarea>
    </v-card-actions>
    <v-card-actions>
      <v-text-field disabled color="primary" v-model="editedBy" label="Notepad last edited by:"></v-text-field>
      <v-spacer />
      <v-btn variant="variant="outlined"" @click="getEditableText" v-if="editMode">
        {{ $T('Cancel') }}
      </v-btn>
      <v-btn variant="variant="outlined"" @click="edit" v-if="!editMode">
        {{ $T('Edit') }}
      </v-btn>
      <v-btn :disabled="!editMode" color="primary" @click="writeEditableText" v-if="editMode">
        {{ $T('Save') }}
      </v-btn>
    </v-card-actions>
  </v-container>
</template>
  
<script>
import Rights from '@/global/atviseRightsMixin'

export default {
  mixins: [
    Rights
  ],
  props: {
    base: {
      type: String,
      default: undefined
    },
    items: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      text: '',
      editableText: '',
      editedBy: '',
      oldTfm: '',
      room: '',
      editMode: false,
      engEditMode: false
    }
  },/*
  watch:{
    base:{
      emidiate: true,
      handler(){
        this.init()
      }
    }
  },*/
  async mounted() {
    //this.init()
    
    this.getText()
    this.getEditableText()
    this.getEditor()
    this.getTFM()
  },
  methods: {
    init(){
      this.getText()
      this.getEditableText()
      this.getEditor()
      this.getTFM()
    },
    edit() {
      this.editMode = true
      if (this.rights.engineer) {
        this.engEditMode = true
      }
    },
    getEditableText() {
      var address = this.items.nodeid + '.editableInfo'
      this.read(address).then((data) => {
        this.editableText = data.value
      })
      this.editMode = false
      this.engEditMode = false
    },
    getEditor() {
      var address = this.items.nodeid + '.editedBy'
      this.read(address).then((data) => {
        this.editedBy = data.value
      })
    },
    getTFM() {
      var address = this.items.nodeid + '.documentationId'
      this.read(address).then((data) => {
        this.oldTfm = data.value
      })
      var address2 = this.items.nodeid.split('.').slice(0, -1).join('.') + '.location'
      this.read(address2).then((room) => {
        this.room = room.value
      })
    },
    writeEditableText() {
      var address = this.items.nodeid + '.editableInfo'
      this.write(address, this.editableText)
      const name = this.$lodash.get(this.$store.state.atvise.userData, 'fullname') || this.$lodash.get(this.$store.state.auth.user, 'name') || this.$lodash.get(this.$store.state.atvise.userData, 'Email') || this.$lodash.get(this.$store.state.atvise.userData, 'username')
      var timeString = new Date().toISOString()
      this.write(this.items.nodeid + '.editedBy', name + ' ' + timeString)
      this.getEditor()
      this.editMode = false
      this.engEditMode = false
      if (this.rights.engineer) {
        this.write(this.items.nodeid + '.mainInfo', this.text)
      }
    },
    getText() {
      var address = this.items.nodeid + '.mainInfo'
      this.read(address).then((data) => {
        this.text = data.value
      })
    },
    read(node) {
      return new Promise((resolve) => {
        top.webMI.data.read(node, (data) => {
          resolve(data)
        })
      })
    },
    write(node, value) {
      top.webMI.data.write(node, value)
    }
  }
}
</script>  