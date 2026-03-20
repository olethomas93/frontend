<!-- eslint-disable vue/return-in-computed-property -->
<template>
  <v-tooltip open-delay="500" :right="true" :color="valueFix ? 'error' : 'success'">
    <template #activator="{ props }">
      <v-icon v-if="!valueText" :color="valueFix ? 'error' : 'success'" v-bind="props">
        {{ valueFix ? 'mdi-circle' : 'mdi-circle' }}
      </v-icon>
      <div v-else>
        {{ valueFix ? tooltipText.success : tooltipText.error }}
      </div>
    </template>
    <span>{{ valueFix ? tooltipText.success : tooltipText.error }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    normallyClose: {
      type: Boolean,
      default: true
    },
    treshH: {
      type: Number,
      default: 100
    },
    treshL: {
      type: Number,
      default: 0
    },
    tooltipText: {
      type: Object,
      default: () => { return { success: 'Good', error: 'Error' } }

    },
    valueText: {
      type: Boolean,
      default: false
    }

  },

  computed: {
    valueFix () {
      let _value = false
      if (this.value >= this.treshH) {
        _value = true
      } else if (this.value <= this.treshL) {
        _value = false
      }

      return _value
    }
  }

}
</script>

<style>

</style>
