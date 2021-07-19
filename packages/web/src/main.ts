import 'virtual:windi.css'
import { createApp } from 'vue'
import App from './App'
import router from './router'

createApp(App).use(router).mount('#app')

// polyfil
if (typeof (window as any).global === 'undefined') {
  ;(window as any).global = window
}
