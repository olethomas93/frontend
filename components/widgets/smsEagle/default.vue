<template>
  <div>
    <v-tabs v-model="tab" :align-with-title="true">
      <v-tabs-slider color="primary" />
      <v-tab v-for="(tab,index) in tabs" :key="index">
        {{ tab.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(tab, index) in tabs" :key="index" style="height:800px">
        <component :is="tab.component" base="AGENT.OBJECTS" />
        <!-- <atvise-visu-v3 style="margin:10px" :base="tab.base" :settings="tab.display" /> -->
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: 0
    }
  },
  computed: {
    tabs () {
      return [
        {
          name: this.$T('Status'),
          component: 'sms-eagle-status'
        },
        {
          name: this.$T('Contacts'),
          component: 'sms-eagle-phonebook'
        },
        {
          name: this.$T('Groups'),
          component: 'sms-eagle-groups'
        },
        {
          name: this.$T('Alarms'),
          component: 'alarm-config-list'
        }
      ]
    }
  }
}
</script>

<style>

</style>
