// windi.config.js
import ComponentConfig from '@comunion/components/windi.config'
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  ...ComponentConfig,
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}', 'public/**/*.html', 'index.html'],
    exclude: ['node_modules', '.git']
  },
  theme: {
    ...ComponentConfig.theme,
    extend: {
      // @ts-ignore
      ...ComponentConfig.theme.extend,
      colors: {
        // @ts-ignore
        ...ComponentConfig.theme.extend.colors,
        'home-bg': '#151515'
      }
    }
  },
  shortcuts: {
    ...ComponentConfig.shortcuts,
    'u-page-container': 'mx-auto w-94/100 xl:w-300 2xl:w-345',
    'u-comeup-card': 'font-orbitron font-bold tracking-normal text-[20px] text-grey1 leading-5'
  }
})
