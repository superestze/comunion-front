import nested from 'postcss-nested'
import prefixer from 'postcss-prefixer'

export const prefixerConfig = prefixer({ prefix: 'ui-' })
export const nestedConfig = nested({ preserveEmpty: false })

export default {
  plugins: [prefixerConfig, nestedConfig],
}
