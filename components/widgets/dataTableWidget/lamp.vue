<!-- eslint-disable vue/return-in-computed-property -->
<template>
  <div v-if="!isString">
    <v-tooltip open-delay="500" :right="true" :color="valueFix ? colors.success : colors.error">
      <template #activator="{ on }">
        <v-icon :color="valueFix ? colors.success : colors.error" v-on="on">
          {{ valueFix ? 'mdi-circle' : 'mdi-circle' }}
        </v-icon>
      </template>
      <span>{{ valueFix ? tooltipText.success : tooltipText.error }}</span>
    </v-tooltip>
  </div>
  <div v-else>
    {{ value }} OK
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [Boolean, String],
      default: false
    },
    normallyClose: {
      type: Boolean,
      default: true
    },
    tooltipText: {
      type: Object,
      default: () => { return { success: 'Good', error: 'Error' } }

    },
    colors: {
      type: Object,
      default: () => { return { success: 'green', error: 'grey' } }

    }

  },
  data () {
    return {

      isString: false

    }
  },

  computed: {
    valueFix () {
      let _value = false
      if (this.normallyClose) {
        _value = this.value
      } else {
        _value = !this.value
      }

      return _value
    }
  },

  watch: {
    value: {
      immediate: true,
      handler () {
        if (typeof (this.value) === 'string') {
          this.isString = true
        }
      }
    }
  }

}
</script>

<style>

</style>
