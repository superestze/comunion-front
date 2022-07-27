// Comunion Economics
import { UMessage, UMessageProvider, UModalProvider } from '@comunion/components'
import { UStyleProvider } from '@comunion/components/src/UStyleProvider'
import { defineComponent } from 'vue'
import app from './app.module.css'
import Background from './components/widgets/background'
import Benefits from './components/widgets/benefits'
import { First } from './components/widgets/describe'
import Ecomomy from './components/widgets/ecomomy'
import Footer from './components/widgets/footer'
import Header from './components/widgets/header'
import Innovative from './components/widgets/innovative'
import Overview from './components/widgets/overview'
import Relation from './components/widgets/relation'
import Revolutionary from './components/widgets/revolutionary'

export default defineComponent({
  name: 'HomePage',
  setup() {
    return () => (
      <UStyleProvider>
        <UMessageProvider>
          <UMessage />
        </UMessageProvider>
        <UModalProvider>
          <div class={app.content}>
            <Background />
            <Header />
            <First />
            <Overview />
            <Ecomomy />
            <Revolutionary />
            <Relation />
            <Benefits />
            <Innovative />
            <Footer />
          </div>
        </UModalProvider>
      </UStyleProvider>
    )
  }
})
