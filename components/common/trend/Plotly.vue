<template>
  <div ref="plotContainer" class="plotly-root" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Plotly from 'plotly.js-dist-min'

type PlotlyConfig = Partial<{
  displaylogo: boolean
  displayModeBar: boolean | 'hover'
  modeBarButtonsToAdd: Array<string[] | string>
  scrollZoom: boolean
}>

interface PlotEventHandler {
  type: string
  handler: (payload: any) => void
}

export default defineComponent({
  name: 'Plotly',
  props: {
    data: {
      type: Array as () => any[],
      default: () => []
    },
    layout: {
      type: Object as () => Record<string, any>,
      default: () => ({})
    },
    displayModeBar: {
      type: [Boolean, String] as () => boolean | 'hover',
      default: true
    },
    modeBarButtonsToAdd: {
      type: Array as () => Array<string[] | string>,
      default: () => []
    },
    scrollZoom: {
      type: Boolean,
      default: false
    },
    displaylogo: {
      type: Boolean,
      default: false
    }
  },
  emits: ['relayout', 'click'],
  data () {
    return {
      innerLayout: this.cloneLayout(this.layout),
      renderQueued: false,
      resizeObserver: null as ResizeObserver | null,
      eventHandlers: [] as PlotEventHandler[]
    }
  },
  watch: {
    data: {
      handler () {
        this.queueRender()
      },
      deep: true
    },
    layout: {
      handler (val) {
        this.innerLayout = this.cloneLayout(val)
      },
      deep: true
    },
    innerLayout: {
      handler () {
        this.queueRender()
      },
      deep: true
    },
    displayModeBar () {
      this.queueRender()
    },
    modeBarButtonsToAdd: {
      handler () {
        this.queueRender()
      },
      deep: true
    },
    scrollZoom () {
      this.queueRender()
    },
    displaylogo () {
      this.queueRender()
    }
  },
  mounted () {
    this.attachResizeObserver()
    this.renderPlot()
  },
  beforeUnmount () {
    this.detachResizeObserver()
    this.detachPlotEvents()
    const el = this.$refs.plotContainer as HTMLElement | undefined
    if (el) {
      Plotly.purge(el)
    }
  },
  methods: {
    cloneLayout (layout?: Record<string, any>) {
      return JSON.parse(JSON.stringify(layout || {}))
    },
    schedule (_options?: { replot?: boolean }) {
      this.queueRender()
    },
    queueRender () {
      if (this.renderQueued) {
        return
      }
      this.renderQueued = true
      requestAnimationFrame(() => {
        this.renderQueued = false
        this.renderPlot()
      })
    },
    async renderPlot () {
      const el = this.$refs.plotContainer as HTMLElement | undefined
      if (!el) {
        return
      }
      const config: PlotlyConfig = {
        displaylogo: this.displaylogo,
        displayModeBar: this.displayModeBar,
        modeBarButtonsToAdd: this.modeBarButtonsToAdd,
        scrollZoom: this.scrollZoom
      }
      try {
        await Plotly.react(el, this.data, this.innerLayout, config)
        this.attachPlotEvents(el)
      } catch (error) {
        if (process.dev) {
          console.error('[plotly] render failed', error)
        }
      }
    },
    attachPlotEvents (el: HTMLElement) {
      this.detachPlotEvents()
      const relayoutHandler = (payload: any) => {
        this.$emit('relayout', payload)
      }
      const clickHandler = (payload: any) => {
        this.$emit('click', payload)
      }
      const target: any = el
      if (typeof target.on === 'function') {
        target.on('plotly_relayout', relayoutHandler)
        target.on('plotly_click', clickHandler)
        this.eventHandlers = [
          { type: 'plotly_relayout', handler: relayoutHandler },
          { type: 'plotly_click', handler: clickHandler }
        ]
      }
    },
    detachPlotEvents () {
      const el = this.$refs.plotContainer as any
      if (!el || typeof el.removeListener !== 'function') {
        this.eventHandlers = []
        return
      }
      for (const { type, handler } of this.eventHandlers) {
        el.removeListener(type, handler)
      }
      this.eventHandlers = []
    },
    attachResizeObserver () {
      const el = this.$refs.plotContainer as HTMLElement | undefined
      if (typeof window === 'undefined' || !el || typeof ResizeObserver === 'undefined') {
        return
      }
      this.resizeObserver = new ResizeObserver(() => {
        this.queueRender()
      })
      this.resizeObserver.observe(el)
    },
    detachResizeObserver () {
      this.resizeObserver?.disconnect()
      this.resizeObserver = null
    }
  }
})
</script>

<style scoped>
.plotly-root {
  width: 100%;
  height: 100%;
}
</style>
