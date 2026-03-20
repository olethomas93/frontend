<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template #activator="{ props }">
      <v-btn
        variant="outlined"
        color="primary"
        v-bind="props"
        @click="startExport"
      >
        <v-icon>
          mdi-file-excel
        </v-icon>
        {{ $T('Export') }}
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
          variant="text"
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
  props: {
    items: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      dialog: false,
      conditions: []
    }
  },
  computed: {
    lang () {
      return this.$lodash.get(this.$store, 'state.atvise.language', 'en')
    },
    columns () {
      return [
        { header: this.$T('Alarm ID'), key: 'AlarmId', width: 15 },
        { header: this.$T('Time'), key: 'timestamp', width: 20 },
        { header: this.$T('Area'), key: 'areaName', width: 30 },
        { header: this.$T('System'), key: 'system', width: 27 },
        { header: this.$T('System name'), key: 'systemName', width: 27 },
        { header: this.$T('Component'), key: 'component', width: 23 },
        { header: this.$T('Component name'), key: 'componentName', width: 20 },
        { header: this.$T('Event'), key: 'eventtext', width: 30 },
        { header: this.$T('Value'), key: 'value', width: 10 },
        { header: this.$T('State'), key: 'ActiveState', width: 30 },
        { header: this.$T('Category'), key: 'category', width: 15 },
        { header: this.$T('User'), key: 'username', width: 10 },
        { header: this.$T('Comment'), key: 'Comment', width: 120 }
      ]
    }
  },
  methods: {
    startExport () {
      this.dialog = true
      // this.text = 'Reading alarm conditions'
      // this.conditions = await this.getConditions()
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
      return this.items.map((item) => {
        item.Comment = this.$lodash.get(item, 'Comment.' + this.lang, '')
        item.ActiveState = this.$lodash.get(item, 'ActiveState.' + this.lang, '')
        item.eventtext = this.$lodash.get(item, 'eventtext.' + this.lang, '')
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
        to: 'M1'
      }
      ws.columns = this.columns
      const data = this.prepareData()
      data.forEach((item) => {
        ws.addRow(item)
      })
      // ws.getCell('A1').value = 7
      // ws.getCell('B1').value = 'Hello, World!'
      this.dialog = false
      wb.xlsx.writeBuffer({
        base64: true
      })
        .then(function (xls64) {
          // build anchor tag and attach file (works in chrome)
          const a = document.createElement('a')
          const data = new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

          const url = URL.createObjectURL(data)
          a.href = url
          const filename = 'export_alarmlog_' + new Date().toISOString().replace('.', '_') + '.xlsx'
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
