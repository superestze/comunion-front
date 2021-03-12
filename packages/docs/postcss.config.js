const config = require('@comunion/components/postcss.config')
config.plugins.splice(
  2,
  1,
  require('postcss-prefixer')({
    prefix: 'ui-',
    ignore: ['.p-'],
  })
)

module.exports = config
