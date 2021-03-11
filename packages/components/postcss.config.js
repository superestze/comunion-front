module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-prefixer')({
      prefix: 'ui-',
      // ignore: ['.p-'],
    }),
    require('postcss-nested')({
      preserveEmpty: false,
    }),
  ],
}
