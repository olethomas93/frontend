<template>
  <v-data-table
    v-model="selected"
    :loading="loading"
    :items="items"
    :headers="headers"
    :items-per-page="-1"
    item-key="nodeId"
    :search="search"
    :show-select="true"
    show-group-by
    :show-expand="true"
    single-expand
    expanded.sync="expanded"
  >
    <template #top>
      <v-row v-if="$vuetify.breakpoint.mdAndUp">
        <v-col cols="4">
          <v-text-field
            v-model="search"
            hide-details
            label="Søk"
            class="mx-4"
            
            clearable
            @keydown.stop=""
          />
        </v-col>
        <v-col />
        <!-- <v-col>
          <v-text-field :disabled="selected.length == 0" clearable @change="setMultiple(selected, 'alarmText', $event)" @keydown.stop="" />
        </v-col> -->
        <!-- <v-col cols="1" /> -->
        <v-col cols="1">
          <v-btn icon :disabled="selected.length == 0" @click="setMultiple(selected, 'email', true)">
            <v-icon>
              mdi-checkbox-multiple-marked
            </v-icon>
          </v-btn>
          <v-btn icon :disabled="selected.length == 0" @click="setMultiple(selected, 'email', false)">
            <v-icon>
              mdi-checkbox-multiple-blank-outline
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn icon :disabled="selected.length == 0" @click="setMultiple(selected, 'sms', true)">
            <v-icon>
              mdi-checkbox-multiple-marked
            </v-icon>
          </v-btn>
          <v-btn icon :disabled="selected.length == 0" @click="setMultiple(selected, 'sms', false)">
            <v-icon>
              mdi-checkbox-multiple-blank-outline
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template #expanded-item="{ item }">
      <td :colspan="headers.length">
        <pre style="max-width:200px">{{ JSON.stringify(item, null, 2) }}</pre>
      </td>
    </template>

    <template #[`item.alarmText`]="{ item }">
      <!-- <v-text-field v-model="item.alarmText" @change="setValue(item, 'alarmText')" /> -->
      <v-edit-dialog
        :return-value.sync="item.alarmText"
        large
        persistent
        @save="setValue(item, 'alarmText')"
      >
        {{ item.alarmText }}
        <template #input>
          <!-- keydown.8.stop Stopper event bubbling av backspace, Atvise vil kansellere den -->
          <v-text-field
            v-model="item.alarmText"
            label="Edit"
            single-line
            counter
            @keydown.8.stop=""
          />
        </template>
      </v-edit-dialog>
    </template>

    <template #[`item.alarmLimit`]="{ item }">
      <v-checkbox v-if="item.alarmLimit === true || item.alarmLimit === false" v-model="item.alarmLimit" :disabled="!isAdmin" :ripple="false" @input="setValue(item, 'alarmLimit')" />
      <!-- <v-text-field v-else v-model="item.alarmLimit" /> -->
      <v-edit-dialog
        v-else
        large
        persistent
        :return-value.sync="item.alarmLimit"
        @save="setValue(item, 'alarmLimit')"
      >
        {{ item.alarmLimit }}
        <template #input>
          <!-- keydown.8.stop Stopper event bubbling av backspace, Atvise vil kansellere den -->
          <v-text-field
            v-model="item.alarmLimit"
            label="Edit"
            single-line
            type="number"
            step="0.1"
            counter
            @keydown.8.stop=""
          />
        </template>
      </v-edit-dialog>
    </template>

    <template #[`item.email`]="{ item }">
      <!-- <v-icon v-if="item.email" color="green">
        mdi-check-bold
      </v-icon> -->
      <v-checkbox v-model="item.email" :ripple="false" @click="setValue(item, 'email')" />
    </template>

    <template #[`item.sms`]="{ item }">
      <!-- <v-icon v-if="item.sms" color="green">
        mdi-check-bold
      </v-icon> -->
      <v-checkbox v-model="item.sms" :ripple="false" @click="setValue(item, 'sms')" />
    </template>
    <template #[`item.enabled`]="{ item }">
      <v-switch
        v-if="item.alarmConfig.base"
        v-model="item.enabled"
        :hide-details="false"
        @change="setValue(item, 'enabled')"
      />
    </template>
    <!-- <template v-slot:[`item.alarmConfig.enabled`]="{ item }">
      <v-switch
        v-if="item.alarmConfig.base"
        v-model="item.alarmConfig.enabled"
        :hide-details="false"
        @change="alarmDisable(item, $event)"
      />
    </template> -->
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    items: [],
    headers: [],
    expanded: [],
    selected: [],
    search: '',
    loading: true
  }),
  computed: {
    base () {
      return `AGENT.OBJECTS.customers.${this.$route.params.customerId}`
    },
    isAdmin () {
      return top.webMI.hasRight('USER.isAdmin')
    }
  },
  mounted () {
    this.headers = [
      { text: 'nodeId', value: 'nodeId', groupable: false, filterable: true, align: ' d-none' }, // d-none skjuler kolonne men gjør at den fortsatt er søkbar
      { text: 'Lokasjon ID', value: 'locationId', groupable: true, width: 40 },
      { text: 'Lokasjon', value: 'locationName', filterable: true, groupable: true, width: 150 },
      { text: 'Tag', value: 'componentId', groupable: true, width: 40 },
      { text: 'Beskrivelse', value: 'componentName', groupable: true, width: 150 },
      { text: 'Alarm', value: 'description', groupable: true, width: 100 },
      { text: 'Alarm tekst', value: 'alarmText', groupable: true, width: 200 },
      { text: 'Grense', value: 'alarmLimit', groupable: false, width: 60 },
      { text: 'Aktivert', value: 'enabled', groupable: false, width: 60 },
      { text: 'Epost', value: 'email', groupable: false, width: 60 },
      { text: 'Sms', value: 'sms', groupable: false, width: 60 }

    ]
    this.loadAlarmCfg()
  },
  methods: {
    alarmDisable (item, value) {
      if (value) {
        top.webMI.data.call('AlarmEnable', { address: item.alarmAddress })
      } else {
        top.webMI.data.call('AlarmDisable', { address: item.alarmAddress })
      }
    },
    loadAlarmCfg () {
      top.webMI.data.call('GetAlarmLimit', { startAddress: this.base }, (data) => {
        this.items = data
        this.loading = false
      })
    },
    setValue (item, node) {
      if (node === 'alarmLimit') {
        top.webMI.data.write([`${item.nodeId.split('=')[2]}`], [item[node]])
      } else {
        top.webMI.data.write([`${item.nodeId.split('=')[2]}.${node}`], [item[node]])
      }
    },
    setMultiple (items, node = 'sms', value) {
      const nodeIds = []
      const values = []
      items.forEach((item) => {
        nodeIds.push(`${item.nodeId.split('=')[2]}.${node}`)
        values.push(value)
      })
      // console.log(nodeIds, values)
      top.webMI.data.write(nodeIds, values, () => {
        // console.log('write done')
        this.loadAlarmCfg()
      })
    }
  }
}
</script>

<style>

</style>
