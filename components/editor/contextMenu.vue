<template>
  <div style="height:100px">
    <v-menu v-bind="$attrs" :value="value">
      <v-list>
        <template v-for="(item, index) in items">
          <v-divider v-if="item.divider" :key="`divider-${index}`" />
          <v-list-item v-else :key="`item-${index}`" link @click="handleItemClick(item)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          Legg til ny {{ currentItem.type }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="currentItem.name" label="Navn" autofocus @keydown.8.stop="" @keydown.enter="saveItem" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
            Avbryt
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveItem">
            Lagre
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">
          {{ currentItemToDelete?.displayname }}
        </v-card-title>
        <v-card-text>Er du sikker på at du vil slette denne ressursen?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green-darken-1" variant="text" @click="deleteDialog = false">
            Avbryt
          </v-btn>
          <v-btn color="red-darken-1" variant="text" @click="deleteConfirmed()">
            Slett
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      showMenu: true,
      dialog: false,
      currentItem: { name: '', typeDefinition: '' },
      deleteDialog: false,
      currentItemToDelete: null // Holder styr på hvilken ressurs som skal slettes
    }
  },
  computed: {
    items () {
      let temp = []
      const typeDefinition = this.$lodash.get(this.selected, 'typedefinition', '')
      if (typeDefinition === 'i=61') {
        temp = [
          {
            icon: 'mdi-folder',
            title: 'Add folder...',
            typeDefinition: 'i=61',
            nodeClass: 'OBJECT',
            function: (item) => { this.addItem(item) }
          },
          {
            icon: 'mdi-vuejs',
            title: 'Add VUE component...',
            typeDefinition: 'VariableTypes.ATVISE.Resource.OctetStream',
            nodeClass: 'VARIABLE',
            function: (item) => { this.addItem(item) }
          },
          {
            icon: 'mdi-language-javascript',
            title: 'Add javascript...',
            typeDefinition: 'VariableTypes.ATVISE.Resource.Javascript',
            nodeClass: 'VARIABLE',
            function: (item) => { this.addItem(item) }
          },
          {
            divider: true
          }
        ]
      }
      if (typeDefinition.includes('VariableTypes.ATVISE.Resource')) {
        temp = [
          {
            icon: 'mdi-pencil',
            title: 'Edit',
            function: (item) => { this.editResource(item) } // Antatt metode basert på kontekst
          },
          {
            divider: true
          }
        ]
      }
      temp.push({
        icon: 'mdi-delete',
        title: 'Delete',
        function: (item) => { this.deleteResource(item) }
      })
      temp.push({
        icon: 'mdi-refresh',
        title: 'Refresh',
        function: (item) => { this.refresh(item) } // Antatt metode for å oppfriske, selv om ikke spesifisert i den opprinnelige koden
      })
      return temp
    }
  },
  methods: {
    addItem (item) {
      this.currentItem = item
      this.dialog = true
    },
    // addFolder (item) {
    //   console.log('Adding folder:', item)
    //   this.currentItem.type = 'i=61'
    //   this.dialog = true
    // },
    // addVue (item) {
    //   console.log('Adding VUE component:', item)
    //   this.dialog = true
    // },
    // addJs (item) {
    //   console.log('Adding JavaScript file:', item)
    //   this.dialog = true
    // },
    editResource (item) {
      console.log('Editing resource:', item)
    },
    refresh (item) {
      console.log('Refreshing:', item)
      this.$emit('refresh')
      // Implementer nødvendig logikk for oppfriskning her
    },
    handleItemClick (item) {
      if (item.function) {
        item.function(item)
      }
    },
    closeDialog () {
      this.dialog = false
      this.resetCurrentItem()
    },
    saveItem () {
      const parent = this.selected
      console.log(parent.nodeid)
      console.log(`Lagrer ${this.currentItem.typeDefinition}: ${this.currentItem.name}`)

      top.webMI.data.call('CTRL_AddResource', {
        address: `${parent.nodeid}/${this.currentItem.name}`,
        typeDefinition: this.currentItem.typeDefinition,
        nodeClass: this.currentItem.nodeClass
      }, (res) => {
        console.log(res)
        this.refresh()
      })
      // setTimeout(this.refresh, 500)
      this.closeDialog()
    },
    resetCurrentItem () {
      this.currentItem = { name: '', type: '' }
    },
    confirmDeleteResource (item) {
      this.currentItemToDelete = item
      this.deleteDialog = true
    },
    deleteConfirmed () {
      console.log('Deleting resource:', this.currentItemToDelete)
      // Implementer slettingslogikk her
      top.webMI.data.call('DeleteNode', { address: this.currentItemToDelete.nodeid }, (res) => {
        console.log(res)
        this.refresh()
      })
      this.deleteDialog = false
    },
    deleteResource () {
      this.confirmDeleteResource(this.selected)
    }
  }
}
</script>

<style>

</style>
