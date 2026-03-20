<template>
  <div :style="rootStyle">
    <v-list nav>
      <!-- HOME -->
      <v-list-item
        :to="{path: '/', query: { display: homeDisplay, base:homeBase} }"
      >
        <v-list-item-icon>
          <v-icon>mdi-home-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $T('Home') }}</v-list-item-title>
      </v-list-item>
      <!-- MULTILEVEL -->
      <div v-if="items.length > 1 && showMultilevel">
        <v-list-group
          v-for="(item) in items"
          :key="item.nodeid"
          prepend-icon="mdi-map-marker"
          :no-action="false"
          :to="{path: '/', query: { display: '', base: '' } }"
          @click="navigate(item)"
        >
          <template #prependIcon>
            <alarm-icon :node-id="item.nodeid" overlap :no-alarm-icon="item.icon" />
          </template>

          <template #activator>
            <v-list-item-title>{{ $T(item.name) }}</v-list-item-title>
          </template>
          <v-list-item
            v-for="(child) in filter(item.childs)"
            :key="child.nodeid"
            link
            :to="{path: '/', query: { display: getDisplay(child), base: child.nodeid } }"
            replace
            _click.stop="navigate(child)"
          >
            <v-list-item-action>
              <alarm-icon :node-id="child.nodeid" overlap />
            </v-list-item-action>
            <v-list-item-title>
              {{ $T(child.name) }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </div>
      <!-- SINGELLEVEL -->
      <div v-else>
        <v-list-item
          v-for="(item) in items"

          :key="item.nodeid"
          link
          :to="{path: '/', query: { display: getDisplay(item), base: item.nodeid } }"
          replace
          _click.stop="navigate(child)"
        >
          <v-list-item-action style="width:32px">
            <!-- <alarm-icon :node-id="item.nodeid" overlap :no-alarm-icon="item.icon" /> -->
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-item-action>
          
            <v-list-item-title>
              {{ $T(item.name) }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ $T(item.description) }}
            </v-list-item-subtitle>
          
        </v-list-item>
      </div>
      <!-- <div v-else-if="items.length <= 1">
        <v-list-item
          v-for="(child) in filter(items[0].childs)"
          :key="child.nodeid"
          link
          :to="{path: '/', query: { display: getDisplay(child), base: child.nodeid } }"
          replace
          _click.stop="navigate(child)"
        >
          <v-list-item-icon>
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="$T(child.name)" />
        </v-list-item>
      </div> -->
      <!-- popups -->
      <v-list-group
        v-for="(popup, key) in popups"
        :key="key"
        :prepend-icon="popup.icon"
      >
        <template #activator>
          <v-list-item-title>{{ $T(popup.title) }}</v-list-item-title>
        </template>
        <v-list-item
          v-for="(child, key2) in popup.childs"
          :key="key2"
          @click.stop="openPopup(child)"
        >
          <v-list-item-icon>
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ $T(child.title) }}
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
import alarmIcon from '@/components/common/alarm/iconButton.vue'

export default {
  components: {
    alarmIcon
  },
  props: {
    showMultilevel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: [],
      popups: []
    }
  },
  computed: {
    homeDisplay () {
      return this.$lodash.get(this.$store.state.atvise, 'userData.defaultdisplay') || this.$lodash.get(top.webMIConfig, 'nuxt.home.display')
    },
    homeBase () {
      return this.$lodash.get(this.$store.state.atvise, 'userData.additionalInfo.defaultBase') || this.$lodash.get(top.webMIConfig, 'nuxt.home.base')
    },
    language () {
      return this.$store.state.atvise.language || 'en'
    },
    selectedColor () {
      return this.$lodash.get(top.webMIConfig, 'nuxt.navigationDrawer.selectedColor')
    },
    rootStyle () {
      return {
        '--selected-color': this.selectedColor || '#26d07c'
      }
    }
  },
  async mounted () {
    const { items, popups } = await this.browse(this.items[0])
    console.log('SIDEBAR')
    console.log(items)
    console.log(popups)
    this.items = items
    this.popups = popups
  },
  methods: {
    navigate (item) {
      this.$router.push({ query: { display: this.getDisplay(item), base: item.nodeid }, replace: false })
      console.log(item)
    },
    filter (items) {
      return this.$lodash.pickBy(items, (value, key) => {
        return value.TypeDefinition !== 'VariableTypes.ATVISE.Display'
      })
      // console.log('ITEMS', items)
    },
    openPopup (item) {
      const display = item.display
      const title = item.title || ''
      const width = item.width || 800
      const height = item.height || 600
      const advanced = item.advanced || true
      const modal = item.modal || true
      const fullscreen = item.fullscreen || false
      top.webMI.trigger.fire('showPopup', { display, title, width, height, modal, fullscreen, advanced })
    },
    getDisplay (item) {
      if (item.TypeDefinition === 'VariableTypes.ATVISE.Display') {
        return item.nodeid
      } else if (item.childs?.default) {
        return item.childs.default.nodeid
      } else if (item.childs?._default) {
        return item.childs._default.nodeid
      } else {
        return `${item.nodeid}.default`
      }
      // return item.TypeDefinition === 'VariableTypes.ATVISE.Display' ? item.nodeid : `${item.nodeid}.default`
    },
    browse (item) {
      return new Promise((resolve, reject) => {
        top.webMI.data.call('JMH_getSidebarMenu', {}, (data) => {
          resolve(data)
        })
      })
    }
  }
}
</script>

<style scoped>
/* .v-application--is-ltr .v-list-group--no-action > .v-list-group__items > .v-list-item {
    padding-left: 28px;
} */

.v-application .text-primary {
    /* color: #050505 !important; */
    color: var(--selected-color) !important
}
</style>
