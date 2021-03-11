const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
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
