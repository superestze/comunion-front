import { defineStore } from 'pinia'

export type GlobalConfigState = {
  // current theme, default: light
  theme: 'light' | 'dark'
}

export const useGlobalConfigStore = defineStore('globalConfig', {
  state: (): GlobalConfigState => ({
    theme: 'light'
  }),
  actions: {
    switchTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    }
  }
})
