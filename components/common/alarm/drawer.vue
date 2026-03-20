<template>
  <v-navigation-drawer
    v-model="open"
    dark
    :mini-variant="mini"
    :expand-on-hover="mini"
    right
    app
    clipped
    permanent
    touchless
    @update:mini-variant="$emit('test', $event)"
  >
    <v-list nav>
      <!-- <v-list-item>
        
          Alarmoversikt
        
        <v-list-item-action>
          <v-btn icon @click="mini = !mini">
            <v-icon>
              {{ mini === true ? 'mdi-pin-off-outline' : 'mdi-pin-outline' }}
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider /> -->
      <v-list-item density="compact" @click="openDialog('AGENT.OBJECTS')">
        <v-list-item-action>
          <main-alarm base="AGENT.OBJECTS" style="margin:0 0px;" />
        </v-list-item-action>
        
          {{ $T('all_alarms_text') }}
        
      </v-list-item>
      <v-divider />
      <v-list-item v-for="(item,index) in extraItems" :key="index" density="compact" @click="openPage(item.display, item.base)">
        <v-list-item-action>
          <component :is="item.iconComponent" />
          <!-- <servicenow-icon></servicenow-icon> -->
        </v-list-item-action>
        
          {{ $T(item.text) }}
        
      </v-list-item>
      <!-- <v-list-item density="compact" @click="openIncident('AGENT.OBJECTS.incidentCentral.default')">
        <v-list-item-action>
          <servicenow-icon></servicenow-icon>
        </v-list-item-action>
        
          {{ $T('All incidents') }}
        
      </v-list-item> -->
      <v-divider />
      <v-list-item>
        <v-list-item-action>
          <v-icon>
            mdi-filter
          </v-icon>
        </v-list-item-action>
        
          <v-list-item-title>
            {{ $T('alarms_text') }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $T('For this level') }}
          </v-list-item-subtitle>
        
      </v-list-item>
      <v-list-item v-for="item in categories" :key="item.displayname" @click="openDialog(undefined, item)">
        <v-list-item-action>
          <alarm-icon
            ref="a"
            :node-id="$lodash.get($route.query, 'base', 'AGENT.OBJECTS')"
            :priority-from="item.childs.severity.value"
            :priority-to="item.childs.severity.value"
            always
            @click.stop=""
          />
        </v-list-item-action>
        
          {{ item.childs.Abbreviation.value }}
        
      </v-list-item>
      <v-list-item @click="openDialog(undefined, null, 'shelved')">
        <v-list-item-action>
          <!-- <v-icon>
            mdi-bell
          </v-icon> -->
          <alarm-icon
            ref="a"
            mode="shelved"
            :node-id="$lodash.get($route.query, 'base', 'AGENT.OBJECTS')"
            alarm-icon="mdi-bell-sleep"
            no-alarm-icon="mdi-bell-sleep-outline"
            always
            @click.stop=""
          />
        </v-list-item-action>
        
          {{ $T('Shelved') }}
        
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import AlarmIcon from './icon.vue'
import MainAlarm from '~/components/common/alarm/mainAlarm.vue'

export default {
  components: {
    MainAlarm,
    AlarmIcon
  },
  data () {
    return {
      open: false,
      mini: true
    }
  },
  computed: {
    categories () {
      return this.$store.state.alarming.categories
    },
    extraItems () {
      return this.$lodash.get(window.webMIConfig.nuxt, 'alarmDrawer.extraItems', [])
    }
  },
  methods: {
    openDialog (base = this.$lodash.get(this.$route.query, 'base', 'AGENT.OBJECTS'), item, mode = 'alarms') {
      // const base = this.$lodash.get(this.$route.query, 'base', 'AGENT.OBJECTS')
      const priority = this.$lodash.get(item, 'childs.Abbreviation.value', undefined)
      // const mode = 'shelved'
      this.$eventBus.$emit('alarmDialog', { cmd: 'open', filter: { search: base, priority, mode } })
    },
    openIncident (display) {
      const base = display.split('.').slice(0, -1).join('.')
      this.$router.push({ query: { display, base } })
      this.$emit('close')
    },
    openPage (display, base) {
      this.$router.push({ query: { display, base } })
    }
  }
}
</script>

<style>

</style>
