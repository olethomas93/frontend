<template>
  <v-data-table
    v-model="selected"
    :loading="loading"
    :items="items"
    :headers="headers"
    :items-per-page="100"
    item-key="condition"
    :search="search"
    :show-select="true"
    multi-sort
    height="600"
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
            :dense="false"
            clearable
            @keydown.stop=""
          />
        </v-col>
        <v-col />
        <!-- <v-col cols="1">
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
        </v-col> -->
      </v-row>
    </template>
    <template #expanded-item="{ item }">
      <td :colspan="headers.length">
        <pre style="max-width:200px">{{ JSON.stringify(item, null, 2) }}</pre>
      </td>
    </template>
    <template #[`item.area`]="{item}">
      {{ item.area.toUpperCase() }}
    </template>
    <template #[`item.system`]="{item}">
      {{ item.system }} - {{ item.systemName }}
    </template>
    <template #[`item.component`]="{item}">
      {{ item.component }} - {{ item.componentName }}
    </template>
    <!--
    <template #[`item.alarmText`]="{ item }">
      <v-edit-dialog
        :return-value.sync="item.alarmText"
        large
        persistent
        @save="setValue(item, 'alarmText')"
      >
        {{ item.alarmText }}
        <template #input>
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
      <v-simple-checkbox v-if="item.alarmLimit === true || item.alarmLimit === false" v-model="item.alarmLimit" :disabled="!isAdmin" :ripple="false" @input="setValue(item, 'alarmLimit')" />
      <v-edit-dialog
        v-else
        large
        persistent
        :return-value.sync="item.alarmLimit"
        @save="setValue(item, 'alarmLimit')"
      >
        {{ item.alarmLimit }}
        <template #input>
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
      <v-simple-checkbox v-model="item.email" :ripple="false" @click="setValue(item, 'email')" />
    </template>

    <template #[`item.sms`]="{ item }">
      <v-simple-checkbox v-model="item.sms" :ripple="false" @click="setValue(item, 'sms')" />
    </template>
    <template #[`item.enabled`]="{ item }">
      <v-switch
        v-if="item.alarmConfig.base"
        v-model="item.enabled"
        :hide-details="false"
        @change="setValue(item, 'enabled')"
      />
    </template> -->
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    // items: [],
    headers: [],
    expanded: [],
    selected: [],
    search: '',
    loading: false
  }),
  computed: {
    base () {
      return `AGENT.OBJECTS.customers.${this.$route.params.customerId}`
    },
    isAdmin () {
      return top.webMI.hasRight('USER.isAdmin')
    },
    items () {
      return this.$store.state.alarming.conditions.filter((item) => {
        return item.condition.includes('AGENT.OBJECTS')
      }) // .slice(0, 500)
    }
  },
  mounted () {
    this.headers = [
      { text: 'base', value: 'base', groupable: false, filterable: true, align: ' d-none' }, // d-none skjuler kolonne men gjør at den fortsatt er søkbar
      { text: 'Område', value: 'area', groupable: true, width: 40 },
      { text: 'System', value: 'system', filterable: true, groupable: true, width: 200 },
      { text: 'Komponent', value: 'component', groupable: true, width: 200 },
      // { text: 'Beskrivelse', value: 'componentName', groupable: true, width: 150 },
      // { text: 'Alarm', value: 'description', groupable: true, width: 100 },
      { text: 'Alarm tekst', value: 'activeMessage', groupable: true }
      // { text: 'Grense', value: 'alarmLimit', groupable: false, width: 60 },
      // { text: 'Aktivert', value: 'enabled', groupable: false, width: 60 }
      // { text: 'Epost', value: 'email', groupable: false, width: 60 },
      // { text: 'Sms', value: 'sms', groupable: false, width: 60 }

    ]
    // this.loadAlarmCfg()
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
      // this.items = this.$store.state.alarming.conditions
      // this.loading = false
      // top.webMI.data.call('GetAlarmLimit', { startAddress: this.base }, (data) => {
      //   this.items = data
      //   this.loading = false
      // })
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
