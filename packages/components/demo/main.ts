import { createApp } from 'vue'
import App from './App'
import setupRouter from './route'

const app = createApp(App)
app.use(setupRouter())
app.mount('#app')
