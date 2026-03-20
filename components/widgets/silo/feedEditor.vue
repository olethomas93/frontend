<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template #activator="{ props }">
      <v-btn v-if="!text"  icon v-bind="props">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn variant="outlined" :disabled="disabled" v-bind="props">
        {{ text }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Fortyper</span>
        <v-divider class="mx-2" inset vertical />
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Søk"
          single-line
          hide-details
          @keydown.stop=""
        />
        <v-spacer />

        <v-dialog v-model="dia" max-width="500px">
          <!-- <template v-slot:activator="{ props }">
            <v-btn color="primary" dark class="mb-2" v-bind="props">Legg til</v-btn>
          </template>-->
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
              <v-spacer />
              <v-btn variant="text" icon @click="dia = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider class="mx-0" />
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.supplier" label="Produsent" @keydown.stop="" />
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.size" label="Størrelse (mm)" @keydown.stop="" />
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.name" label="Navn" @keydown.stop="" />
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.density" label="Densitet (kg/l)" @keydown.stop="" />
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-divider class="mx-0" />
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Avbryt
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                Lagre
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn variant="text" icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <!-- </v-toolbar> -->
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="feeds"
          class="elevation-1"
          :options.sync="options"
          :search="search"
          @click:row="selectNew"
        >
          <template #items="props">
            <tr class="test" @click="selectNew(props.item)">
              <td>{{ props.item.supplier }}</td>
              <td class="text-xs-left">
                {{ props.item.size }}
              </td>
              <td class="text-xs-left">
                {{ props.item.name }}
              </td>
              <td class="text-xs-left">
                {{ props.item.density }}
              </td>
              <!-- <td class="justify-center layout px-0">
                <v-icon small class="mr-2" @click.stop="editItem(props.item)">
                  mdi-cog
                </v-icon>
                <v-icon small @click.stop="deleteItem(props.item)">
                  mdi-delete
                </v-icon>
              </td> -->
            </tr>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-icon
              small
              class="mr-2"
              @click.stop="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click.stop="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <v-alert
            slot="no-results"
            :value="true"
            color="error"
            icon="mdi-alert"
          >
            Ditt søk etter "{{ search }}" ga ingen resultater.
          </v-alert>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" dark class="mb-2" @click="dia=true">
          Legg til
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import { widget } from '@/global/mixin'
import { webMI } from '@/global/webMI_mixin'

export default {
  mixins: [webMI],
  props: {
    text: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dia: false,
    dialog: false,
    search: '',
    options: {
      itemsPerPage: -1
    },
    headers: [
      {
        text: 'Produsent',
        align: 'left',
        sortable: true,
        value: 'supplier'
      },
      { text: 'Størrelse (mm)', value: 'size' },
      { text: 'Navn', value: 'name' },
      { text: 'Densitet (kg/l)', value: 'density' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    feeds: [],
    editedIndex: -1,
    editedItem: {
      supplier: '',
      size: 0,
      name: '',
      density: 0
    },
    defaultItem: {
      supplier: '',
      size: 0,
      name: '',
      density: 0
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Ny fôrtype' : 'Editer fôrtype'
    },
    isAdmin () {
      return this.$store.getters['userData/getIsAdmin']
    }
  },

  watch: {
    dia (val) {
      val || this.close()
    },
    dialog (val) {
      if (val) {
        this.search = ''
        this.initialize()
      }
    }
  },

  mounted () {
    // this.initialize()
  },

  methods: {
    async initialize () {
      const base = this.$route.query.base
      const address = base.split('.').slice(0, 4).join('.') + '.commonData.feedTypes'
      const result = await this.webMI.data.read(address)
      this.feeds = JSON.parse(result.value)
    },
    editItem (item) {
      this.editedIndex = this.feeds.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dia = true
    },

    selectNew (item) {
      // console.log(item)
      if (
        confirm(
          'Vil du endre fortype på silo til ' +
            item.name +
            ', ' +
            item.size +
            ' mm'
        )
      ) {
        this.$emit('selected', item)
        this.dialog = false
      }
    },

    deleteItem (item) {
      const index = this.feeds.indexOf(item)
      if (confirm('Er du sikker på at du vil slette dette elementet?')) {
        this.feeds.splice(index, 1)
        this.saveChanges()
      }
    },

    close () {
      this.dia = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.feeds[this.editedIndex], this.editedItem)
      } else {
        this.feeds.push(this.editedItem)
      }
      this.saveChanges()
      this.close()
    },

    async saveChanges () {
      try {
        console.log('save!!')
        const base = this.$route.query.base
        const address = base.split('.').slice(0, 3).join('.') + '.commonData.feedTypes'
        await this.webMI.data.write(address, JSON.stringify(this.feeds))
        // await this.apiService.write([{ nodeId: 'commonData.fortyper', dataType: 'String', value: JSON.stringify(this.feeds) }], true)
      } catch (error) {
        alert(error.error)
        this.initialize()
      }
    }
  }
}
</script>

<style>
</style>
