/**
 * useWebMI – Vue 3 composable
 *
 * Replaces the legacy `webMI_mixin.js` (Options API, Vue 2 patterns).
 *
 * Data operations (read / write / call / queryFilter / customRequest) are now
 * sent through the Nuxt server routes under /api/webmi/*, which in turn proxy
 * the requests to the Atvise server.  This means the frontend no longer needs
 * to be embedded inside an Atvise iframe or load webmi.js directly.
 *
 * Graphics (gfx.*) and display helpers that operate on DOM elements directly
 * remain thin wrappers around the browser-side webMI gfx API until those can
 * be fully replaced.
 *
 * Usage:
 *   const { read, write, call, subscribe, gfx, onUnmounted: cleanup } = useWebMI()
 */

import { ref, computed, onUnmounted, getCurrentInstance } from 'vue'
import { useNuxtApp } from '#app'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WebMIReadResult {
  address?: string
  value: unknown
  quality?: number
  error?: number
  errorstring?: string
}

export interface WebMIWriteNode {
  address: string
  value: unknown
  type?: string
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

export function useWebMI () {
  const nuxtApp = useNuxtApp()

  // Track intervals and polling subscriptions for cleanup on unmount
  const _intervals = ref<ReturnType<typeof setInterval>[]>([])
  const _onUnloadCallbacks: (() => void)[] = []

  onUnmounted(() => {
    _intervals.value.forEach(id => clearInterval(id))
    _intervals.value = []
    _onUnloadCallbacks.forEach(fn => fn())
  })

  // ---------------------------------------------------------------------------
  // Data – server-proxied operations
  // ---------------------------------------------------------------------------

  /**
   * Read one or more OPC-UA nodes from Atvise via the server route.
   */
  async function read (nodes: string | string[]): Promise<WebMIReadResult | WebMIReadResult[]> {
    const isArray = Array.isArray(nodes)
    const result = await $fetch<WebMIReadResult[]>('/api/webmi/read', {
      method: 'POST',
      body: { nodes }
    })
    return isArray ? result : result[0]
  }

  /**
   * Write one or more OPC-UA nodes via the server route.
   */
  async function write (nodes: WebMIWriteNode | WebMIWriteNode[]): Promise<unknown> {
    return $fetch('/api/webmi/write', {
      method: 'POST',
      body: { nodes }
    })
  }

  /**
   * Call a server-side Atvise function via the server route.
   */
  async function call (func: string, args: Record<string, unknown> = {}): Promise<unknown> {
    return $fetch('/api/webmi/call', {
      method: 'POST',
      body: { func, args }
    })
  }

  /**
   * Execute a queryFilter on Atvise via the server route.
   */
  async function queryFilter (filter: Record<string, unknown>): Promise<unknown> {
    return $fetch('/api/webmi/query-filter', {
      method: 'POST',
      body: { filter }
    })
  }

  /**
   * Make a custom request to an Atvise script endpoint.
   */
  async function customRequest (method: 'GET' | 'POST', path: string, body?: unknown): Promise<unknown> {
    return $fetch('/api/webmi/custom-request', {
      method: 'POST',
      body: { method, path, body }
    })
  }

  // ---------------------------------------------------------------------------
  // Polling-based subscription (replaces webMI WebSocket subscriptions)
  // ---------------------------------------------------------------------------

  /**
   * Subscribe to one or more nodes by polling the server every `intervalMs`.
   * Returns a cleanup function that stops the polling.
   *
   * @param nodes     Node address(es) to subscribe to
   * @param callback  Called with each read result
   * @param intervalMs  Polling interval in milliseconds (default 5000)
   */
  function subscribe (
    nodes: string | string[],
    callback: (data: WebMIReadResult | WebMIReadResult[]) => void,
    intervalMs = 5000
  ): () => void {
    // Immediate first read
    read(nodes).then(callback).catch(console.error)

    const id = setInterval(() => {
      read(nodes).then(callback).catch(console.error)
    }, intervalMs)

    _intervals.value.push(id)

    return () => {
      clearInterval(id)
      _intervals.value = _intervals.value.filter(i => i !== id)
    }
  }

  // ---------------------------------------------------------------------------
  // Interval helper
  // ---------------------------------------------------------------------------

  function setManagedInterval (callback: () => void, ms: number): void {
    const id = setInterval(callback, ms)
    _intervals.value.push(id)
  }

  // ---------------------------------------------------------------------------
  // Lifecycle helpers (mirrors webMI.addOnload / addOnunload)
  // ---------------------------------------------------------------------------

  function addOnload (fn: () => void): void {
    fn()
  }

  function addOnunload (fn: () => void): void {
    _onUnloadCallbacks.push(fn)
  }

  // ---------------------------------------------------------------------------
  // Event bus (replaces webMI.trigger / this.$nuxt.$on / this.$nuxt.$emit)
  // Uses the existing mitt-based eventBus plugin.
  // ---------------------------------------------------------------------------

  const _emitter = (nuxtApp as any).$emitter as {
    on: (event: string, fn: (...args: unknown[]) => void) => void
    off: (event: string, fn: (...args: unknown[]) => void) => void
    emit: (event: string, ...args: unknown[]) => void
  } | undefined

  const _triggerListeners = new Map<string, (...args: unknown[]) => void>()

  const trigger = {
    connect (name: string, callback: (...args: unknown[]) => void): void {
      _triggerListeners.set(name, callback)
      _emitter?.on(name, callback)
    },
    fire (name: string, data?: unknown, id?: unknown): void {
      _emitter?.emit(name, data, id)
    }
  }

  onUnmounted(() => {
    _triggerListeners.forEach((fn, name) => _emitter?.off(name, fn))
    _triggerListeners.clear()
  })

  // ---------------------------------------------------------------------------
  // Graphics – thin wrappers around browser-side webMI gfx
  // (DOM-bound; cannot move server-side)
  // ---------------------------------------------------------------------------

  function resolveRef (refs: Record<string, Element | null>, id: string): Element | null {
    return refs[id] ?? null
  }

  function makeGfx (getRef: (id: string) => Element | null) {
    const w = (): typeof top.webMI | undefined => (typeof window !== 'undefined' ? (window.top as any)?.webMI : undefined)

    return {
      setFill: (id: string, color: string) => w()?.gfx.setFill(getRef(id), color),
      setFillOpacity: (id: string, v: number) => w()?.gfx.setFillOpacity(getRef(id), v),
      setStrokeOpacity: (id: string, v: number) => w()?.gfx.setStrokeOpacity(getRef(id), v),
      setStroke: (id: string, color: string) => w()?.gfx.setStroke(getRef(id), color),
      setRotation: (id: string, value: number) => {
        const el = getRef(id) as HTMLElement | null
        if (!el) { return }
        el.style.transformOrigin = `${el.getAttribute('atv:refpx')}px ${el.getAttribute('atv:refpy')}px 0`
        w()?.gfx.setRotation(el, value)
      },
      setMoveX: (id: string, value: number) => w()?.gfx.setMoveX(getRef(id), value),
      setMoveY: (id: string, value: number) => w()?.gfx.setMoveY(getRef(id), value),
      setScaleX: (id: string, value: number) => {
        const el = getRef(id) as HTMLElement | null
        if (!el) { return }
        el.style.transformOrigin = `${el.getAttribute('atv:refpx')}px ${el.getAttribute('atv:refpy')}px 0`
        w()?.gfx.setScaleX(el, value)
      },
      setScaleY: (id: string, value: number) => {
        const el = getRef(id) as HTMLElement | null
        if (!el) { return }
        el.style.transformOrigin = `${el.getAttribute('atv:refpx')}px ${el.getAttribute('atv:refpy')}px 0`
        w()?.gfx.setScaleY(el, value)
      },
      setText: (id: string, value: string) => w()?.gfx.setText(getRef(id), value),
      setVisible: (id: string, visible: boolean) => w()?.gfx.setVisible(getRef(id), visible),
      getAttribute: (id: string, attr: string) => (getRef(id) as Element | null)?.getAttribute(attr),
      getFill: (id: string) => w()?.gfx.getFill(getRef(id)),
      getX: (id: string) => w()?.gfx.getX(getRef(id)),
      getY: (id: string) => w()?.gfx.getY(getRef(id)),
      getWidth: (id: string) => w()?.gfx.getWidth(getRef(id)),
      getHeight: (id: string) => w()?.gfx.getHeight(getRef(id)),
      getText: (id: string) => w()?.gfx.getText(getRef(id)),
      getScreenCTM: (id?: string) => id ? w()?.gfx.getScreenCTM(getRef(id)) : undefined
    }
  }

  // ---------------------------------------------------------------------------
  // Utilities (sprintf / translate)
  // ---------------------------------------------------------------------------

  function sprintf (format: string, value: unknown): string {
    return (window?.top as any)?.webMI?.sprintf?.(format, value) ?? String(value)
  }

  function translate (value: number, minValue: number, maxValue: number, startValue: number, stopValue: number): number {
    return (window?.top as any)?.webMI?.translate?.(value, minValue, maxValue, startValue, stopValue) ?? value
  }

  // ---------------------------------------------------------------------------
  // hasRight / getAccessControlSupport
  // ---------------------------------------------------------------------------

  function hasRight (right: string): boolean {
    return (window?.top as any)?.webMI?.hasRight?.(right) ?? false
  }

  function getAccessControlSupport (): unknown {
    return (window?.top as any)?.webMI?.getAccessControlSupport?.()
  }

  // ---------------------------------------------------------------------------
  // Return public API
  // ---------------------------------------------------------------------------

  return {
    // Data (server-proxied)
    read,
    write,
    call,
    queryFilter,
    customRequest,
    subscribe,

    // Interval / lifecycle
    setManagedInterval,
    addOnload,
    addOnunload,

    // Event bus
    trigger,

    // DOM graphics (browser-only)
    makeGfx,

    // Utilities
    sprintf,
    translate,
    hasRight,
    getAccessControlSupport
  }
}
