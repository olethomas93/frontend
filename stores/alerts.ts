import { defineStore } from 'pinia'

type AlertPayload = {
  message?: string
  response?: { status?: number; data?: { message?: string } }
}

type CustomAlertPayload = {
  message?: string
  type?: string
}

export const useAlertsStore = defineStore('alerts', {
  state: () => ({
    alerts: {} as Record<string, any>
  }),
  actions: {
    setAlert (error: AlertPayload) {
      const statuscode = error?.response?.status
      const body = error?.response?.data?.message
      const message = error?.message ?? body ?? ''
      this.alerts = { message, statuscode, body, type: '' }
    },
    setCustomAlert (payload: CustomAlertPayload) {
      this.alerts = { message: payload?.message ?? '', type: payload?.type ?? 'custom' }
    }
  }
})
