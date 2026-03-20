<template>
    <v-row :style="{maxWidth: maxWidth}">
      <v-col>
        <v-btn variant="variant="outlined"" style="width:100%"  small :color="color" @click="openUrl(value)">
          {{ value }}
        </v-btn>
      </v-col>
    </v-row>
  </template>
  <script>
import mixin from './mixin'
  
  export default {
    mixins: [
      mixin
    ],
    props: {
        color: {
            type: String,
            default: '#ffffff'
        }
    },
    data () {
      return {
        sub: undefined
      }
    },
    methods: {
        async openUrl (url){
            window.open('http://' + url, '_blank')
        },
        getValue () {
          this.read(this.$lodash.get(this.item, 'childs.value.nodeid')).then((data) => {
            this.value = data.value
          })
        }
    }
  }
  </script>
  
  <style>
  
  </style>
  