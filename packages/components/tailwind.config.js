const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      primary: colors.blue,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
