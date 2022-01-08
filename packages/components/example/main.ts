import 'virtual:windi.css'
import { createApp } from 'vue'
import App from './App'
import router from './router'
import './styles/base.css'

createApp(App).use(router).mount('#app')
