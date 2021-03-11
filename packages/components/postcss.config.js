// const classPrefix = require('postcss-prefixer')
// const postcssPresetEnv = require('postcss-preset-env')
// const tailwindcss = require('tailwindcss')
// const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-prefixer')({
      prefix: 'ui-',
      ignore: ['.p-'],
    }),
    require('postcss-nested')({
      preserveEmpty: false,
    }),
  ],
}
