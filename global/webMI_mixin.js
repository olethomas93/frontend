/* eslint-disable */
/**
 * webMI_mixin.js  –  Legacy Options-API mixin (kept for backward compatibility
 * with components that have not yet been migrated to the `useWebMI` composable).
 *
 * Vue 2 / Nuxt 2 patterns fixed:
 *   - `destroyed()` → `unmounted()` (Vue 3 lifecycle hook)
 *   - `this.$nuxt.$on/.$emit/.$off` → mitt eventBus via `this.$emitter`
 *
 * New components should use the `useWebMI()` composable instead:
 *   import { useWebMI } from '~/composables/useWebMI'
 */
export const webMI = {
  props: ['args', 'overwrites', 'parameters', 'query2'],
  data: () => ({
    webMI: undefined,
    intervals: [],
    triggers: [],
    subs: [],
    alarmSubs: [],
    filterSubs: [],
    onUnload: []
  }),
  methods: {
    sub (nodes, callback) {
      top.webMI.data.read(nodes,callback)
      const sub = setInterval(() => {
        top.webMI.data.read(nodes,callback)
      }, 10000)
      this.subs.push(sub)
    },
    read2 (nodes, callback) {
      let _nodes = []
      const isArray = Array.isArray(nodes)
      if (!isArray) {
        _nodes.push(nodes)
      } else {
        _nodes = nodes
      }

      this.apiService.read(nodes).then((data) => {
        data.map((res) => {
          res.value = res.value.value
        })
        if (!isArray) {
          callback(data[0])
        } else {
          callback(data)
        }
      })
    }
  },
  computed: {
    arguments () {
      try {
        if (typeof this.args === 'string') {
          return JSON.parse(this.args)
        } else {
          return this.args
        }
      } catch (error) {
        //
      }
    },
    query () {
      const ret = {}
      try {
        const params = this.parameters
        params.map((arg) => {
          ret[arg.name] = arg.defaultvalue
        })
      } catch (error) {
        // console.error(error)
      }
      try {
        const args = this.arguments
        args.map((arg) => {
          ret[arg.name] = (arg.prefix ? this.$parent.$parent.query[arg.prefix] : '') + (arg.value === undefined ? '' : arg.value)
        })
      } catch (error) {
        // console.error(error)
      }
      return { base: this.base, ...ret, ...this.query2 }
    }
  },
  mounted () {
    try {
      const settings = JSON.parse(this.settings)
      if (settings.overwrites) {
        settings.overwrites.forEach((ow) => {
          const child = this.$el.querySelector(`#${ow.id}:not(overwrite)`)
          Object.keys(ow).forEach((attr) => {
            child.setAttribute(attr, ow[attr])
          })
        })
      }
    } catch (error) {

    }
    if (this.overwrites) {
      try {
        JSON.parse(this.overwrites).map((el) => {
          const child = this.$el.querySelector(`#${el.id}`)
          if (child) {
            if (child.tagName === 'svg') {
              // SVG root element – no attribute overwrite
            } else {
              Object.keys(el).forEach((attr) => {
                child.setAttribute(attr, el[attr])
              })
            }
          }
        })
      } catch (error) {
        // console.error(error)
      }
    }

    if (this.$refs.__bg__) {
      this.$refs.__bg__.setAttribute('visibility', 'hidden')
    }

    if (this.$refs.__title__) {
      this.$refs.__title__.setAttribute('visibility', 'hidden')
      this.$emit('title', this.$refs.__title__.innerHTML)
    }

    const self = this

    this.webMI = {
      trendFactory: top.webMI.trendFactory,
      getClientInfo: top.webMI.getClientInfo,
      isVue: true,
      trigger: {
        connect (name, callback) {
          self.triggers.push({ name, callback })
          // Use mitt eventBus (Vue 3 / Nuxt 3) instead of deprecated $nuxt event bus
          self.$emitter?.on(name, callback)
        },
        fire (name, data, id) {
          self.$emitter?.emit(name, data, id)
        }
      },
      dom: {
        createElement: (ns, type) => {
          return top.webMI.dom.createElement(ns, type)
        }
      },
      libraryLoader: {
        load (url, setting, callback) {
          const scripts = Array.from(document.scripts)
          const exists = scripts.find(element => element.getAttribute('src') === '/' + url)
          if (exists) {
            callback()
          } else {
            const script = document.createElement('script')
            script.onload = function () {
              callback()
            }
            script.src = '/' + url
            document.head.appendChild(script)
          }
        }
      },
      callExtension (name, parameters) {
        return top.webMI.callExtension(name, parameters)
      },
      getAccessControlSupport () {
        return top.webMI.getAccessControlSupport()
      },
      addOnload: (func) => {
        func()
      },
      addOnunload: (func) => {
        self.onUnload.push(func)
      },
      setInterval: (time, callback) => {
        this.intervals.push(setInterval(callback, time))
      },
      hasRight: (right) => {
        return top.webMI.hasRight(right)
      },
      query: this.query,
      addEvent: (id, events, callback) => {
        if (typeof id === 'object') {
          top.webMI.addEvent(top.webMI.data, events, (e) => {
            callback(e)
          })
        } else {
          top.webMI.addEvent(self.$refs[id], events, (e) => {
            callback()
          })
        }
      },
      data: {
        addEventListener: (name, callback) => {
          top.webMI.data.addEventListener(name, function(e){
            callback(e)
          })
        },
        call: (func, args) => {
          return new Promise((resolve, reject)=>{
            top.webMI.data.call(func, args, (data)=>{
              resolve(data)
            })
          })
        },
        queryFilter (filter, callback) {
          top.webMI.data.queryFilter(filter,callback)
        },
        loadScript (url, callback) {
          const script = document.createElement('script')
          script.onload = function () {
            callback()
          }
          script.src = '/' + url
          document.head.appendChild(script)
        },
        read: (nodes, callback) => {
          return new Promise((resolve, reject) => {
            top.webMI.data.read(nodes, (data) => {
              if (data.error === -1) {
                console.error(data.errorstring)
                callback(data)
              } else {
                callback(data)
                resolve(data)
              }
            })
          })
        },
        subscribe: (node, callback) => {
          this.sub(node, callback)
        },
        subscribeBlock: (nodes, callback) => {
          this.sub(nodes, callback)
        },
        subscribeFilter: (filter, callback) => {
          const sub = top.webMI.data.subscribeFilter(filter, callback)
          this.filterSubs.push(sub)
        },
        unsubscribeFilter: (id) => {
          return top.webMI.data.unsubscribeFilter(id)
        },
        write: (nodes, values) => {
          return new Promise((resolve, reject) => {
            top.webMI.data.write(nodes, values, (data) => {
              if (data.error === -1) {
                reject()
                this.$store.commit('SET_CUSTOM_ALERT', { message: `${data.errorstring} ${nodes}` })
              } else {
                resolve(data)
              }
            })
          })
        }
      },
      gfx: {
        addForeignObject: (a, b) => {
          return top.webMI.gfx.addForeignObject(a,b)
        },
        setWidth: (id, width) => {
          top.webMI.gfx.setWidth(self.$refs[id], width)
        },
        setAttribute: (domNode, attribute, value) => {
          top.webMI.gfx.setAttribute(self.$refs[domNode], attribute, value)
        },
        setFill: (id, color) => {
          top.webMI.gfx.setFill(self.$refs[id], color)
        },
        setFillOpacity: (id, opacity) => {
          top.webMI.gfx.setFillOpacity(self.$refs[id], opacity)
        },
        setStrokeOpacity: (id, opacity) => {
          top.webMI.gfx.setStrokeOpacity(self.$refs[id], opacity)
        },
        setStroke: (id, color) => {
          top.webMI.gfx.setStroke(self.$refs[id], color)
        },
        setRotation: (id, value) => {
          const refpx = self.$refs[id].getAttribute('atv:refpx')
          const refpy = self.$refs[id].getAttribute('atv:refpy')
          self.$refs[id].style.transformOrigin = `${refpx}px ${refpy}px 0`
          top.webMI.gfx.setRotation(self.$refs[id], value)
        },
        setMoveX: (id, value) => {
          top.webMI.gfx.setMoveX(self.$refs[id], value)
        },
        setMoveY: (id, value) => {
          top.webMI.gfx.setMoveY(self.$refs[id], value)
        },
        setScaleX: (id, value) => {
          const refpx = self.$refs[id].getAttribute('atv:refpx')
          const refpy = self.$refs[id].getAttribute('atv:refpy')
          self.$refs[id].style.transformOrigin = `${refpx}px ${refpy}px 0`
          top.webMI.gfx.setScaleX(self.$refs[id], value)
        },
        setScaleY: (id, value) => {
          const refpx = self.$refs[id].getAttribute('atv:refpx')
          const refpy = self.$refs[id].getAttribute('atv:refpy')
          self.$refs[id].style.transformOrigin = `${refpx}px ${refpy}px 0`
          top.webMI.gfx.setScaleY(self.$refs[id], value)
        },
        setText: (id, value) => {
          top.webMI.gfx.setText(self.$refs[id], value)
        },
        setVisible: (id, value) => {
          top.webMI.gfx.setVisible(self.$refs[id], value)
        },
        getFontFamily (id) {
          return top.webMI.gfx.getFontFamily(self.$refs[id])
        },
        getFontSize (id) {
          return top.webMI.gfx.getFontSize(self.$refs[id])
        },
        getText (id) {
          return top.webMI.gfx.getText(self.$refs[id])
        },
        getTextAnchor (id) {
          return top.webMI.gfx.getTextAnchor(self.$refs[id])
        },
        getX (id) {
          return top.webMI.gfx.getX(self.$refs[id])
        },
        getY (id) {
          return top.webMI.gfx.getY(self.$refs[id])
        },
        getHeight (id) {
          return top.webMI.gfx.getHeight(self.$refs[id])
        },
        getWidth (id) {
          return top.webMI.gfx.getWidth(self.$refs[id])
        },
        getRadius (id) {
          return top.webMI.gfx.getRadius(self.$refs[id])
        },
        getPoints (id) {
          return top.webMI.gfx.getPoints(self.$refs[id])
        },
        getX1 (id) {
          return top.webMI.gfx.getX1(self.$refs[id])
        },
        getY1 (id) {
          return top.webMI.gfx.getY1(self.$refs[id])
        },
        getX2 (id) {
          return top.webMI.gfx.getX2(self.$refs[id])
        },
        getY2 (id) {
          return top.webMI.gfx.getY2(self.$refs[id])
        },
        getCenterX (id) {
          return top.webMI.gfx.getCenterX(self.$refs[id])
        },
        getCenterY (id) {
          return top.webMI.gfx.getCenterY(self.$refs[id])
        },
        getRadiusX (id) {
          return top.webMI.gfx.getRadiusX(self.$refs[id])
        },
        getRadiusY (id) {
          return top.webMI.gfx.getRadiusY(self.$refs[id])
        },
        getFill (id) {
          return top.webMI.gfx.getFill(self.$refs[id])
        },
        getFillOpacity (id) {
          return top.webMI.gfx.getFillOpacity(self.$refs[id])
        },
        getFillRule (id) {
          return top.webMI.gfx.getFillRule(self.$refs[id])
        },
        getStroke (id) {
          return top.webMI.gfx.getStroke(self.$refs[id])
        },
        getStrokeWidth (id) {
          return top.webMI.gfx.getStrokeWidth(self.$refs[id])
        },
        getStrokeOpacity (id) {
          return top.webMI.gfx.getStrokeOpacity(self.$refs[id])
        },
        getImage (id) {
          return top.webMI.gfx.getImage(self.$refs[id])
        },
        getScreenCTM (id) {
          if (id) {
            return top.webMI.gfx.getScreenCTM(self.$refs[id])
          } else {
            const svg = self.$el.querySelector('svg')
            return svg.getScreenCTM()
          }
        },
        createPoint (x, y) {
          const svg = self.$el.querySelector('svg')
          return svg.createSVGPoint(x, y)
        },
        addCircle (attributes, parent) {
          // Not implemented
        }
      },
      display: {
        openWindow: (settings) => {
          this.$emit('openDialog', settings)
        },
        closeWindow: (settings) => {
          this.$emit('closeDialog')
        },
        openDisplay: (url, parameters, iframe) => {
          top.webMI.display.openDisplay(url, parameters, iframe)
        }
      },
      alarm: {
        subscribe: (id, callback) => {
          const subs = top.webMI.alarm.subscribe(id, callback)
          this.alarmSubs.push(subs)
        },
        unsubscribe: (id) => {
          top.webMI.alarm.unsubscribe(this.alarmSubs)
        }
      },
      sprintf: (format, value) => {
        return top.webMI.sprintf(format, value)
      },
      translate: (value, minValue, maxValue, startValue, stopValue) => {
        return top.webMI.translate(value, minValue, maxValue, startValue, stopValue)
      },
      setTransform: (id, translate, value) => {
        const refpx = self.$refs[id].getAttribute('atv:refpx')
        const refpy = self.$refs[id].getAttribute('atv:refpy')
        self.$refs[id].style.transformOrigin = `${refpx}px ${refpy}px 0`
        const res = self.$refs[id].style.transform
        let arr = []
        if (res) {
          arr = res.split(' ')
        }
        const transforms = {}
        arr.map(function (line) {
          if (line.length > 0) {
            const key = line.split('(')[0]
            const value = line.split('(')[1].split(')')[0]
            transforms[key] = value
          }
        })
        transforms[translate] = value
        arr = []
        Object.keys(transforms).forEach(function (key) {
          arr.push(key + '(' + transforms[key] + ')')
        })
        self.$refs[id].style.setProperty('transform', arr.join(' '))
      }
    }
  },
  watch: {
    $route () {
      const trends = top.webMI.trendFactory.getAllTrends()
      trends.forEach((trend) => {
        // trend.destroy()
      })
    }
  },
  // Vue 3 lifecycle hook (replaces Vue 2 `destroyed`)
  unmounted () {
    this.intervals.forEach((interval) => {
      clearInterval(interval)
    })
    this.subs.forEach((sub) => {
      clearInterval(sub)
    })
    this.filterSubs.forEach((sub) => {
      console.log('unsubscribeFilter:', sub)
      console.log(top.webMI.data.unsubscribeFilter(sub))
    })
    this.onUnload.forEach((unload) => {
      unload()
    })
    top.webMI.alarm.unsubscribe(this.alarmSubs)
    // Remove mitt event listeners (replaces this.$nuxt.$off)
    this.triggers.forEach(({ name, callback }) => {
      this.$emitter?.off(name, callback)
    })
  }
}
