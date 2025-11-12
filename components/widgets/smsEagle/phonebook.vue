<template>
  <div>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :disable-sort="false"
      :items="items"
      :loading="loading"
      :loading-text="$T('Loading contacts')"
      :no-data-text="error"
      :sort-by="['Name']"
    >
      <template #top>
        <v-toolbar>
          <v-toolbar-title>
            {{ $T('Contacts') }}
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <v-btn :outlined="true" color="primary" :small="false" @click="dialog=true">
            {{ $T('Add contact') }}
          </v-btn>
        </v-toolbar>
      </template>
      <template #[`item.groups`]="{ item }">
        <v-chip v-for="i in item.groups" :key="i.ID">
          {{ i.Name }}
        </v-chip>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon class="mr-2" :small="true" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon :small="true" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" :persistent="true" width="600">
      <form-list
        v-model="editedItem"
        :title="editedIndex === -1 ? $T('Add contact') : $T('Edit contact')"
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
        :title="$T('Delete contact?')"
        :buttons="true"
        :schema="form2"
        @submit="deleteItemConfirm"
        @close="closeDelete"
      />
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
      items: [],
      groups: [],
      editedIndex: -1,
      editedItem: {
        Name: '',
        Number: ''
      },
      defaultItem: {
        Name: '',
        Number: ''
      },
      error: ''
    }
  },
  computed: {
    headers () {
      return [
        { text: this.$T('ID'), value: 'ID' },
        { text: this.$T('Name'), value: 'Name', sortable: true },
        { text: this.$T('Phone'), value: 'Number' },
        { text: this.$T('Email'), value: 'email' },
        { text: this.$T('Groups'), value: 'groups' },
        { text: this.$T('Actions'), value: 'actions' }
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
              },
              {
                type: 'v-text-field',
                model: 'Number',
                props: {
                  outlined: true,
                  label: this.$T('Number'),
                  required: true
                }
              },
              {
                type: 'v-text-field',
                model: 'email',
                props: {
                  outlined: true,
                  label: this.$T('Email'),
                  required: true
                }
              },
              {
                type: 'v-autocomplete',
                model: 'groups',
                props: {
                  items: this.groups,
                  outlined: true,
                  label: this.$T('Group(s)'),
                  required: true,
                  itemText: 'Name',
                  itemValue: 'ID',
                  chips: true,
                  deletableChips: true,
                  clearable: true,
                  multiple: true
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
              },
              {
                type: 'v-text-field',
                model: 'Number',
                props: {
                  outlined: true,
                  label: this.$T('Number'),
                  required: true,
                  disabled: true
                }
              },
              {
                type: 'v-text-field',
                model: 'email',
                props: {
                  outlined: true,
                  label: this.$T('Email'),
                  required: true,
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
        const contacts = await this.contactRead()
        const groups = await this.groupRead()
        await Promise.all(
          groups.map(async (item) => {
            const members = await this.groupMembersRead(item.ID)
            if (members) {
              members.forEach((member) => {
                const i = this.$lodash.findIndex(contacts, (o) => { return o.ID === member.ID })
                if (contacts[i].groups) {
                  contacts[i].groups.push(item)
                } else {
                  contacts[i].groups = [item]
                }
              })
            }
            return item
          })
        )
        this.items = contacts
        this.groups = groups
        this.loading = false
      } catch (error) {
        this.error = error.errorstring
        this.loading = false
        console.error(error)
      }
    },
    alert (message) {
      if (message.status !== 'ok') {
        this.$store.commit('SET_CUSTOM_ALERT', { message: message.error_text })
      }
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
          // this.alert(data.result)
          resolve(data.result.groups)
          // this.groups = data.result.groups
        })
      })
    },
    groupAddcontact (groupId, contactId) {
      const options = {
        method: 'phonebook.group_addcontact',
        params: JSON.stringify({
          public: '1',
          group_id: groupId,
          contact_id: contactId.toString()
        })
      }
      top.webMI.data.call('SMSEagle', options, (data) => {
        console.log(data)
        // (data.result.groups)
        // this.groups = data.result.groups
      })
    },
    groupRemovecontact (groupId, contactId) {
      const options = {
        method: 'phonebook.group_removecontact',
        params: JSON.stringify({
          public: '1',
          group_id: groupId,
          contact_id: contactId.toString()
        })
      }
      top.webMI.data.call('SMSEagle', options, (data) => {
        console.log(data)
        // (data.result.groups)
        // this.groups = data.result.groups
      })
    },
    groupMembersRead (id) {
      return new Promise((resolve) => {
        const options = {
          method: 'phonebook.group_members_read',
          params: JSON.stringify({
            public: '1',
            group_id: id
          })
        }
        top.webMI.data.call('SMSEagle', options, (data) => {
          console.log('Group members: ', data.result)
          resolve(data.result.contacts)
          // this.alert(data.result)
          // this.groups = data.result.groups
        })
      })
    },
    contactCreate (item) {
      const options = {
        method: 'phonebook.contact_create',
        params: JSON.stringify({
          contactname: item.Name,
          number: item.Number,
          email: item.email,
          public: '1'
        })
      }
      top.webMI.data.call('SMSEagle', options, (data) => {
        console.log(data.result)
        this.alert(data.result)
        if (data.result.status === 'ok') {
          // setTimeout(() => {
          item.groups.forEach((group) => {
            console.log(group, data.result.contact_id)
            this.groupAddcontact(group, data.result.contact_id)
          })
          // }, 500)
        }
        // this.items = data.result.contacts
      })
    },
    contactRead () {
      return new Promise((resolve, reject) => {
        const options = {
          method: 'phonebook.contact_read',
          params: JSON.stringify({
            public: '1'
          })
        }
        top.webMI.data.call('SMSEagle', options, (data) => {
          if (data.error) {
            reject(data)
          }
          this.alert(data.result)
          resolve(data.result.contacts)
          // this.items = data.result.contacts
        })
      })
    },
    contactUpdate (item) {
      const options = {
        method: 'phonebook.contact_update',
        params: JSON.stringify({
          contact_id: item.ID,
          contactname: item.Name,
          email: item.email,
          number: item.Number,
          public: '1'
        })
      }
      top.webMI.data.call('SMSEagle', options, (data) => {
        this.alert(data.result)
      })
    },
    contactDelete (item) {
      const options = {
        method: 'phonebook.contact_delete',
        params: JSON.stringify({
          contact_id: item.ID,
          contactname: item.Name
        })
      }
      top.webMI.data.call('SMSEagle', options, (data) => {
        this.alert(data.result)
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
        const { toDelete, toAdd } = this.getGroupChanges()
        toDelete.forEach((group) => { this.groupRemovecontact(group, this.editedIndex) })
        toAdd.forEach((group) => { this.groupAddcontact(group, this.editedIndex) })
        this.contactUpdate(this.editedItem)
      } else {
        this.contactCreate(this.editedItem)
      }
      this.close()
    },
    getGroupChanges () {
      const index = this.$lodash.findIndex(this.items, (o) => { return o.ID === this.editedIndex })
      const original = this.items[index]
      const originalGroups = this.$lodash.get(original, 'groups', []).map((group) => { return group.ID })
      const newGroups = this.$lodash.get(this.editedItem, 'groups', []).map((group) => { return group.ID || group })
      console.log('originalGroups: ', originalGroups)
      console.log('newGroups: ', newGroups)
      const toDelete = this.$lodash.difference(originalGroups, newGroups)
      const toAdd = this.$lodash.difference(newGroups, originalGroups)
      console.log('toDelete: ', toDelete)
      console.log('toAdd: ', toAdd)
      return { toDelete, toAdd }
    },
    deleteItem (item) {
      this.editedIndex = item.ID
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.closeDelete()
      this.contactDelete(this.editedItem)
    },
    closeDelete () {
      this.dialogDelete = false
      setTimeout(this.init, 500)
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
