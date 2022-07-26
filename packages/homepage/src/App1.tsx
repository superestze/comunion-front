// Comunion Economics
import { UMessage, UMessageProvider, UModalProvider } from '@comunion/components'
import { UStyleProvider } from '@comunion/components/src/UStyleProvider'
import { defineComponent } from 'vue'
import Benefits from './components/widgets/benefits'
import { First } from './components/widgets/describe'
import Ecomomy from './components/widgets/ecomomy'
import Footer from './components/widgets/footer'
import Header from './components/widgets/header'
import Innovative from './components/widgets/innovative'
import Overview from './components/widgets/overview'
import Relation from './components/widgets/relation'
import Revolutionary from './components/widgets/revolutionary'

import bg from '@/assets/20220725/bg1.png'

export default defineComponent({
  name: 'HomePage',
  setup() {
    return () => (
      <UStyleProvider>
        <UMessageProvider>
          <UMessage />
        </UMessageProvider>
        <UModalProvider>
          <div
            style={{
              backgroundImage: `url(${bg})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundColor: '#E5E5E5'
            }}
          >
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
