<template>
  <div>
    <!-- <data-table :items="items" /> -->
    <crud-fab
      v-if="(canAdd || canEdit || canDelete)"
      :can-add="canAdd"
      :can-edit="canEdit"
      :object-type="objectType"
      :object-types="objectTypes"
      :selected="selected"
      _delete="del"
      @edit="edit"
      @add="add"
    />
    <v-dialog
      v-if="addDialog"
      v-model="addDialog"
      width="600"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :persistent="true"
    >
      <component :is="addForm" :base="base" :selected="defaultItem" :object-type="objectType" @close="closeDialogs" />
    </v-dialog>
    <v-dialog v-if="editDialog" v-model="editDialog" width="600" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true">
      <component :is="editForm" edit-mode :selected="editedItem" :object-type="objectType" @close="closeDialogs" />
    </v-dialog>
    <v-dialog v-model="copyDialog" width="600" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true">
      <crud-addCopy v-if="copyDialog" :base="base" :object-pool="objectPool" :object-type="objectType" @close="closeDialogs" />
    </v-dialog>
    <!-- <v-dialog v-model="dialogDelete" width="600" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true">
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
    </v-dialog> -->
  </div>
</template>

<script>
import Rights from '@/global/atviseRightsMixin'
export default {
  mixins: [
    Rights
  ],
  props: {
    selected: {
      type: Array,
      default: () => { return [] }
    },
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
    objectTypes: {
      type: Array,
      default: () => { return [] }
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
      default: 'AGENT.OBJECTS.FOU.tanks'
    },
    showParent: {
      type: Boolean,
      default: false
    },
    addForm: {
      type: String,
      default: 'crud-add-form'
    },
    editForm: {
      type: String,
      default: 'crud-add-form'
    }
  },
  data () {
    return {
      // search: '',
      toggleList: undefined,
      // myBase: '',
      addDialog: false,
      editDialog: false,
      copyDialog: false,
      // dialog: false,
      // dialogDelete: false,
      // dialogReference: false,
      // dialogDeleteReference: false,
      // ObjectTypeToAdd: '',
      // referenceToRemove: '',
      items: [],
      // editedIndex: -1,
      editedItem: {
        nodeid: '',
        browsename: '',
        displayname: '',
        description: '',
        typeDefinition: ''
      },
      defaultItem: {
        nodeid: '',
        browsename: '',
        displayname: '',
        description: '',
        typeDefinition: ''
      }
    }
  },
  computed: {
    showList () {
      return this.asList || this.$vuetify.breakpoint.smAndDown
    }
  },
  mounted () {
    this.toggleList = this.asList ? 1 : 0
    // this.getItems().then((data) => {
    //   this.items = Object.keys(data).map((i) => {
    //     return data[i]
    //   })
    // })
  },
  methods: {
    // getItems () {
    //   return new Promise((resolve) => {
    //     const filter = {
    //       startAddress: this.base,
    //       endLevel: 0,
    //       vTypes: ['ObjectTypes.PROJECT'],
    //       mapping: ['browsename:browsename', 'displayname:displayname', 'nodeid:nodeid:splitnamespace', 'description:description', 'typedefinition:typedefinition']
    //     }
    //     top.webMI.data.call('BrowseNodes', filter, (data) => {
    //       resolve(data)
    //     })
    //   })
    // },
    closeDialogs () {
      this.addDialog = false
      this.editDialog = false
      this.copyDialog = false
      this.$emit('update')
    },
    edit () {
      this.editedItem = this.selected[0]
      this.editDialog = true
    },
    add (item, type) {
      this.editedItem = this.defaultItem
      this.editedItem.typeDefinition = type
      // this.addDialog = true
      if (this.addCopy === true) {
        this.copyDialog = true
      } else {
        this.addDialog = true
      }
      // this.ObjectTypeToAdd = type
      // if (this.addReference === true) {
      //   this.dialogReference = true
      // } else if (this.addCopy === true) {
      //   this.dialogCopy = true
      // } else {
      //   if (this.defaultPrefix.length > 0) {
      //     const number = this.items.length + 1
      //     const browsename = this.defaultPrefix + ('000' + number).slice(-4)
      //     this.editedItem.browsename = browsename
      //   }
      //   this.dialog = true
      // }
    }
  }
}
</script>

<style>

</style>
