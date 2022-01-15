import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['**/*.{vue,tsx,css}'],
    exclude: ['node_modules', '.git', 'lib']
  },
  darkMode: 'class',
  extend: {
    fontFamily: {
      orbitron: ['Orbitron', 'sans-serif'],
      opensans: ['Open Sans', 'sans-serif']
    },
    color: {
      primary: 'var(--u-color-primary)',
      primary1: 'var(--u-color-primary-1)',
      primary2: 'var(--u-color-primary-2)',
      error: 'var(--u-color-error)',
      success: 'var(--u-color-success)',
      warning: 'var(--u-color-warning)',
      info: 'var(--u-color-info)',
      grey1: 'var(--u-color-grey-1)',
      grey2: 'var(--u-color-grey-2)',
      grey3: 'var(--u-color-grey-3)',
      grey4: 'var(--u-color-grey-4)',
      grey5: 'var(--u-color-grey-5)',
      purple: 'var(--u-color-purple)',
      'purple-light': 'var(--u-color-purple-light)',
      'purple-gradient': 'var(--u-color-purple-gradient)'
    }
  }
})
