<template>
  <div style="width:100%;height:100%" xmlns="http://www.w3.org/1999/xhtml">
    <v-data-table
      v-model="selected"
      :search="search"
      :show-select="false"
      class="elevation-1"
      item-key="nodeid"
      :disable-sort="false"
      :items-per-page="-1"
      :show-expand="showExpand"
      show-group-by
      :hide-default-footer="true"
      :single-expand="true"
      :items="items"
      :headers="headers"
      mobile-breakpoint="0"
      :fixed-header="true"
      :height="height"
      @click:row="$emit('click', $event)"
    >
      <template #expanded-item="{headers, item}">
        <td :colspan="headers.length">
          <!-- <atvise-visu-v3 :base="item.nodeid" :settings="item.typeDefinition + '._vueSettings'" /> -->
          <atvise-visu-v3 :base="item.nodeid" :settings="item.typeDefinition + '.' + display" style="width:350px;" />
        </td>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon v-if="canEdit" class="mr-2" :small="true" @click.stop="$emit('edit', item)">
          mdi-pencil
        </v-icon>
        <v-icon v-if="canDelete" :small="true" @click.stop="$emit('delete', item)">
          mdi-delete
        </v-icon>
      </template>
      <template #[`item.alarms`]="{ item }">
        <alarm-icon ref="alarmIcon" :overlap="true" :base="item.nodeid" style="z-index:10;" />
      </template>
      <!-- <template #[`item.childs.parentId.value`]="{ item }">
        <v-chip v-if="item.childs.parentId.value.length > 0" @click.stop="">
          {{ item.childs ? item.childs.parentId.value.split('.').slice(-1).join() : '' }}
        </v-chip>
      </template> -->
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'CrudList',
  props: {
    search: {
      type: String,
      default: ''
    },
    display: {
      type: String,
      default: 'widget'
    },
    items: {
      type: Array,
      default: () => { return [] }
    },
    canDelete: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    canAdd: {
      type: Boolean,
      default: false
    },
    showId: {
      type: Boolean,
      default: false
    },
    showExpand: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: undefined
    },
    showParent: {
      type: Boolean,
      default: false
    },
    extraHeaders: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      selected: []
    }
  },
  computed: {
    headers () {
      let ret = []
      if (this.showId) {
        ret.push({ text: 'ID', value: 'browsename', groupable: false })
      }
      ret.push({ text: 'Navn', value: 'displayname', groupable: false })
      ret.push({ text: 'Beskrivelse', value: 'description', groupable: false })
      // if (this.showParent) {
      //   ret.push({ text: 'Plassering', value: 'childs.parentId.value' })
      // }
      if (this.items[0]) {
        if (this.items[0].typeDefinition.includes('VariableTypes.')) {
          ret.push({ text: 'Verdi', value: 'value', groupable: false })
        }
      }
      ret = [...ret, ...this.extraHeaders]
      if (this.canDelete || this.canEdit) {
        ret.push({ text: 'Actions', value: 'actions' })
      }
      ret.push({ text: 'Alarmer', value: 'alarms', groupable: false })
      return ret
    }
  }
}
</script>

<style>

</style>
