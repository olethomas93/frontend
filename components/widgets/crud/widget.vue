<template>
  <div :style="{height: canAdd ? 'calc(100vh - 64px)' : '',overflow:'hidden'}">
    <v-toolbar v-if="showToolbar" density="compact" style="z-index:5" theme="dark">
      <v-text-field
        v-model="search"
        variant="outlined"
        light
        label="Search"
        density="compact"
        hide-details
        clearable
        @keydown.stop=""
      />
      <v-spacer />
      <v-btn-toggle
        v-model="toggleList"
        mandatory
        rounded
        density="compact"
      >
        <v-btn>
          <v-icon>mdi-view-grid</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>mdi-format-list-text</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <div :style="{height: canAdd ? 'calc(100vh - 100px)' : '',overflow:'scroll'}">
      <crud-list
        v-if="showList || toggleList === 1"
        :search="search"
        :items="items"
        :can-edit="canEdit"
        :can-delete="canDelete"
        :can-add="canAdd"
        :show-id="showId"
        :show-expand="showExpand"
        :show-parent="showParent"
        :height="height"
        display="widget"
        :extra-headers="extraHeaders"
        @click="clickEvent"
        @edit="editItem"
        @delete="deleteItem"
      />
      <card-grid
        v-else
        :items="items"
        :can-edit="canEdit"
        :can-delete="canDelete"
        :can-add="canAdd"
        :display="display"
        :width="width"
        :responsive="responsive"
        @click="clickEvent"
        @edit="editItem"
        @delete="deleteItem"
      />
      <fab v-if="canAdd" :object-type="objectType" @click="add" />
      <!-- <v-btn
        v-if="canAdd"
        absolute
        fab
        bottom
        right
        color="primary"
        style="bottom: 15px;"
        @click="add"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn> -->
      <!-- <v-btn color="primary" :outlined="true" :small="false" @click="add">
        T{Add item}
      </v-btn> -->
      <v-dialog v-model="dialog" width="600" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true">
        <form-list
          v-model="editedItem"
          :title="editedIndex === -1 ? 'Legg til' : 'Editer'"
          confirm-text="OK"
          cancel-text="Avbryt"
          :schema="form1"
          @submit="save"
          @close="close"
        />
      </v-dialog>
      <v-dialog v-model="dialogDelete" width="600" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true">
        <form-list v-model="editedItem" title="Slette?" :schema="form2" @submit="deleteItemConfirm" @close="closeDelete" />
      </v-dialog>
      <v-dialog v-model="dialogReference" width="600" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true">
        <crud-addReference v-if="dialogReference" :base="myBase" :object-pool="objectPool" @close="closeAddReference" />
      </v-dialog>
      <v-dialog v-model="dialogCopy" width="600" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true">
        <crud-addCopy v-if="dialogCopy" :base="myBase" :object-pool="objectPool" :object-type="objectType" @close="closeAddCopy" />
      </v-dialog>
      <v-dialog v-model="dialogDeleteReference" width="600" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true">
        <crud-deleteReference v-if="dialogDeleteReference" :base="myBase" :selected="referenceToRemove" @close="closeDeleteReference" />
      </v-dialog>
    </div>
  </div>
</template>

<script>
import cardGrid from './cardGrid.vue'
import fab from './fab.vue'
export default {
  components: { cardGrid, fab },
  props: {
    base: {
      type: String,
      default: ''
    },
    display: {
      type: String,
      default: ''
    },
    objectType: {
      type: String,
      default: ''
    },
    defaultPrefix: {
      type: String,
      default: ''
    },
    canDelete: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    canAdd: {
      type: Boolean,
      default: false
    },
    asList: {
      type: Boolean,
      default: false
    },
    addReference: {
      type: Boolean,
      default: false
    },
    addCopy: {
      type: Boolean,
      default: false
    },
    objectPool: {
      type: String,
      default: ''
    },
    showId: {
      type: Boolean,
      default: false
    },
    showExpand: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: undefined
    },
    showParent: {
      type: Boolean,
      default: false
    },
    showToolbar: {
      type: Boolean,
      default: false
    },
    extraHeaders: {
      type: Array,
      default: () => { return [] }
    },
    width: {
      type: String,
      default: '400'
    },
    responsive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      search: '',
      toggleList: undefined,
      myBase: '',
      dialog: false,
      dialogDelete: false,
      dialogReference: false,
      dialogCopy: false,
      dialogDeleteReference: false,
      ObjectTypeToAdd: '',
      referenceToRemove: '',
      items: [],
      editedIndex: -1,
      editedItem: {
        nodeid: '',
        browsename: '',
        displayname: '',
        description: ''
      },
      defaultItem: {
        nodeid: '',
        browsename: '',
        displayname: '',
        description: ''
      },
      form2: {
        columns: [
          {
            cols: 12,
            fields: [
              {
                type: 'v-text-field',
                model: 'browsename',
                props: {
                  style: '{width:50%}',
                  outlined: true,
                  label: 'ID',
                  disabled: true
                }
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
    showList () {
      return this.asList || this.$vuetify.breakpoint.smAndDown
    },
    form1 () {
      return {
        columns: [
          {
            cols: 12,
            fields: [
              {
                type: 'v-text-field',
                model: 'browsename',
                props: {
                  style: '{width:50%}',
                  outlined: true,
                  label: 'ID',
                  required: true,
                  disabled: this.editedIndex > -1 || (this.defaultPrefix.length > 0 && !this.canDelete)
                }
              },
              {
                type: 'v-text-field',
                model: 'displayname',
                props: {
                  outlined: true,
                  label: 'Navn',
                  required: true
                }

              },
              {
                type: 'v-text-field',
                model: 'description',
                props: {
                  outlined: true,
                  label: 'Beskrivelse',
                  required: true
                }
              }
            ]
          }
        ]
      }
    }
  },
  mounted () {
    this.toggleList = this.asList ? 1 : 0
    this.getItems()
    // console.log(this.items)
    // const extra = await this.getExtraData(items)
    // console.log(items.concat(extra))
  },
  methods: {
    clickEvent (item) {
      if (this.$config.atvise.local) {
        if (item.typeDefinition.includes('ObjectTypes.PROJECT.jmhGeneral.area')) {
          top.webMI.display.openDisplay(item.nodeid + '.default', { base: item.nodeid })
        } else {
          top.webMI.display.openDisplay(item.typeDefinition + '.default', { base: item.nodeid })
        }
      } else {
        this.$router.push({ query: { display: item.nodeid + '.default', base: item.nodeid } })
      }
    },
    getItems () {
      // return new Promise((resolve) => {
      const self = this
      if (this.base.length > 4 && !this.base.includes('undefined.')) {
        this.myBase = this.base
      } else if (this.base.includes('undefined.')) {
        const temp = this.base.split('.').slice(1).join('.')
        this.myBase = `${this.$route.query.base}.${temp}`
      } else {
        this.myBase = this.$route.query.base
      }
      const vTypes = [self.objectType]
      if (this.showParent) {
        vTypes.push('i=62')
      }
      top.webMI.data.call('BrowseNodes', {
        startAddress: self.myBase,
        vTypes,
        endLevel: 2,
        mapping: ['value:value', 'nodeid:nodeid:splitnamespace', 'browsename:browsename', 'displayname:displayname', 'description:description', 'typeDefinition:typedefinition:splitnamespace']
      }, (data) => {
        const items = Object.keys(data).map(function (i) {
          return data[i]
        })
        if (items[0].index) {
          this.items = items.sort((a, b) => { return a.index - b.index })
        } else {
          this.items = items
        }
      })
      // })
    },
    add (type) {
      this.ObjectTypeToAdd = type
      if (this.addReference === true) {
        this.dialogReference = true
      } else if (this.addCopy === true) {
        this.dialogCopy = true
      } else {
        if (this.defaultPrefix.length > 0) {
          const number = this.items.length + 1
          const browsename = this.defaultPrefix + ('000' + number).slice(-4)
          this.editedItem.browsename = browsename
        }
        this.dialog = true
      }
    },
    addItem () {
      const options = {
        address: this.base + '.' + this.editedItem.browsename,
        displayname: this.editedItem.displayname,
        description: this.editedItem.description,
        typeDefinition: this.ObjectTypeToAdd,
        nodeClass: 'OBJECT'
      }
      if (this.ObjectTypeToAdd.includes('.analog')) {
        options.dataType = 'FLOAT'
        options.nodeClass = 'VARIABLE'
        options.value = 0
      }
      if (this.ObjectTypeToAdd.includes('.digital')) {
        options.dataType = 'BOOLEAN'
        options.nodeClass = 'VARIABLE'
        options.value = false
      }
      top.webMI.data.call('JMH_AddNode', options, () => {
        this.getItems()
      })
    },
    updateItem () {
      const options = {
        address: this.editedItem.nodeid,
        displayname: this.editedItem.displayname,
        description: this.editedItem.description
      }
      top.webMI.data.call('JMH_UpdateNode', options, () => { this.getItems() })
    },
    close () {
      this.dialog = false
      const self = this
      this.$nextTick(function () {
        self.editedItem = Object.assign({}, self.defaultItem)
        self.editedIndex = -1
      })
    },
    closeAddReference () {
      this.dialogReference = false
      this.getItems()
    },
    closeAddCopy () {
      this.dialogCopy = false
      this.getItems()
    },
    closeDeleteReference () {
      this.dialogDeleteReference = false
      this.getItems()
    },
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    save () {
      if (this.editedIndex === -1) {
        this.addItem()
      } else {
        this.updateItem()
      }
      this.close()
      top.webMI.data.write([this.base + '.contacts'], [JSON.stringify(this.items)])
    },
    deleteItem (item) {
      if (this.addReference === false) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      } else {
        this.referenceToRemove = item
        this.dialogDeleteReference = true
      }
    },
    deleteItemConfirm () {
      const self = this
      this.closeDelete()
      top.webMI.data.call('DeleteNode', { address: this.editedItem.nodeid }, function () {
        self.getItems()
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    }
  }
}
</script>

<style>

</style>
