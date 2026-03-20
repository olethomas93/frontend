<template>
  <v-card>
    <v-card-title>
      {{ $T(title) }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field v-model="model.browsename" label="Id" :disabled="editMode" :rules="[rules.allowed, rules.counter]" @keydown.stop="" />
        <v-text-field v-model="model.displayname" :label="$T('Name')" @keydown.stop="" />
        <v-text-field v-model="model.description" :label="$T('Description')" @keydown.stop="" />
        <!-- <template v-for="(i,key) in settings">
          <v-switch v-if="i.datatype === 'i=1'" :key="key" v-model="i.value" :label="i.browsename" @keydown.stop="" />
          <v-text-field v-else-if="i.datatype === 'i=12'" :key="key" v-model="i.value" :label="i.browsename" @keydown.stop="" />
          <v-text-field v-else :key="key" v-model.number="i.value" :label="i.browsename" @keydown.stop="" />
        </template> -->
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="variant="outlined"" @click="$emit('close')">
        {{ $T('Cancel') }}
      </v-btn>
      <v-btn :disabled="!valid" color="primary" @click="submit">
        {{ $T('Ok') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    selected: {
      type: Object,
      default: () => { return undefined }
    },
    editMode: {
      type: Boolean,
      default: false
    },
    base: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      valid: true,
      model: {
        browsename: '',
        displayname: '',
        description: ''
      },
      modelSettings: {},
      settings: [],
      // idRules: [
      //   v => !!v || 'Id is required',
      //   v => (v && v.length >= 3) || 'Id must be more than 2 characters'
      // ]
      rules: {
        counter: value => value.length <= 15 || 'Max 15 characters',
        allowed: (value) => {
          const pattern = /^[A-Za-z0-9_]*$/
          return pattern.test(value) || 'Only letters (a-z), numbers and _ allowed'
        },
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Not a valid email'
        }
      }
    }
  },
  computed: {
    title () {
      return this.editMode ? 'Edit' : 'Add'
    }
  },
  watch: {
    selected: {
      deep: true,
      handler (val) {
        this.model = val
      }
    }
  },
  async mounted () {
    try {
      this.model = this.selected
      this.settings = await this.getSettings()
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    getSettings () {
      return new Promise((resolve, reject) => {
        const startAddress = this.editMode ? this.selected.nodeid + '.settings' : this.selected.typeDefinition + '.settings'
        const filter = {
          startAddress,
          endLevel: 1,
          mapping: ['datatype:datatype', 'browsename:browsename', 'displayname:displayname', 'nodeid:nodeid:splitnamespace', 'description:description', 'typeDefinition:typedefinition:splitnamespace', 'value:value']
        }
        top.webMI.data.call('BrowseNodes', filter, (data) => {
          if (data.error) {
            reject(data.errorstring)
          }
          const temp = Object.keys(data).map((i) => {
            return data[i]
          })
          resolve(temp)
        })
      })
    },
    submit () {
      const options = this.model
      const base = this.base || this.$route.query.base
      // options.address = this.$route.query.base + '.' + this.model.browsename
      options.address = base + '.' + this.model.browsename
      options.nodeClass = 'OBJECT'
      const script = this.editMode ? 'JMH_UpdateNode' : 'JMH_AddNode'
      top.webMI.data.call(script, options, (result) => {
        if (result.error) {
          this.$store.commit('SET_CUSTOM_ALERT', { message: result.errorstring })
        } else {
          this.submitSettings(options)
          this.$refs.form.reset()
          this.$emit('close')
        }
      })
    },
    submitSettings (options) {
      const nodes = []
      const values = []
      this.settings.forEach((item) => {
        values.push(item.value)
        nodes.push(options.address + '.settings.' + item.browsename)
      })
      top.webMI.data.write(nodes, values)
    },
    arrToObj (data) {
      return Object.keys(data).map((i) => {
        return data[i]
      })
    }
  }
}
</script>

<style>

</style>
