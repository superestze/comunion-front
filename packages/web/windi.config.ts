// windi.config.js
import colors from 'windicss/colors'
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}', 'public/**/*.html', 'index.html'],
    exclude: ['node_modules', '.git']
  },
  darkMode: 'class',
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      textColor: '#333333',
      primary: '#5E18FE',
      pageBgColor: '#151515',
      bgLinear: 'linear-gradient(180deg,#151515, #5e18fe)',
      digitalIdentityBg: '#00183c',
      smartContractsBg: '#7D6100',
      tokenisationBg: '#00433C',
      governanceBg: '#54000C'
    }
  }
})
