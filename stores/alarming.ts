import { defineStore } from 'pinia'
import lodash from 'lodash'
import { useAlertsStore } from './alerts'
import { useTranslationStore } from './translation'
import { useAtviseStore } from './atvise'

let subscription: any

function getFlash (item: any) {
  return item.state === 1 && item.Flashtimeack
}

function getColor (item: any) {
  const defaultColor = lodash.get(item, 'Fontcolor', '#ff671f')
  const shelved = lodash.get(item, 'ShelvingState', false) && lodash.get(item, 'SuppressedOrShelved', false)
  let opacity = 'ff'
  if (shelved) {
    opacity = '99'
  }
  if (item.state === 1) {
    return lodash.get(item, 'State1FontColor', defaultColor) + opacity
  }
  if (item.state === 2) {
    return lodash.get(item, 'State2FontColor', defaultColor) + opacity
  }
  if (item.state === 3) {
    return lodash.get(item, 'State3FontColor', defaultColor) + opacity
  }
  return `${defaultColor}${opacity}`
}

function getAlarmAppearance (alarm: any) {
  const shelved = lodash.get(alarm, 'ShelvingState', false) && lodash.get(alarm, 'SuppressedOrShelved', false)
  let opacity = 'ff'
  if (shelved) {
    opacity = '99'
  }
  return {
    general: {
      fontColor: lodash.get(alarm, 'Fontcolor') + opacity,
      fillColor: lodash.get(alarm, 'Color') + opacity,
      fontFlashInterval: lodash.get(alarm, 'StateFontFlashInterval'),
      fillFlashInterval: lodash.get(alarm, 'StateFillFlashInterval')
    },
    inactive: {
      fontColor: lodash.get(alarm, 'State0FontColor') + opacity,
      fillColor: lodash.get(alarm, 'State0FillColor') + opacity,
      fontFlashInterval: lodash.get(alarm, 'State0FontFlashInterval'),
      fillFlashInterval: lodash.get(alarm, 'State0FillFlashInterval')
    },
    activeNeedInteraction: {
      fontColor: lodash.get(alarm, 'State1FontColor') + opacity,
      fillColor: lodash.get(alarm, 'State1FillColor') + opacity,
      fontFlashInterval: lodash.get(alarm, 'Flashtimeack'),
      fillFlashInterval: lodash.get(alarm, 'State1FillFlashInterval')
    },
    active: {
      fontColor: lodash.get(alarm, 'State2FontColor') + opacity,
      fillColor: lodash.get(alarm, 'State2FillColor') + opacity,
      fontFlashInterval: lodash.get(alarm, 'State2FontFlashInterval'),
      fillFlashInterval: lodash.get(alarm, 'State2FillFlashInterval')
    },
    inactiveNeedInteraction: {
      fontColor: lodash.get(alarm, 'State3FontColor') + opacity,
      fillColor: lodash.get(alarm, 'State3FillColor') + opacity,
      fontFlashInterval: lodash.get(alarm, 'Flashtimeinack'),
      fillFlashInterval: lodash.get(alarm, 'State3FillFlashInterval')
    }
  }
}

function getAlarmState (alarm: any) {
  if (alarm.ActiveStateId && !alarm.acknowledged) {
    return 'activeNeedInteraction'
  } else if (alarm.ActiveStateId && alarm.acknowledged) {
    return 'active'
  } else if (!alarm.ActiveStateId && !alarm.acknowledged) {
    return 'inactiveNeedInteraction'
  } else if (!alarm.ActiveStateId && alarm.acknowledged) {
    return 'inactive'
  }
  return 'unknown'
}

function resolveMinPriority () {
  try {
    return top.webMIConfig?.nuxt?.alarms?.minPriority ?? 0
  } catch (error) {
    return 0
  }
}

export const useAlarmingStore = defineStore('alarming', {
  state: () => ({
    alarms: [] as any[],
    conditions: [] as any[],
    categories: [] as any[],
    minAlarmSeverity: resolveMinPriority()
  }),
  getters: {
    getAlarmCount: (state) => (nodeId = 'AGENT.OBJECTS', mode = 'alarms', priorityFrom = 0, priorityTo = 999, onlyActive = false) => {
      let alarms = JSON.parse(JSON.stringify(state.alarms))
      alarms = alarms.filter((alarm: any) => {
        switch (mode) {
          case 'shelved':
            return alarm.InputNode.includes(nodeId) && alarm.ShelvingState && alarm.SuppressedOrShelved && alarm.EnabledStateId
          default:
            if (alarm.priority === 701) {
              return alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && alarm.EnabledStateId && (alarm.priority > state.minAlarmSeverity)
            } else {
              return alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && alarm.EnabledStateId && (alarm.priority > state.minAlarmSeverity)
            }
        }
      })

      alarms = alarms.filter((alarm: any) => alarm.priority >= priorityFrom && alarm.priority <= priorityTo)
      alarms = alarms.filter((alarm: any) => {
        if (onlyActive) {
          return alarm.ActiveStateId === true
        }
        return true
      })

      alarms = lodash.orderBy(alarms, ['state', 'priority'], ['asc', 'desc'])
      const shelved = state.alarms.filter((alarm: any) => {
        return (alarm.ShelvingState === 'TimedShelved' || alarm.ShelvingState === 'OneShotShelved') && alarm.InputNode.includes(nodeId)
      })
      const unacked = alarms.filter((alarm: any) => {
        return (!alarm.ShelvingState || alarm.ShelvingState === 'Unshelved') && alarm.acknowledged === false
      })
      const disabled = state.alarms.filter((alarm: any) => {
        return !alarm.EnabledStateId
      })
      const maxPriority = alarms.length > 0 ? alarms[0] : {}
      let color = '#ffffff'
      let flash = false
      if (alarms.length > 0) {
        color = getColor(alarms[0])
        flash = getFlash(alarms[0])
      }
      const appearance = getAlarmAppearance(maxPriority)
      const alarmState = getAlarmState(maxPriority)
      const stateAppearance = {
        fontColor: lodash.get(appearance, `${alarmState}.fontColor`, lodash.get(appearance, 'general.fontColor')),
        fillColor: lodash.get(appearance, `${alarmState}.fillColor`, lodash.get(appearance, 'general.fillColor')),
        fontFlashInterval: lodash.get(appearance, `${alarmState}.fontFlashInterval`, lodash.get(appearance, 'general.fontFlashInterval')),
        fillFlashInterval: lodash.get(appearance, `${alarmState}.fillFlashInterval`, lodash.get(appearance, 'general.fillFlashInterval'))
      }
      return {
        alarms: alarms.length,
        shelved: shelved.length,
        unacked: unacked.length,
        disabled: disabled.length,
        maxPriority: maxPriority.priority,
        color,
        flash,
        apperance: appearance,
        state: alarmState,
        stateApperance: stateAppearance
      }
    },
    getAlarms: (state) => (nodeId = 'AGENT.OBJECTS', mode?: string) => {
      let alarms = JSON.parse(JSON.stringify(state.alarms))
      alarms = alarms.filter((alarm: any) => {
        switch (mode) {
          case 'shelved':
            return alarm.InputNode.includes(nodeId) && alarm.ShelvingState && alarm.SuppressedOrShelved && alarm.EnabledStateId
          default:
            if (alarm.priority === 701) {
              return alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && alarm.EnabledStateId && (alarm.priority > state.minAlarmSeverity)
            } else {
              return alarm.InputNode.includes(nodeId) && (!alarm.ShelvingState || !alarm.SuppressedOrShelved) && alarm.EnabledStateId && (alarm.priority > state.minAlarmSeverity)
            }
        }
      })

      const translationStore = useTranslationStore()
      const atviseStore = useAtviseStore()
      if (top?.webMIConfig?.nuxt?.alarms?.useReplacement) {
        alarms = alarms.map((alarm: any) => {
          const language = atviseStore.language || 'nb'
          try {
            const toReplace = alarm.eventtext?.[language]?.match(/(?<=%\().+?(?=\))/g)
            if (toReplace) {
              toReplace.forEach((text: string) => {
                let replacementValue
                if (text === '') {
                  if (Object.prototype.hasOwnProperty.call(alarm, '')) {
                    replacementValue = alarm['']
                  } else {
                    replacementValue = ''
                  }
                } else if (Object.prototype.hasOwnProperty.call(alarm, text)) {
                  replacementValue = typeof alarm[text] === 'object' ? alarm[text][language] : alarm[text]
                } else {
                  replacementValue = ''
                }
                let newText = replacementValue ?? ''
                newText = translationStore.translateText(`T{${newText}}`)
                if (newText !== '' || replacementValue !== undefined) {
                  alarm.eventtext[language] = alarm.eventtext[language].replace(`%(${text})`, newText)
                }
              })
            }
          } catch (error) {
            console.error('Error during alarm text replacement:', error)
            return alarm
          }
          return alarm
        })
      }

      alarms = lodash.orderBy(alarms, ['priority', 'state', 'activetime'], ['desc', 'asc', 'desc'])
      return JSON.parse(JSON.stringify(alarms))
    },
    getConditions: (state) => (base = '') => {
      const states = JSON.parse(JSON.stringify(state.conditions))
      return states.filter((condition: any) => condition.base.includes(base))
    }
  },
  actions: {
    setAlarms (alarms: any[] | any) {
      if (Array.isArray(alarms)) {
        this.alarms = alarms
      } else {
        this.alarms = this.alarms.filter((alarm: any) => alarm.address !== alarms.address).concat(alarms)
        try {
          this.alarms = this.alarms.filter((alarm: any) => alarm.retain === true)
        } catch (error) {
          console.error(error)
        }
      }
    },
    setConditions (conditions: any[]) {
      this.conditions = conditions
    },
    setCategories (categories: any[]) {
      this.categories = categories
    },
    list () {
      if (!process.client) { return }
      let buffer: any[] = []
      let first = true
      let timeout: ReturnType<typeof setTimeout> | undefined
      if (subscription) {
        top.webMI.data.unsubscribeFilter(subscription)
      }
      subscription = top.webMI.data.subscribeFilter({ type: ['v:2'] }, (data: any) => {
        try {
          if (first) {
            buffer.push(data)
            if (!timeout) {
              timeout = setTimeout(() => {
                this.setAlarms(buffer)
                buffer = []
                first = false
              }, 3000)
            }
          } else {
            this.setAlarms(data)
          }
        } catch (error) {
          console.error('ALARM STORE ERROR', error)
        }
      })
    },
    conditionsAction () {
      if (!process.client) { return }
      top.webMI.data.call('AlarmConditions', {}, (data: any) => {
        this.setConditions(data)
      })
    },
    getCategoriesAction () {
      if (!process.client) { return }
      const filter = {
        startAddress: 'AGENT.ALARMING.Categories',
        endLevel: 0,
        vTypes: ['ObjectTypes.ATVISE.AlarmConditionCategory', 'i=62'],
        mapping: ['displayname:displayname', 'value:value']
      }
      top.webMI.data.call('BrowseNodes', filter, (data: any) => {
        const categories = lodash.orderBy(data, ['childs.severity.value'], ['desc'])
        this.setCategories(categories)
      })
    },
    acknowledge (payload: { address: string | string[]; comment?: string }) {
      if (!process.client) { return }
      const alertsStore = useAlertsStore()
      const addresses = Array.isArray(payload.address) ? payload.address : [payload.address]
      addresses.forEach((address) => {
        top.webMI.data.call('AlarmAcknowledge', { address, comment: payload.comment }, (response: any) => {
          if (response.result[0].error) {
            alertsStore.setCustomAlert({ message: response.result[0].errorstring })
          }
        })
      })
    },
    shelve (payload: { address: string | string[]; time?: number }) {
      if (!process.client) { return }
      const alertsStore = useAlertsStore()
      const addresses = Array.isArray(payload.address) ? payload.address : [payload.address]
      addresses.forEach((address) => {
        const args = payload.time === -1 || payload.time === undefined ? { address } : { address, time: payload.time }
        top.webMI.data.call('AlarmShelve', args, (response: any) => {
          if (response.result[0].error) {
            alertsStore.setCustomAlert({ message: response.result[0].errorstring })
          }
        })
      })
    },
    unshelve (payload: { address: string }) {
      if (!process.client) { return }
      const alertsStore = useAlertsStore()
      top.webMI.data.call('AlarmUnshelve', payload, (response: any) => {
        if (response.result[0].error) {
          alertsStore.setCustomAlert({ message: response.result[0].errorstring })
        }
      })
    }
  }
})
