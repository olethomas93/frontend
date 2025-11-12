<template>
  <div>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :disable-sort="true"
      :items="items"
      :loading="loading"
      :loading-text="$T('Loading groups')"
      :no-data-text="error"
      @click:row="openDialog"
    >
      <template #top>
        <v-toolbar>
          <v-toolbar-title>
            {{ $T('Groups') }}
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <!-- <v-btn :outlined="true" color="primary" :small="false" @click="dialog=true">
            {{ $T('Add group') }}
          </v-btn> -->
        </v-toolbar>
      </template>
      <template #[`item.is_escalation`]="{ item }">
        <v-icon v-if="item.is_escalation === 'true'">
          mdi-check
        </v-icon>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon class="mr-2" :small="true" @click.stop="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon :small="true" @click.stop="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true" width="600">
      <form-list
        v-model="editedItem"
        :title="editedIndex === -1 ? $T('Add group') : $T('Edit group')"
        :cancel-text="$T('Cancel')"
        :buttons="true"
        :schema="form1"
        :confirm-text="$T('Confirm')"
        @submit="save"
        @close="close"
      />
    </v-dialog>
    <v-dialog v-model="dialogDelete" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true" width="600">
      <form-list
        v-model="editedItem"
        :title="$T('Delete group?')"
        :buttons="true"
        :schema="form2"
        @submit="deleteItemConfirm"
        @close="closeDelete"
      />
    </v-dialog>
    <v-dialog v-model="dialogGroup" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true" width="600">
      <sms-eagle-group :group="selectedGroup" @close="dialogGroup = false" />
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      dialog: false,
      dialogDelete: false,
      dialogGroup: false,
      items: [],
      editedIndex: -1,
      editedItem: {
        Name: '',
        Number: ''
      },
      defaultItem: {
        Name: '',
        Number: ''
      },
      selectedGroup: undefined,
      error: ''
    }
  },
  computed: {
    headers () {
      return [
        { text: this.$T('ID'), value: 'ID' },
        { text: this.$T('Name'), value: 'Name' },
        { text: this.$T('Escalation'), value: 'is_escalation' }
        // { text: this.$T('Actions'), value: 'actions' }
      ]
    },
    form1 () {
      return {
        columns: [
          {
            cols: 12,
            fields: [
              {
                type: 'v-text-field',
                model: 'ID',
                props: {
                  style: '{width:50%}',
                  outlined: true,
                  label: this.$T('ID'),
                  disabled: true
                }
              },
              {
                type: 'v-text-field',
                model: 'Name',
                props: {
                  style: '{width:50%}',
                  outlined: true,
                  label: this.$T('Name')
                }
              }
            ]
          }
        ]
      }
    },
    form2 () {
      return {
        columns: [
          {
            cols: 12,
            fields: [
              {
                type: 'v-text-field',
                model: 'ID',
                props: {
                  style: '{width:50%}',
                  outlined: true,
                  label: this.$T('ID'),
                  disabled: true
                }
              },
              {
                type: 'v-text-field',
                model: 'Name',
                props: {
                  style: '{width:50%}',
                  outlined: true,
                  label: this.$T('Name'),
                  disabled: true
                }
              }
            ]
          }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      try {
        this.items = await this.groupRead()
        this.loading = false
      } catch (error) {
        this.error = error.errorstring
        this.loading = false
      }
    },
    alert (message) {
      if (message.status !== 'ok') {
        this.$store.commit('SET_CUSTOM_ALERT', { message: message.error_text })
      }
    },
    groupCreate (group) {
      const options = {
        method: 'phonebook.group_create',
        params: JSON.stringify({
          public: '1',
          groupname: group.Name
        })
      }
      top.webMI.data.call('SMSEagle', options, (data) => {
        // console.log(data.result)
        this.alert(data.result)
        // resolve(data.result.groups)
        // this.groups = data.result.groups
      })
    },
    groupRead () {
      return new Promise((resolve, reject) => {
        const options = {
          method: 'phonebook.group_read',
          params: JSON.stringify({
            public: '1'
          })
        }
        top.webMI.data.call('SMSEagle', options, (data) => {
          if (data.error) {
            reject(data)
          }
          // console.log('Groups: ', data.result)
          this.alert(data.result)
          resolve(data.result.groups)
          // this.groups = data.result.groups
        })
      })
    },
    groupDelete (group) {
      const options = {
        method: 'phonebook.group_delete',
        params: JSON.stringify({
          public: '1',
          groupname: group.Name,
          group_id: group.ID
        })
      }
      top.webMI.data.call('SMSEagle', options, (data) => {
        // console.log(data.result)
        this.alert(data.result)
        // resolve(data.result.groups)
        // this.groups = data.result.groups
      })
    },
    groupUpdate (group) {
      const options = {
        method: 'phonebook.group_update',
        params: JSON.stringify({
          public: '1',
          groupname: group.Name,
          group_id: group.ID
        })
      }
      top.webMI.data.call('SMSEagle', options, (data) => {
        // console.log(data.result)
        this.alert(data.result)
        // resolve(data.result.groups)
        // this.groups = data.result.groups
      })
    },
    close () {
      this.dialog = false
      setTimeout(this.init, 500)
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    editItem (item) {
      this.editedIndex = item.ID
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    save () {
      if (this.editedIndex > -1) {
        this.groupUpdate(this.editedItem)
      } else {
        this.groupCreate(this.editedItem)
      }
      this.close()
    },
    deleteItem (item) {
      this.editedIndex = item.ID
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.closeDelete()
      this.groupDelete(this.editedItem)
    },
    closeDelete () {
      this.dialogDelete = false
      setTimeout(this.init, 500)
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    openDialog (item) {
      this.selectedGroup = item
      this.dialogGroup = true
    }
  }
}
</script>

<style>

</style>
