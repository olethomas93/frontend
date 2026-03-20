<template>
  <v-card>
    <v-card-title>
      Group
    </v-card-title>
    <v-card-text>
      <draggable :list="contacts" handle=".handle" :disabled="!isEscalation">
        <template v-for="contact in contacts" :key="contact.ID">
          <v-card>
            <v-list-item>
              <v-list-item-icon v-if="isEscalation" class="handle">
                <v-icon>mdi-drag</v-icon>
              </v-list-item-icon>
              
                <v-list-item-title>{{ contact.Name }}</v-list-item-title>
                <v-list-item-subtitle>{{ contact.Number }}</v-list-item-subtitle>
              
            </v-list-item>
          </v-card>
        </template>
      </draggable>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="variant="outlined"" @click="$emit('close')">
        Cancel
      </v-btn>
      <v-btn color="primary" @click="save">
        Confirm
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    group: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      show: true,
      contacts: undefined
    }
  },
  computed: {
    isEscalation () {
      return this.group.is_escalation === 'true'
    }
  },
  watch: {
    group: {
      deep: true,
      immediate: true,
      async handler () {
        this.contacts = await this.groupMembersRead(this.group.ID)
      }
    }
  },
  mounted () {
  },
  methods: {
    save () {
      const temp = this.contacts.map((contact, index) => {
        return {
          priority: index + 1,
          id_pbk: contact.ID,
          id_pbk_groups: this.group.ID
        }
      })
      const options = {
        method: 'nodered.group_priority_write',
        params: JSON.stringify(temp)
      }
      top.webMI.data.call('SMSEagle', options)
      // console.log(temp)
      this.$emit('close')
    },
    groupMembersRead (id) {
      return new Promise((resolve) => {
        const options = {
          method: 'nodered.group_priority_read',
          params: JSON.stringify({
            public: '1',
            group_id: id
          })
        }
        top.webMI.data.call('SMSEagle', options, (data) => {
          resolve(data)
        })
      })
    }
  }
}
</script>

<style>

</style>
