// let rights = { engineer: false }

// function getRigths (base) {
//   return new Promise((resolve) => {
//     top.webMI.data.getRights(base, (e) => {
//       resolve(e.rights)
//     })
//   })
// }
// getRigths('AGENT.OBJECTS').then((data) => {
//   rights = data
// })
import _ from 'lodash'
let sub
function getFlash (item) {
  if (item.state === 1 && item.Flashtimeack) {
    return true
  }
  return false
}

function getColor (item) {
  const defaultColor = window.$nuxt.$lodash.get(item, 'Fontcolor', '#ff671f')
  const shelved = _.get(item, 'ShelvingState', false) && _.get(item, 'SuppressedOrShelved', false)
  let opacity = 'ff'
  if (shelved) {
    opacity = '99'
  }
  if (item.state === 1) {
    return window.$nuxt.$lodash.get(item, 'State1FontColor', defaultColor) + opacity
  }
  if (item.state === 2) {
    return window.$nuxt.$lodash.get(item, 'State2FontColor', defaultColor) + opacity
  }
  if (item.state === 3) {
    return window.$nuxt.$lodash.get(item, 'State3FontColor', defaultColor) + opacity
  }
  return defaultColor + opacity
}

function getAlarmApperance (alarm) {
  const shelved = _.get(alarm, 'ShelvingState', false) && _.get(alarm, 'SuppressedOrShelved', false)
  let opacity = 'ff'
  if (shelved) {
    opacity = '99'
  }
  const temp = {
    general: {
      fontColor: _.get(alarm, 'Fontcolor') + opacity,
      fillColor: _.get(alarm, 'Color') + opacity,
      fontFlashInterval: _.get(alarm, 'StateFontFlashInterval'),
      fillFlashInterval: _.get(alarm, 'StateFillFlashInterval')
    },
    inactive: {
      fontColor: _.get(alarm, 'State0FontColor') + opacity,
      fillColor: _.get(alarm, 'State0FillColor') + opacity,
      fontFlashInterval: _.get(alarm, 'State0FontFlashInterval'),
      fillFlashInterval: _.get(alarm, 'State0FillFlashInterval')
    },
    activeNeedInteraction: {
      fontColor: _.get(alarm, 'State1FontColor') + opacity,
      fillColor: _.get(alarm, 'State1FillColor') + opacity,
      fontFlashInterval: _.get(alarm, 'Flashtimeack'),
      fillFlashInterval: _.get(alarm, 'State1FillFlashInterval')
    },
    active: {
      fontColor: _.get(alarm, 'State2FontColor') + opacity,
      fillColor: _.get(alarm, 'State2FillColor') + opacity,
      fontFlashInterval: _.get(alarm, 'State2FontFlashInterval'),
      fillFlashInterval: _.get(alarm, 'State2FillFlashInterval')
    },
    inactiveNeedInteraction: {
      fontColor: _.get(alarm, 'State3FontColor') + opacity,
      fillColor: _.get(alarm, 'State3FillColor') + opacity,
      fontFlashInterval: _.get(alarm, 'Flashtimeinack'),
      fillFlashInterval: _.get(alarm, 'State3FillFlashInterval')
    }
  }
  return temp
}

function getAlarmState (alarm) {
  if (alarm.ActiveStateId && !alarm.acknowledged) {
    return 'activeNeedInteraction'
  } else if (alarm.ActiveStateId && alarm.acknowledged) {
    return 'active'
  } else if (!alarm.ActiveStateId && !alarm.acknowledged) {
    return 'inactiveNeedInteraction'
  } else if (!alarm.ActiveStateId && alarm.acknowledged) {
    return 'inactive'
  } else {
    return 'unknown'
  }
}

const minAlarmSeverity = top.webMIConfig.nuxt.alarms.minPriority // top.webMIConfig.nuxt.minAlarmSeverity

export const state = () => ({
  alarms: [],
  conditions: [],
  categories: []
})

export const getters = {
  // eslint-disable-next-line arrow-parens
  getAlarmCount: (state) => (nodeId = 'AGENT.OBJECTS', mode = 'alarms', priorityFrom = 0, priorityTo = 999, onlyActive = false) => {
    let alarms = JSON.parse(JSON.stringify(state.alarms))
    const user = [] // top.$nuxt.$store.$auth.$state.user['https://jmhansen.no/jm.roles']
    alarms = alarms.filter((alarm) => {
      switch (mode) {
        case 'shelved': // Shelved
          return alarm.InputNode.includes(nodeId) && alarm.ShelvingState && alarm.SuppressedOrShelved && alarm.EnabledStateId
        default:
          if (alarm.priority === 701) {
            return user.includes('admin') && alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && alarm.EnabledStateId && (alarm.priority > minAlarmSeverity)
          } else {
            return alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && alarm.EnabledStateId && (alarm.priority > minAlarmSeverity)
          }
      }
    })

    // let alarms = JSON.parse(JSON.stringify(state.alarms))
    // const user = top.$nuxt.$store.$auth.$state.user['https://jmhansen.no/jm.roles']
    // const user = []
    // alarms = state.alarms.filter((alarm) => {
    //   if (alarm.priority === 701) {
    //     return user.includes('admin') && alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && alarm.EnabledStateId && (alarm.priority > minAlarmSeverity)
    //   } else {
    //     return alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && alarm.EnabledStateId && (alarm.priority > minAlarmSeverity)
    //   }
    // })

    // Priority filter
    alarms = alarms.filter((alarm) => {
      return alarm.priority >= priorityFrom && alarm.priority <= priorityTo
    })
    alarms = alarms.filter((alarm) => {
      if (onlyActive) {
        return alarm.ActiveStateId === true
      } else {
        return true
      }
    })
    // Order alarms
    alarms = window.$nuxt.$lodash.orderBy(alarms, ['state', 'priority'], ['asc', 'desc'])
    const shelved = state.alarms.filter((alarm) => {
      return (alarm.ShelvingState === 'TimedShelved' || alarm.ShelvingState === 'OneShotShelved') && alarm.InputNode.includes(nodeId)
    })
    const unacked = alarms.filter((alarm) => {
      return (!alarm.ShelvingState || alarm.ShelvingState === 'Unshelved') && alarm.acknowledged === false
    })
    const disabled = state.alarms.filter((alarm) => {
      return !alarm.EnabledStateId
    })
    const maxPriority = alarms.length > 0 ? alarms[0] : {} // alarms.length > 0 ? window.$nuxt.$lodash.maxBy(alarms, 'priority') : 0
    let color = '#ffffff'
    let flash = false
    if (alarms.length > 0) {
      color = getColor(alarms[0])
      flash = getFlash(alarms[0])
    }
    const apperance = getAlarmApperance(maxPriority)
    const alarmState = getAlarmState(maxPriority)
    const _ = top.window.$nuxt.$lodash
    const stateApperance = {
      fontColor: _.get(apperance, alarmState + '.fontColor') || _.get(apperance, 'general.fontColor'),
      fillColor: _.get(apperance, alarmState + '.fillColor') || _.get(apperance, 'general.fillColor'),
      fontFlashInterval: _.get(apperance, alarmState + '.fontFlashInterval') || _.get(apperance, 'general.fontFlashInterval'),
      fillFlashInterval: _.get(apperance, alarmState + '.fillFlashInterval') || _.get(apperance, 'general.fillFlashInterval')
    }
    return {
      alarms: alarms.length,
      shelved: shelved.length,
      unacked: unacked.length,
      disabled: disabled.length,
      maxPriority: maxPriority.priority,
      color,
      flash,
      apperance,
      state: alarmState,
      stateApperance
    }
    // return state.alarms.filter((alarm) => {
    //   return alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && !alarm.acknowledged
    // }).length
  },

  // eslint-disable-next-line arrow-parens
  getAlarms: (state) => (nodeId = 'AGENT.OBJECTS', mode) => {
    let alarms = JSON.parse(JSON.stringify(state.alarms))
    const user = [] // top.$nuxt.$store.$auth.$state.user['https://jmhansen.no/jm.roles']
    alarms = alarms.filter((alarm) => {
      switch (mode) {
        case 'shelved': // Shelved
          return alarm.InputNode.includes(nodeId) && alarm.ShelvingState && alarm.SuppressedOrShelved && alarm.EnabledStateId
        default:
          if (alarm.priority === 701) {
            return user.includes('admin') && alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && alarm.EnabledStateId && (alarm.priority > minAlarmSeverity)
          } else {
            return alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && alarm.EnabledStateId && (alarm.priority > minAlarmSeverity)
          }
      }
    })
    // activate function by webmicfg.js in atvise-project with nuxt { alarms {useReplacement: true/false} }
    const AlarmTextReplacement = top.webMIConfig.nuxt.alarms.useReplacement
    if (AlarmTextReplacement) {
      alarms.map((alarm) => {
        // Assuming this language access is now correct
        const language = top.$nuxt.$store.state.atvise.language || 'nb'
        // eslint-disable-next-line no-useless-escape
        try {
          const toReplace = alarm.eventtext[language].match(/(?<=%\().+?(?=\))/g)
          if (toReplace) {
            toReplace.forEach((text) => {
              let replacementValue

              // Check if the placeholder text is an empty string.
              // If so, try to use the value of the empty string key ""
              if (text === '') {
                // Use Object.prototype.hasOwnProperty.call for the empty string key
                if (Object.prototype.hasOwnProperty.call(alarm, '')) {
                  replacementValue = alarm['']
                } else {
                  // Handle case where the empty string key doesn't exist
                  replacementValue = '' // Or a different fallback
                }
              // eslint-disable-next-line brace-style
              }
              // Otherwise, try to find a property on the alarm object that matches the extracted text
              // Use Object.prototype.hasOwnProperty.call for the 'text' key
              else if (Object.prototype.hasOwnProperty.call(alarm, text)) {
                replacementValue = typeof alarm[text] === 'object' ? alarm[text][language] : alarm[text]
              // eslint-disable-next-line brace-style
              }
              // If neither of the above matches, handle it (e.g., use an empty string)
              else {
                replacementValue = '' // Or perhaps text itself: `%(${text})`
              }

              // Ensure replacementValue is not undefined or null before replacing
              let newText = replacementValue !== undefined && replacementValue !== null ? replacementValue : ''
              newText = top.$nuxt.$store.getters['translation/translateText'](`T{${newText}}`)

              // Only replace if newText is not empty (unless replacementValue was explicitly '')
              if (newText !== '' || (newText === '' && replacementValue !== undefined)) {
                alarm.eventtext[language] = alarm.eventtext[language].replace(`%(${text})`, newText)
              }
            })
          }
        } catch (error) {
          console.error('Error during alarm text replacement:', error)
          return alarm // Return original alarm on error
        }
        return alarm
      })
    }

    alarms = window.$nuxt.$lodash.orderBy(alarms, ['priority', 'state', 'activetime'], ['desc', 'asc', 'desc'])
    return JSON.parse(JSON.stringify(alarms))
  },
  // eslint-disable-next-line arrow-parens
  getConditions: (state) => (base = '') => {
    // const user = top.$nuxt.$store.$auth.$state.user['https://jmhansen.no/jm.roles']
    let states = JSON.parse(JSON.stringify(state.conditions))
    states = states.filter((state) => {
      return state.base.includes(base)
      // if (state.priority === 701) {
      //   return state.base.includes(base) && user.includes('admin')
      // } else {
      //   return state.base.includes(base)
      // }
    })
    // states = states.map((state) => {
    //   return state
    // })
    return states
  }
}

export const mutations = {
  SET_ALARMS (state, alarms) {
    if (Array.isArray(alarms)) {
      state.alarms = alarms
    } else {
      // add alarm to array
      state.alarms = state.alarms.filter(alarm => alarm.address !== alarms.address).concat(alarms)
      // remove alarm if inactive (retain false)
      try {
        state.alarms = state.alarms.filter((alarm) => {
          return alarm.retain === true
        })
      } catch (error) {
        console.log(error)
      }
    }
    // state.alarms = _.unionBy(state.alarms, alarms, 'address')
    // state.alarms = alarms
  },
  SET_CONDITIONS (state, conditions) {
    state.conditions = conditions
  },
  // UPDATE_CONDITION (state, condition) {},
  SET_CATEGORIES (state, categories) {
    state.categories = categories
  }
}

// https://nuxtjs.org/docs/2.x/concepts/context-helpers#accessing-the-root-instance
export const actions = {
  list ({ commit }) {
    let arr = []
    let first = true
    let timeout
    if (sub) {
      // console.log('unsub alarms')
      top.webMI.data.unsubscribeFilter(sub)
    }
    // top.webMI.data.subscribeFilter({ type: ['v:2'], init: ['v:true'] }, (data) => {
    sub = top.webMI.data.subscribeFilter({ type: ['v:2'] }, (data) => {
      try {
        if (first) {
          arr.push(data)
          if (!timeout) {
            timeout = setTimeout(() => {
              commit('SET_ALARMS', arr)
              arr = []
              first = false
            }, 3000)
          }
        } else {
          console.log('new alarm in store!!')
          commit('SET_ALARMS', data)
        }
      } catch (error) {
        console.log('**********************************************ALARM STORE ERROR!!!!!!!*******************************************************')
        console.error(error)
      }
    })
  },
  conditions ({ commit }) {
    top.webMI.data.call('AlarmConditions', {}, (data) => {
      commit('SET_CONDITIONS', data)
    })
  },
  updateCondition ({ commit }, data) {
  },
  getCategories ({ commit }) {
    const filter = {
      startAddress: 'AGENT.ALARMING.Categories',
      endLevel: 0,
      vTypes: ['ObjectTypes.ATVISE.AlarmConditionCategory', 'i=62'],
      mapping: ['displayname:displayname', 'value:value']
    }
    top.webMI.data.call('BrowseNodes', filter, (data) => {
      const categories = _.orderBy(data, ['childs.severity.value'], ['desc'])
      commit('SET_CATEGORIES', categories)
    })
  },
  acknowledge ({ commit }, data) {
    const isArray = Array.isArray(data.address)
    if (isArray) {
      data.address.forEach((item) => {
        top.webMI.data.call('AlarmAcknowledge', { address: item, comment: data.comment }, (e) => {
          if (e.result[0].error) {
            commit('SET_CUSTOM_ALERT', { message: e.result[0].errorstring }, { root: true })
          }
        })
      })
    } else {
      top.webMI.data.call('AlarmAcknowledge', data, (e) => {
        if (e.result[0].error) {
          commit('SET_CUSTOM_ALERT', { message: e.result[0].errorstring }, { root: true })
        }
      })
    }
  },
  shelve ({ commit }, data) {
    const isArray = Array.isArray(data.address)
    if (isArray) {
      data.address.forEach((item) => {
        if (data.time === -1) {
          top.webMI.data.call('AlarmShelve', { address: item }, (e) => {
            if (e.result[0].error) {
              commit('SET_CUSTOM_ALERT', { message: e.result[0].errorstring }, { root: true })
            }
          })
        } else {
          top.webMI.data.call('AlarmShelve', { address: item, time: data.time }, (e) => {
            if (e.result[0].error) {
              commit('SET_CUSTOM_ALERT', { message: e.result[0].errorstring }, { root: true })
            }
          })
        }
      })
    } else {
      top.webMI.data.call('AlarmShelve', data, (e) => {
        if (e.result[0].error) {
          commit('SET_CUSTOM_ALERT', { message: e.result[0].errorstring }, { root: true })
        }
      })
    }
  },
  unshelve ({ commit }, data) {
    top.webMI.data.call('AlarmUnshelve', data, (e) => {
      if (e.result[0].error) {
        commit('SET_CUSTOM_ALERT', { message: e.result[0].errorstring }, { root: true })
      }
    })
  }
}
