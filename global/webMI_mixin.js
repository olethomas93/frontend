/* eslint-disable */
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
      // const sub = top.webMI.data.subscribe(nodes,callback)
      // this.subs.push(sub)
      // this.read2(nodes, callback)
      top.webMI.data.read(nodes,callback)
      const sub = setInterval(() => {
        top.webMI.data.read(nodes,callback)
        // this.read2(nodes, callback)
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
      // return { base: this.base, ...ret, ...this.query2 }
      return { base: this.base, ...ret, ...this.query2 }
    }
  },
  mounted () {
    try {
      const settings = JSON.parse(this.settings)
      if (settings.overwrites) {
        // console.log('overwrites', settings.overwrites)
        settings.overwrites.forEach((ow) => {
          const child = this.$el.querySelector(`#${ow.id}:not(overwrite)`)
          // console.log(child)
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
          // console.log(el.id)
          // console.log('child:', child)
          // const obj = {attr:[],parent:el.parentNode}
          if (child) {
            if (child.tagName === 'svg') {
              // console.log('found svg')
              // const g = document.createElement('g')
              // child.parentElement.appendChild(g).appendChild(child)
              // el.attributes.forEach((attr) => {
              //   g.setAttribute(attr.name, attr.value)
              // })
            } else {
              // console.log(el)
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

    // this.$parent.$parent.$el.querySelectorAll('overwrite').forEach((el) => {
    //   const parent = el.parentNode
    //   const child = parent.querySelector(`#${el.getAttribute('id')}:not(overwrite)`)
    //   // console.log('child:', child)
    //   // const obj = {attr:[],parent:el.parentNode}
    //   if (child) {
    //     if (child.tagName === 'svg') {
    //       // const g = document.createElement('g')
    //       // child.parentElement.appendChild(g).appendChild(child)
    //       // el.attributes.forEach((attr) => {
    //       //   g.setAttribute(attr.name, attr.value)
    //       // })
    //     } else {
    //       el.attributes.forEach((attr) => {
    //         child.setAttribute(attr.name, attr.value)
    //       })
    //       el.remove()
    //     }
    //   }

    //   if (child) {
    //   }
    // })
    const self = this

    this.webMI = {
      trendFactory: top.webMI.trendFactory,
      getClientInfo: top.webMI.getClientInfo,
      isVue: true,
      trigger: {
        connect (name, callback) {
          // console.log(self.triggers)
          self.triggers.push(name)
          self.$nuxt.$on(name, callback)
        },
        fire (name, data, id) {

          self.$nuxt.$emit(name, data, id)
        }
      },
      dom: {
        createElement: (ns, type) => {
          return top.webMI.dom.createElement(ns, type)
        }
      },
      libraryLoader: {
        load (url, setting, callback) {
          // check if library already is loaded
          const scripts = Array.from(document.scripts)
          const exists = scripts.find(element => element.getAttribute('src') === '/' + url)
          if (exists) {
            // console.log('library already loaded')
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
      callExtension (name,parameters) {
        return top.webMI.callExtension(name, parameters)
        // return {}
      },
      getAccessControlSupport () {
        return top.webMI.getAccessControlSupport()
      },
      addOnload: (func) => {
        func()
        // top.webMI.addOnload(func)
      },
      addOnunload: (func) => {
        self.onUnload.push(func)
      },
      setInterval: (time, callback) => {
        this.intervals.push(setInterval(callback, time))
      },
      hasRight: (right) => {
        return top.webMI.hasRight(right)
        // return right === 'VISU.Operate'
      },
      query: this.query,
      addEvent: (id, events, callback) => {
        // debugger
        if (typeof id === 'object') {
          top.webMI.addEvent(top.webMI.data, events, (e) => {
            callback(e)
          })
        } else {
          top.webMI.addEvent(self.$refs[id], events, (e) => {
            callback()
          })
        }
        // top.webMI.addEvent(self.$refs[id], events, (e) => {
        //   callback()
        // })
        // console.log('id', id)
        // if (Array.isArray(events)) {
        //   events.map((event) => {
        //     self.$refs[id].addEventListener(event, callback)  
        //   })
        // } else {
        //   self.$refs[id].addEventListener(events, callback)
        // }
        
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
              // resolve(data)
              // callback(data)
              // resolve()
            })
          })
          // this.$socket.emit('call', func, args, callback)
        },
        queryFilter (filter, callback) {
          top.webMI.data.queryFilter(filter,callback)
          // const type = filter.type || ['v:1', 'v:2', 'v:3']
          // const address = filter.address || []
          // const timestamp = filter.timestamp[0] || ''
          // const aggregate = filter.aggregate
          // callback(filter)
        },
        loadScript (url, callback) {
          const script = document.createElement('script')
          script.onload = function () {
            // console.log('script loaded')
            callback()
          }
          script.src = '/' + url
          document.head.appendChild(script)
        },
        read: (nodes, callback) => {
          // debugger
          return new Promise((resolve, reject) => {
            top.webMI.data.read(nodes, (data) => {
              if (data.error === -1) {
                console.error(data.errorstring)
                //this.$store.commit('SET_CUSTOM_ALERT', {message: data.errorstring})
                callback(data)
                // reject()
              } else {
                callback(data)
                resolve(data)
              }
            })  
          })
        },
        subscribe: (node, callback) => {
          this.sub(node, callback)
          // this.sub([node], function (data) {
          //   if (data) {
          //     callback(data[0].value)
          //   }
          // }, 5000)
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
          // top.webMI.data.write(nodes, values, callback)
        }
      },
      gfx: {
        addForeignObject: (a, b) => {
          // debugger
          return top.webMI.gfx.addForeignObject(a,b)
        },
        setWidth: (id, width) => {
          top.webMI.gfx.setWidth(self.$refs[id], width)
        },
        setAttribute: (domNode, attribute, value) => {
          top.webMI.gfx.setAttribute(self.$refs[domNode], attribute, value)
          // domNode.setAttribute(attribute, value)
        },
        setFill: (id, color) => {
          top.webMI.gfx.setFill(self.$refs[id], color)
          // self.$refs[id].style.setProperty('fill', color)
        },
        setFillOpacity: (id, opacity) => {
          top.webMI.gfx.setFillOpacity(self.$refs[id], opacity)
          // self.$refs[id].style.setProperty('fill-opacity', opacity)
        },
        setStrokeOpacity: (id, opacity) => {
          top.webMI.gfx.setStrokeOpacity(self.$refs[id], opacity)
          // self.$refs[id].style.setProperty('fill-opacity', opacity)
        },
        setStroke: (id, color) => {
          top.webMI.gfx.setStroke(self.$refs[id], color)
          // self.$refs[id].style.setProperty('stroke', color)
        },
        setRotation: (id, value) => {
          const refpx = self.$refs[id].getAttribute('atv:refpx')
          const refpy = self.$refs[id].getAttribute('atv:refpy')
          self.$refs[id].style.transformOrigin = `${refpx}px ${refpy}px 0`
          top.webMI.gfx.setRotation(self.$refs[id], value)
          // this.webMI.setTransform(id, 'rotate', value + 'deg')
        },
        setMoveX: (id, value) => {
          // const refpx = self.$refs[id].getAttribute('atv:refpx')
          // const refpy = self.$refs[id].getAttribute('atv:refpy')
          // self.$refs[id].style.transformOrigin = `${refpx}px ${refpy}px 0`
          top.webMI.gfx.setMoveX(self.$refs[id], value)
          // this.webMI.setTransform(id, 'translateX', value + 'px')
        },
        setMoveY: (id, value) => {
          // const refpx = self.$refs[id].getAttribute('atv:refpx')
          // const refpy = self.$refs[id].getAttribute('atv:refpy')
          // self.$refs[id].style.transformOrigin = `${refpx}px ${refpy}px 0`
          top.webMI.gfx.setMoveY(self.$refs[id], value)
          // this.webMI.setTransform(id, 'translateY', value + 'px')
        },
        setScaleX: (id, value) => {
          const refpx = self.$refs[id].getAttribute('atv:refpx')
          const refpy = self.$refs[id].getAttribute('atv:refpy')
          self.$refs[id].style.transformOrigin = `${refpx}px ${refpy}px 0`
          top.webMI.gfx.setScaleX(self.$refs[id], value)
          // this.webMI.setTransform(id, 'scaleX', value)
        },
        setScaleY: (id, value) => {
          const refpx = self.$refs[id].getAttribute('atv:refpx')
          const refpy = self.$refs[id].getAttribute('atv:refpy')
          self.$refs[id].style.transformOrigin = `${refpx}px ${refpy}px 0`
          top.webMI.gfx.setScaleY(self.$refs[id], value)
          // this.webMI.setTransform(id, 'scaleY', value)
        },
        setText: (id, value) => {
          top.webMI.gfx.setText(self.$refs[id], value)
          // try {
          //   self.$refs[id].innerHTML = value
          // } catch (error) {
          //   // console.error(id, error)
          // }
        },
        setVisible: (id, value) => {
          top.webMI.gfx.setVisible(self.$refs[id], value)
          // top.webMI.gfx.setVisible(self.$refs[id], value ? 'inherit' : false)
          // this.$refs[id].setAttribute('visibility', value ? '' : 'hidden')
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
        getCenterX (id) {
          return top.webMI.gfx.getCenterX(self.$refs[id])
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
          // return self.$el.querySelector('svg').createPoint(x, y)
          // return top.webMI.gfx.createPoint(x, y)
        },
        addCircle (attributes, parent) {
          // console.error('Not implemented!!')
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
          // const disp = url.split('.').slice(5).join('.')
          // this.$router.push('./' + disp)
          // this.$router.push({query: {display: url, parameters: JSON.stringify(parameters), iframe: iframe || 'content'} })
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
        // return value
      },
      translate: (value, minValue, maxValue, startValue, stopValue) => {
        return top.webMI.translate(value, minValue, maxValue, startValue, stopValue)
        // minValue = minValue === false ? 0 : (minValue === true ? 1 : minValue)
        // maxValue = maxValue === false ? 0 : (maxValue === true ? 1 : maxValue)
        // const rangeIn = maxValue - minValue
        // const rangeOut = stopValue - startValue
        // return (rangeOut / rangeIn) * value
      },
      setTransform: (id, translate, value) => {
        const refpx = self.$refs[id].getAttribute('atv:refpx')
        const refpy = self.$refs[id].getAttribute('atv:refpy')
        self.$refs[id].style.transformOrigin = `${refpx}px ${refpy}px 0`
        // self.$refs[id].style.transitionDuration = '500ms'
        const res = self.$refs[id].style.transform
        // const res = self.$refs[id].getAttribute('transform')
        let arr = []
        if (res) {
          arr = res.split(' ')
        }
        const transforms = {}
        // get all transforms on object
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
          // console.log(key, transforms[key]);
        })
        // console.log(arr.join(' '))
        self.$refs[id].style.setProperty('transform', arr.join(' '))
        // self.$refs[id].setAttribute('transform', 'translate(20,20) ' + arr.join(' '))
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
  destroyed () {
    this.intervals.forEach((interval) => {
      clearInterval(interval)
    })
    this.subs.forEach((sub) => {
      clearInterval(sub)
      //top.webMI.data.unsubscribe(this.subs)
    })
    this.filterSubs.forEach((sub)=>{
      console.log('unsubscribeFilter:', sub)
      console.log(top.webMI.data.unsubscribeFilter(sub))
    })
    this.onUnload.forEach((unload)=>{
      unload()
    })
    top.webMI.alarm.unsubscribe(this.alarmSubs)
    this.triggers.map((trigger) => {
      this.$nuxt.$off(trigger)
    })
  }
}
