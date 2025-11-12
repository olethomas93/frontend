<template>
  <v-hover open-delay="500" @input="$emit('hover',$event)">
    <gmap-custom-marker
      slot-scope="{ hover }"
      :marker="{lat:item.lat, lng:item.lon}"
      alignment="bottomright"
      :offset-x="-22"
      :offset-y="-53"
      :clickable="true"
    >
      <svg
        x="0px"
        y="0px"
        xml:space="preserve"
        :width="hover || zoom >= 9 ? 140 : 45"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        height="55"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:atv="http://webmi.atvise.com/2007/svgext"
        style="cursor:pointer;transition: all 500ms ease 0s;"
        @click="navigate()"
      >
        <defs />
        <metadata />
        <g id="id_4" atv:refpy="53.592" atv:refpx="21.877" transform="matrix(1.3408,0,0,1.3408,2.3091,-6.8942)">
          <rect
            id="id_2"
            _v-if="hover"
            x="14.481"
            atv:refpy="8.022"
            y="6.199"
            atv:refpx="111.587"
            stroke="none"
            width="86.989"
            stroke-width="2"
            height="14.481"
            fill-opacity="0.490196"
            fill="#000000"
          />
          <polygon
            id="id_5"
            points="14.135,44.682 5.495,32.9 1.569,26.225 0.488,19.239 2.745,13.265 6.672,8.946 11.779,6.588 14.527,6.588 18.454,7.374 22.382,8.946 25.915,12.479 27.879,16.407 28.664,21.12 27.879,25.045 26.307,29.366 22.382,35.255 19.24,39.576"
            atv:refpy="44.815"
            atv:refpx="14.481"
            stroke-width="0.041"
            :fill="color"
          />
          <path
            id="id_0"
            d="M13.654,6.22C8.549,6.517 4.021,9.444 1.627,13.993C0.293,16.526 -0.258,19.596 0.113,22.297C0.66,26.182 3.174,31.268 7.485,37.215C8.607,38.764 10.013,40.569 11.324,42.143C12.274,43.284 13.606,44.813 14.004,45.213C14.168,45.381 14.208,45.409 14.301,45.438C14.492,45.494 14.676,45.465 14.813,45.359C15.039,45.189 16.738,43.243 17.983,41.733C23.745,34.736 27.5,28.329 28.599,23.626C28.867,22.471 28.962,21.68 28.96,20.587C28.96,19.386 28.838,18.382 28.552,17.219C27.35,12.292 23.575,8.301 18.723,6.828C17.101,6.335 15.326,6.123 13.654,6.22M15.456,7.376C16.603,7.467 17.68,7.683 18.721,8.031C21.049,8.811 23.117,10.22 24.71,12.112C26.031,13.684 26.985,15.578 27.463,17.577C27.797,18.969 27.909,20.542 27.763,21.795C27.361,25.242 25.295,29.7 21.64,35.006C19.86,37.593 17.641,40.438 15.382,43.031C14.898,43.591 14.5,44.031 14.483,44.031C14.461,44.031 13.672,43.141 13.143,42.521C13.05,42.411 12.892,42.227 12.793,42.112C11.107,40.136 9.165,37.632 7.682,35.518C3.977,30.239 1.799,25.73 1.264,22.245C1.171,21.629 1.144,21.282 1.146,20.627C1.148,18.563 1.615,16.582 2.535,14.748C4.097,11.624 6.767,9.261 10.057,8.093C11.281,7.66 12.585,7.415 14.004,7.349C14.251,7.337 15.178,7.355 15.456,7.376"
            atv:refpy="18831.73"
            atv:refpx="480.816"
            stroke-width="0.041"
            fill="#000000"
          />
          <circle
            id="id_6"
            atv:refpy="38.781"
            atv:refpx="35.478"
            stroke-width="0.041"
            r="7.756"
            fill="#b5b5b5"
            cx="14.433"
            cy="19.06"
          />
          <path
            id="id_1"
            d="M13.994,11.066C11.073,11.253 8.505,12.939 7.188,15.534C6.761,16.373 6.499,17.231 6.367,18.212C6.327,18.505 6.321,18.639 6.319,19.2C6.319,19.614 6.329,19.938 6.344,20.089C6.556,21.987 7.364,23.674 8.705,25.018C10.055,26.368 11.781,27.181 13.724,27.377C14.089,27.416 14.985,27.41 15.342,27.366C16.394,27.242 17.261,26.989 18.151,26.54C20.611,25.306 22.268,22.95 22.607,20.199C22.652,19.847 22.669,18.98 22.64,18.61C22.482,16.627 21.652,14.833 20.26,13.445C18.918,12.109 17.19,11.288 15.322,11.097C14.95,11.06 14.326,11.045 13.994,11.066M15.382,12.253C16.512,12.414 17.466,12.771 18.371,13.373C19.844,14.356 20.885,15.825 21.308,17.526C21.461,18.138 21.509,18.554 21.509,19.241C21.507,19.774 21.493,19.965 21.416,20.415C21.123,22.176 20.149,23.771 18.707,24.854C17.385,25.844 15.788,26.335 14.139,26.254C13.392,26.217 12.704,26.076 12.017,25.821C11.71,25.707 11.042,25.377 10.76,25.201C9.46,24.389 8.431,23.132 7.898,21.709C7.244,19.965 7.309,18.019 8.077,16.324C8.447,15.505 9.038,14.682 9.679,14.095C10.849,13.022 12.183,12.414 13.751,12.234C14.081,12.197 15.064,12.209 15.382,12.253"
            atv:refpy="19.232"
            atv:refpx="14.489"
            stroke-width="0.041"
            fill="#000000"
          />
          <text
            id="id_11"
            x="9.222"
            atv:refpy="-2.411"
            y="14.756"
            atv:refpx="11.83"
            transform="matrix(1.9308,0,0,1.9308,-3.4646,-5.3579)"
            font-weight="bold"
            text-anchor="middle"
            font-size="6"
            fill="#000000"
            font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
          >{{ alarmCount.alarms }}</text>
          <text
            id="id_3"
            _v-if="hover"
            x="50.535"
            atv:refpy="-12.67"
            y="9"
            atv:refpx="62.931"
            transform="matrix(1.9308,0,0,1.9308,-33.076,0)"
            text-anchor="middle"
            font-size="5"
            fill="#d4d4d4"
            font-family="Arial"
          >{{ item.displayname }}</text>
        </g>
      </svg>
    </gmap-custom-marker>
  </v-hover>
</template>

<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker'
import { gmapApi } from 'vue2-google-maps'
import { mapGetters } from 'vuex'

export default {
  components: {
    GmapCustomMarker
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['item', 'draggable', 'zoom'],
  data: () => ({
    oldPos: null
  }),
  computed: {
    ...mapGetters('alarming', [
      'getAlarmCount',
      'getAlarms'
    ]),
    alarms () {
      return this.getAlarms(this.item.id) // this.$store.state.alarming.alarms.filter((alarm) => { return alarm.base.includes(this.item.id) })
    },
    alarmCount () {
      return this.getAlarmCount(this.item.id)
    },
    // alarmPriority () {
    //   if (this.alarmCount > 0) {
    //     return this.$lodash.orderBy(this.alarms, ['priority'], ['desc'])[0].priority
    //   } else {
    //     return 0
    //   }
    // },
    color () {
      if (!this.item.active) {
        return '#505050'
      }
      if (this.alarmCount.alarms > 0) {
        return this.alarmCount.color
      } else {
        return this.$vuetify.theme.currentTheme.success
      }
      // if (this.alarmPriority > 700) {
      //   return this.$vuetify.theme.currentTheme.primary
      // }
      // if (this.alarmPriority > 600) {
      //   return this.$vuetify.theme.currentTheme.error
      // }
      // if (this.alarmPriority > 200) {
      //   return this.$vuetify.theme.currentTheme.warning
      // }
      // return this.$vuetify.theme.currentTheme.success
    },
    hidden () {
      return this.zoom >= 11
    },
    google: gmapApi,
    isAdmin () {
      return this.$store.getters['userData/getIsAdmin']
    },
    to () {
      return `locations/${this.item.id}/dashboard/dash_main`
    }
  },
  watch: {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    navigate () {
      this.$router.push({ query: { base: this.item.nodeid, display: this.item.nodeid + '.default' } })
    },
    test () {
      // this.$router.push({ path: `${this.item.id}`, append: true })
    },
    dragStart () {
      this.oldPos = JSON.parse(JSON.stringify(this.item.pos))
    },
    dragEnd (data, event) {
      if (confirm('Vil du lagre den nye posisjonen')) {
        data.pos.lat = event.latLng.lat()
        data.pos.lng = event.latLng.lng()
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        this.item.pos = this.oldPos
      }
    },
    changeIconColor (marker, color) {
      const icon = marker.$markerObject.icon
      // Viser hvor mange alarmer det er
      icon.url = icon.url.replace(
        /label=[0-9]/i,
        'label=' + this.alarmService.alarms.length
      )
      // Denne regex'en er forklart her: https://eddyerburgh.me/validate-rgb-or-rgba-value-in-javascript
      icon.url = icon.url.replace(
        /([R][G][B][A]?[(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1)))?[)])/i,
        color
      )
      // eslint-disable-next-line vue/no-mutating-props
      this.item.icon.url = icon.url
      marker.$markerObject.setIcon(icon)
    },
    toggleInfoWindow () {
      if (this.item.active) {
        this.infoWinOpen = !this.infoWinOpen
      }
    },
    showAlarmDialog () {
      this.$emit('click')
      this.$store.state.showAlarmDialog = true
    }
  }
}
</script>

<style>
</style>
