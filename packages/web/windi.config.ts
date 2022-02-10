// windi.config.js
import ComponentConfig from '@comunion/components/windi.config'

export default {
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
  }
}
