import { defineStore } from 'pinia'
import { ServiceReturn, services } from '@/services'

export type ProfileState = {
  detail: ServiceReturn<'account@comer-profile-get'> | null
  someone: ServiceReturn<'account@comer-info-get'> | null
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    detail: null,
    someone: null
  }),
  getters: {
    value: state => state.detail
  },
  actions: {
    async get(cb?: () => void, comerId?: string) {
      if (comerId) {
        const { error, data } = await services['account@comer-info-get']({ comerId })
        if (!error) {
          this.someone = { ...data }
        }
        cb && cb()
        return
      }
      const { error, data } = await services['account@comer-profile-get']()
      if (!error) {
        this.detail = { ...data }
      }
      cb && cb()
    }
  }
})
