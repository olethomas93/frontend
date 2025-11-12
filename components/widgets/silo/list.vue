<template>
  <div v-if="silos2.length > 0">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :header-props="headerProps"
      item-key="nodeid"
      :items="silos2"
      :items-per-page="15"
      :show-select="!mini"
      _dense="mini"
      :show-expand="!mini"
      single-expand
      hide-default-footer
      mobile-breakpoint="0"
      class="elevation-2"
      @click:row="openDialog"
    >
      <template #expanded-item="{ item, headers }">
        <td :colspan="headers.length">
          Fòrtype:
          <pre>{{ JSON.stringify(item.data.feed, null, 2) }}</pre>
        </td>
      </template>
      <template #[`item.data.kg`]="{ item }">
        {{ (item.data.kg / 1000).toFixed(0) }} t / {{ (item.data.capacity / 1000).toFixed(0) }} t
      </template>
      <template #[`item.data.percent`]="{ item }">
        <horizontal-bar :text="(item.data.kg/1000).toFixed(1) + ' t'" :percent="item.data.percent" style="height:50%;width:100%;" class="ma-auto" />
      </template>
      <template #[`item.data.feed.type`]="{ item }">
        <p class="text-truncate" style="display:block;margin:0;min-width:120px;">
          {{ item.data.feed.type }}
        </p>
      </template>
      <template #[`item.startScan`]="{ item }">
        <v-btn v-if="item.id != 99" x-small>
          Start scan
        </v-btn>
      </template>
      <template #[`item.alarms`]="{ item }">
        <alarm-icon :node-id="item.nodeid.split('=')[2]" overlap />
      </template>
      <template #[`item.settings`]="{ item }">
        <data-table-widget-settings-icon v-if="rights.write || rights.engineer" :item="item" />
      </template>

      <template v-if="!mini" #[`body.prepend`]="{ headers }">
        <tr>
          <td colspan="2" />
          <td :colspan="1">
            TOTAL
          </td>
          <td :colspan="1">
            {{ total }} t / {{ capacity }} t
          </td>
          <td :colspan="1">
            <horizontal-bar :percent="percent" style="height:50%;width:100%;" class="ma-auto" />
          </td>
          <td :colspan="headers.length - 5" />
        </tr>
      </template>

      <template v-if="!mini" #footer>
        <v-divider />
        <div class="pa-3">
          <silo-feed-editor text="Endre fòrtype" :disabled="selected < 1" @selected="updateFeedType" />
          <v-btn
            :disabled="selected.length == 0"
            outlined
            @click="startScan()"
          >
            Start scan
          </v-btn>
          <v-btn
            style="position:absolute;right: 1%;"
            :disabled="selected.length == 0"
            outlined
            @click="startZero()"
          >
            {{ $T('Zero') }}
          </v-btn>
          <!-- <v-btn
            outlined
            @click="alarmDialog = true"
          >
            Alarmgrenser
          </v-btn> -->
        </div>
      </template>
    </v-data-table>
    <silo-dialog v-if="showDialog" show="showDialog" :base="dialogBase" @close="closeDialog" />
    <silo-dialog-v-3 v-if="showDialog_v3" :show="showDialog_v3" :base="dialogBase" @close="closeDialog" />
  </div>
  <sensors-no-sensors v-else />
</template>

<script>
// import siloDialog from '../silo/dialog.vue'
// import siloDialogV3 from '../silo/dialog_v3.vue'
import HorizontalBar from '@/components/common/horizontalBar'
import AlarmIcon from '@/components/common/alarm/iconButton.vue'
import { webMI } from '@/global/webMI_mixin'
import Rights from '@/global/atviseRightsMixin'

export default {
  name: 'SilosList',
  components: {
    HorizontalBar,
    // siloDialog,
    // siloDialogV3,
    AlarmIcon
  },
  mixins: [
    webMI,
    Rights
  ],
  props: {
    base: {
      type: String,
      default: undefined
    },
    mini: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    headerProps: {
      sortByText: 'Custom Sort By Text'
    },
    dialogBase: '',
    showDialog: false,
    showDialog_v3: false,
    expanded: [],
    apiService: null,
    silos2: [],
    selected: [],
    capacity: 0,
    total: 0,
    percent: 0
  }),
  computed: {
    headers () {
      let headers = []
      if (this.mini) {
        headers = [
          { text: 'Navn', value: 'displayname', width: 80 },
          { text: 'Beholdning (t)', value: 'data.kg', width: 150 },
          { text: 'Beholdning (%)', value: 'data.percent', width: '50%' }
        ]
      } else {
        headers = [
          { text: 'Navn', value: 'displayname', width: 100 },
          { text: 'Beholdning (t)', value: 'data.kg', width: 150 },
          { text: 'Beholdning (%)', value: 'data.percent', width: 200 },
          { text: 'Forbruk i dag', value: 'data.today', width: 200 },
          { text: 'Forbruk i går', value: 'data.yesterday', width: 200 },
          { text: 'Fortype', value: 'data.feed.type' },
          { text: 'Sist oppdatert', value: 'data.timestamp', width: 150 },
          { text: '', value: 'settings', width: '50px' },
          { text: '', value: 'alarms', width: '50px' }
        ]
      }
      return headers
    }
  },
  async mounted () {
    // Get silo data
    let silos = await this.getSilos()
    // Lets add trailing 0 infront of displayname
    silos = silos.map((row) => {
      const trailZeroName = 'Silo ' + row.displayname.split('silo')[1].padStart(2, '0')
      row.displayname = trailZeroName
      return row
    })
    // Lets zort it
    silos = this.$lodash.sortBy(silos, ['displayname'])
    await this.getSilosData(silos)
    this.getTotalData()
    this.interval = setInterval(() => {
      this.getSilosData(silos)
    }, 60000)
  },
  destroyed () {
    clearInterval(this.interval)
  },
  methods: {
    startScan () {
      this.selected.map(async (silo) => {
        try {
          await this.webMI.data.write(silo.nodeid.split('=')[2] + '.sls1.hmiCmd', 1)
          this.$set(silo, 'data.timestamp', 'Scanner...')
          return ''
        } catch (error) {
          console.error(error)
        }
      })
      this.selected = []
    },
    startZero () {
      this.selected.map(async (silo) => {
        try {
          await this.webMI.data.write(silo.nodeid.split('=')[2] + '.config.man_trigger_zero_out', 1)
          this.$set(silo, 'data.timestamp', 'Nullstiller...')
          return ''
        } catch (error) {
          console.error(error)
        }
      })
      this.selected = []
    },
    getSilos () {
      return new Promise((resolve, reject) => {
        const filter = {
          mapping: ['nodeid:nodeid', 'browsename:browsename', 'displayname:displayname', 'typedefinition:typedefinition'],
          startAddress: this.base || this.$route.query.base,
          vTypes: ['ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType.Unit_Silo_v2', 'ObjectTypes.PROJECT.BaseObjectTypeJMH.UnitType.Unit_Silo_v3'],
          endLevel: 0
        }
        top.webMI.data.call('BrowseNodes', filter, (data) => {
          const arr = Object.keys(data).map((i) => {
            return data[i]
          })
          resolve(arr)
        })
      })
    },
    async getSilosData (silos) {
      await Promise.all(
        silos.map(async (silo) => {
          const data = await this.getSiloData(silo)
          silo.data = data
          return silo
        })
      )
      this.silos2 = silos
    },
    getSiloData (silo) {
      return new Promise((resolve, reject) => {
        const base = silo.nodeid.split('=')[2]
        const nodes = [
          `${base}.kg`,
          `${base}.percent`,
          `${base}.config.feed_type`,
          `${base}.config.feed_supplier`,
          `${base}.config.feed_density`,
          `${base}.config.feed_size`,
          `${base}.config.capacity`,
          `${base}.consumption.today`,
          `${base}.consumption.yesterday`,
          `${base}.device_uid`,
          `${base}.config.meta`,
          `${base}.sls1.running`
        ]
        this.webMI.data.read(nodes).then((data) => {
          const ret = {
            kg: data[0].value > -1000 ? Math.abs(data[0].value) : data[0].value || 0,
            percent: data[1].value || 0,
            feed: {
              type: data[2].value || '',
              supplier: data[3].value || '',
              density: data[4].value || 0,
              size: data[5].value || 0
            },
            capacity: data[6].value || 0,
            today: parseInt(data[7].value),
            yesterday: parseInt(data[8].value),
            timestamp: data[11].value ? 'Scanner...' : this.$moment(data[0].timestamp).fromNow()
          }
          resolve(ret)
        })
      })
    },
    async getTotalData () {
      const base = this.$route.query.base
      const nodes = [
        `${base}.feed.capacity`,
        `${base}.feed.kg`,
        `${base}.feed.percent`
      ]
      const data = await this.webMI.data.read(nodes)
      this.capacity = parseInt(data[0].value / 1000)
      this.total = parseInt(data[1].value / 1000)
      this.percent = data[2].value
      // this.webMI.data.read(nodes, (data) => {
      //   this.capacity = parseInt(data[0].value / 1000)
      //   this.total = parseInt(data[1].value / 1000)
      //   this.percent = data[2].value
      // })
    },
    openDialog (data) {
      this.dialogBase = data.nodeid.split('=')[2]
      if (data.typedefinition.includes('.Unit_Silo_v3')) {
        this.showDialog_v3 = true
      } else {
        this.showDialog = true
      }
    },
    closeDialog () {
      this.dialogBase = ''
      this.showDialog_v3 = false
      this.showDialog = false
    },
    async updateFeedType (event) {
      const toWrite = []
      this.selected.map((item) => {
        toWrite.push(
          {
            nodeid: `${item.nodeid}.config.feed_density`,
            value: event.density
          }
        )
        toWrite.push(
          {
            nodeid: `${item.nodeid}.config.feed_size`,
            value: event.size
          }
        )
        toWrite.push(
          {
            nodeid: `${item.nodeid}.config.feed_supplier`,
            value: event.supplier
          }
        )
        toWrite.push(
          {
            nodeid: `${item.nodeid}.config.feed_type`,
            value: event.name
          }
        )
        return toWrite
      })
      const nodes = toWrite.map((item) => { return item.nodeid.split('=')[2] })
      const values = toWrite.map((item) => { return item.value })
      await this.webMI.data.write(nodes, values)
      this.selected = []
      this.getSilosData(this.silos2)
    }
  }
}

</script>

<style>
</style>
