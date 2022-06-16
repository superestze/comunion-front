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
    get() {
      return new Promise(resolve => {
        services['account@comer-profile-get']().then(response => {
          const { error, data } = response
          if (!error) {
            this.detail = { ...data }
            resolve(data)
          }
        })
      })
    }
  }
})
