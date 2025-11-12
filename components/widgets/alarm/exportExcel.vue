<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        outlined
        color="primary"
        v-bind="attrs"
        v-on="on"
        @click="startExport"
      >
        <v-icon>
          mdi-file-excel
        </v-icon>
        {{ $T('Export all events') }}
      </v-btn>
    </template>
    <v-card v-if="dialog">
      <v-card-title>
        {{ $T('Exporting....') }}
      </v-card-title>
      <v-card-text>
        {{ text }}
      </v-card-text>
      <!-- <v-divider /> -->
      <!-- <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="save"
        >
          OK
        </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script>
// This library is a part of Highcharts
// If highcharts not in use, download and add manualy
// https://github.com/exceljs/exceljs

export default {
  data () {
    return {
      dialog: false,
      conditions: []
    }
  },
  computed: {
    columns () {
      return [
        // { header: this.$T('Area'), key: 'area', width: 10 },
        { header: this.$T('Site'), key: 'site', width: 10 },
        { header: this.$T('Site description'), key: 'siteDescription', width: 30 },
        { header: this.$T('Building'), key: 'building', width: 10 },
        { header: this.$T('Building description'), key: 'buildingDescription', width: 30 },
        { header: this.$T('System'), key: 'system', width: 10 },
        { header: this.$T('System description'), key: 'systemDescription', width: 30 },
        { header: this.$T('Component'), key: 'component', width: 10 },
        { header: this.$T('Component description'), key: 'componentDescription', width: 30 },
        { header: this.$T('Active message'), key: 'activeMessage', width: 30 },
        { header: this.$T('Limit'), key: 'value', width: 10 },
        { header: this.$T('On delay'), key: 'onDelay', width: 16 },
        { header: this.$T('Enabled'), key: 'enabled', width: 10 },
        { header: this.$T('Category'), key: 'category', width: 13 }
      ]
    }
  },
  methods: {
    async startExport () {
      this.dialog = true
      this.text = 'Reading alarm conditions'
      this.conditions = await this.getConditions()
      this.text = 'Preparing spreadsheet'
      this.download()
      this.dialog = false
    },
    getConditions () {
      return new Promise((resolve, reject) => {
        top.webMI.data.call('AlarmConditions', {}, (data) => {
          console.log(data)
          resolve(data)
        })
      })
    },
    getAlarmCategory (category) {
      const name = category.split('.').pop()
      const categories = this.$store.state.alarming.categories
      const ret = this.$lodash.find(categories, (cat) => { return cat.displayname === name })
      return this.$lodash.get(ret, 'childs.Abbreviation.value', name)
    },
    prepareData () {
      // TODO: Get updated data from server before export
      // Get all conditions
      // let conditions = JSON.parse(JSON.stringify(this.$store.state.alarming.conditions))
      let conditions = this.conditions.filter((item) => {
        return item.condition.includes('AGENT.OBJECTS')
      })
      conditions = this.$lodash.orderBy(conditions, ['site', 'building', 'system', 'component'])
      return conditions.map((item) => {
        item.site = this.$T(item.site)
        item.siteDescription = this.$T(item.siteDescription)
        item.building = this.$T(item.building)
        item.buildingDescription = this.$T(item.buildingDescription)
        item.system = this.$T(item.system)
        item.systemDescription = this.$T(item.systemDescription)
        item.component = this.$T(item.component)
        item.componentDescription = this.$T(item.componentDescription)
        item.activeMessage = this.$T(item.activeMessage)
        item.onDelay = item.onDelay / 1000
        item.category = this.getAlarmCategory(item.category) // item.category.split('.').pop()
        return item
      })
    },
    download () {
      const wb = new top.ExcelJS.Workbook()
      const ws = wb.addWorksheet('Export')
      // Fryser første linje i arket
      ws.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ]
      ws.autoFilter = {
        from: 'A1',
        to: 'J1'
      }
      ws.columns = this.columns
      const data = this.prepareData()
      data.forEach((item) => {
        ws.addRow(item)
      })
      // ws.getCell('A1').value = 7
      // ws.getCell('B1').value = 'Hello, World!'
      wb.xlsx.writeBuffer({
        base64: true
      })
        .then(function (xls64) {
          // build anchor tag and attach file (works in chrome)
          const a = document.createElement('a')
          const data = new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

          const url = URL.createObjectURL(data)
          a.href = url
          const filename = 'export_' + new Date().toISOString().replace('.', '_') + '.xlsx'
          a.download = filename
          document.body.appendChild(a)
          a.click()
          setTimeout(function () {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
          },
          0)
        })
        .catch(function (error) {
          console.log(error.message)
        })
    }
  }
}
</script>

<style>

</style>
