<template>
  <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;overflow:auto;">
    <v-data-table :items="items" v-bind="tableProps">
      <template #top>
        <v-toolbar>
          <v-toolbar-title>
            {{ $T('Users') }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn color="primary" @click="Add">
            {{ $T('Add user') }}
          </v-btn>
        </v-toolbar>
      </template>
      <template #[`item.edit`]="{ item, index}">
        <v-icon @click="Edit(item, index)">
          mdi-pencil
        </v-icon>
      </template>
      <template #[`item.delete`]="{ item, index }">
        <v-icon @click="Delete(item, index)">
          mdi-trash-can
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="showDelete" width="400" persistent>
      <v-card>
        <v-card-title>
          {{ $T('Delete user') }} {{ userToDelete.username }}
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="showDelete = false">
            {{ $T('Cancel') }}
          </v-btn>
          <v-btn color="primary" @click="deleteUser">
            {{ $T('Ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showAdd" width="500" persistent>
      <v-card>
        <v-card-title>
          {{ mode === 'edit' ? $T('Edit user') : $T('Add user') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editUser.username"
              variant="filled"
              :rules="[rules.allowed, rules.counter]"
              :disabled="mode === 'edit'"
              :label="$T('Username')"
              autocomplete="off"
              @keydown.stop=""
            />
            <v-text-field v-model="editUser.fullname" variant="filled" :label="$T('Full name')" autocomplete="new" @keydown.stop="" />
            <v-text-field
              v-model="editUser.password"
              variant="filled"
              :label="$T('Password')"
              autocomplete="new-password"
              type="password"
              @keydown.stop=""
            />
            <v-textarea v-model="editUser.description" variant="filled" :label="$T('Description')" @keydown.stop="" />
            <v-select
              v-model="editUser.groups"
              :items="groups"
              :label="$T('Groups')"
              variant="filled"
              item-value="name"
              item-title="name"
              multiple
              chips
              deletable-chips
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="cancelAddUser">
            {{ $T('Cancel') }}
          </v-btn>
          <v-btn :disabled="!valid" color="primary" @click="addUser()">
            {{ $T('Ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <v-btn
      fab
      fixed
      bottom
      right
      style="right:70px;"
      color="primary"
      @click="Add"
    >
      <v-icon>
        mdi-plus
      </v-icon>
    </v-btn> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      items: [],
      groups: [],
      tableProps: {
        itemsPerPage: -1,
        headers: [
          { text: this.$T('Username'), value: 'username' },
          { text: this.$T('Full name'), value: 'name' },
          { text: this.$T('Description'), value: 'description' },
          // { text: 'Super user', value: 'superuser' },
          { text: this.$T('Edit'), value: 'edit' },
          { text: this.$T('Delete'), value: 'delete' }
        ]
      },
      showDelete: false,
      userToDelete: {
        username: '',
        colid: ''
      },
      showAdd: false,
      defaultUser: {
        username: '',
        colid: '',
        fullname: '',
        description: undefined,
        hash: '',
        language: '',
        defaultdisplay: undefined,
        contentdisplay: undefined,
        superuser: 0,
        opcua: 0,
        webmi: 1,
        password: undefined,
        groups: []
      },
      editUser: {
        username: '',
        colid: '',
        fullname: '',
        description: undefined,
        hash: '',
        language: '',
        defaultdisplay: undefined,
        contentdisplay: undefined,
        superuser: 0,
        opcua: 0,
        webmi: 1,
        password: undefined,
        groups: []
      },
      mode: '',
      rules: {
        counter: value => value.length <= 40 || 'Max 40 characters',
        allowed: (value) => {
          // const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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
  mounted () {
    this.getUsers()
    this.getGroups()
  },
  methods: {
    getUsers () {
      top.webMI.data.call('UserManagement', { mode: 'User' }, (data) => {
        this.items = data
      })
    },
    getGroups  () {
      top.webMI.data.call('UserManagement', { mode: 'Group' }, (data) => {
        this.groups = this.$lodash.sortBy(data, ['name'])
      })
    },
    Add () {
      this.showAdd = true
      this.mode = 'add'
    },
    Edit (user, index) {
      this.showAdd = true
      this.mode = 'edit'
      this.getUserData(user.username)
      this.getUserGroups(user.username)
      this.editUser.username = user.username
      this.editUser.colid = 'id_' + index
      // this.userToEdit = { username: user.username, colid: 'id_' + index }
      // this.editUser = { ...user, index }
    },
    Delete (user, index) {
      this.showDelete = true
      this.userToDelete = { username: user.username, colid: 'id_' + index }
    },
    addUser () {
      if (this.mode === 'edit') {
        const data = this.editUser
        // delete data.hash
        data.mode = 'Edit'
        top.webMI.data.call('UserManagement', data, () => {
          this.addGroupsToUser(this.editUser.username, this.editUser.groups)
          this.showAdd = false
          this.getUsers()
          this.mode = ''
          this.editUser = JSON.parse(JSON.stringify(this.defaultUser))
        })
      } else {
        const data = this.editUser
        delete data.hash
        data.mode = 'Add'
        top.webMI.data.call('UserManagement', data, () => {
          // this.addGroupsToUser(this.editUser.username, this.editUser.groups)
          this.getUsers()
          this.showAdd = false
          this.mode = ''
          this.editUser = JSON.parse(JSON.stringify(this.defaultUser))
        })
      }
    },
    addGroupsToUser (user, groups) {
      // mode: saveUsers
      // groups[]: fou_testAlleSentraler
      // groups[]: fou
      // groups[]: fou_p-0001
      // groups[]: fou_p-0002
      // check: fou1
      const data = { mode: 'saveUsers', check: user, groups }
      top.webMI.data.call('UserManagement', data)
    },
    cancelAddUser () {
      this.showAdd = false
      this.mode = ''
      this.editUser = JSON.parse(JSON.stringify(this.defaultUser))
    },
    deleteUser () {
      // console.log('Delete? ', { mode: 'Delete', ...this.userToDelete })
      top.webMI.data.call('UserManagement', { mode: 'Delete', ...this.userToDelete }, () => {
        this.showDelete = false
        this.getUsers()
      })
      // this.showDelete = false
      // this.getUsers()
    },
    getUserData (username) {
      top.webMI.data.read(['SYSTEM.SECURITY.USERS.' + username + '.name',
        'SYSTEM.SECURITY.USERS.' + username + '.password',
        'SYSTEM.SECURITY.USERS.' + username + '.language',
        'SYSTEM.SECURITY.USERS.' + username + '.display_default',
        'SYSTEM.SECURITY.USERS.' + username + '.display_content',
        'SYSTEM.SECURITY.USERS.' + username + '.superuser',
        'SYSTEM.SECURITY.USERS.' + username + '.login_opcua',
        'SYSTEM.SECURITY.USERS.' + username + '.login_webmi',
        'SYSTEM.SECURITY.USERS.' + username + '.description'
      ],
      (e) => {
        this.editUser.fullname = e[0].value
        this.editUser.hash = e[1].value
        this.editUser.language = e[2].value
        this.editUser.defaultdisplay = (e[3].value === '' || e[3].value === 0) ? undefined : e[3].value
        this.editUser.contentdisplay = (e[4].value === '' || e[4].value === 0) ? undefined : e[4].value
        this.editUser.superuser = (e[5].value === false ? 0 : 1)
        this.editUser.opcua = (e[6].value === false ? 0 : 1)
        this.editUser.webmi = (e[7].value === false ? 0 : 1)
        this.editUser.description = e[8].value
        // writeData()
      })
    },
    getUserGroups (username) {
      top.webMI.data.call('UserManagement', { mode: 'Group', check: username }, (e) => {
        this.editUser.groups = e.filter((item) => { return item.usercheck === 1 })
        this.editUser.groups = this.editUser.groups.map((item) => {
          return item.name
        })
        console.log('groups', this.editUser.groups)
      })
    }
  }
}
</script>

<style>

</style>
