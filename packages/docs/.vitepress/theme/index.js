import DefaultTheme from 'vitepress/theme'
import Demo from '../components/Demo/index.tsx'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.component('Demo', Demo)
  }
}
