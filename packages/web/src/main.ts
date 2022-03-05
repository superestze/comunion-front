// import './polyfil'
import 'virtual:windi.css'
import { createApp } from 'vue'
import App from './App'
import router from './router'
import './styles/index.css'
import '@comunion/components/dist/es/index.css'

createApp(App).use(router).mount('#app')
