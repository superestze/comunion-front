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
<<<<<<< HEAD
      primary: '#5E18FE',
      pageBgColor: '#151515'
=======
      primary: colors.blue
>>>>>>> chore: 🔧 组件打包
    }
  }
})
