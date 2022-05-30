// import './polyfil'
import 'virtual:windi.css'
import dayjs from 'dayjs'
import utcPlugin from 'dayjs/plugin/utc'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App'
import router from './router'
import './styles/index.css'

dayjs.extend(utcPlugin)

createApp(App).use(createPinia()).use(router).mount('#app')
