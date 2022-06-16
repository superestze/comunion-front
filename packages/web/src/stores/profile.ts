import { defineStore } from 'pinia'
import { ServiceReturn, services } from '@/services'

export type ProfileState = {
  detail: ServiceReturn<'account@comer-profile-get'> | null
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    detail: null
  }),
  getters: {
    value: state => state.detail
  },
  actions: {
    async get() {
      const { error, data } = await services['account@comer-profile-get']()
      if (!error) {
        this.detail = { ...data }
        return data
      }
      return
    }
  }
})
