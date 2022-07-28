// Comunion Economics
import { UStyleProvider } from '@comunion/components/src/UStyleProvider'
import { defineComponent } from 'vue'
import ComunionEconomics from './components/ComunionEconomics'
// Fotter
import Footer from './components/Footer'
// Head
import Head from './components/Head'
// introduce_and_join
import IntroduceAndJoin from './components/IntroduceAndJoin'
// Mission
import Mission from './components/Mission'
// Response
import OurResponse from './components/OurResponse'
// PainsOfWorld
import PainsOfWorld from './components/PainsOfWorld'
// UseCases
import UseCases from './components/UseCases'
import styles from './index.module.css'

export default defineComponent({
  name: 'HomePage',
  setup() {
    return () => (
      <UStyleProvider>
        <div class="bg-[#151515]">
          {/* Head */}
          <Head />
          {/* content */}
          <div class={`${styles.contentBox}`}>
            {/* introduce_and_join */}
            <IntroduceAndJoin />
            {/* Comunion Economics */}
            <ComunionEconomics />
            {/* Mission */}
            <Mission />
            {/* PainsOfWorld */}
            <PainsOfWorld />
            {/* Response */}
            <OurResponse />
            {/* UseCases */}
            <UseCases />
          </div>
          {/* Footer */}
          <Footer />
        </div>
      </UStyleProvider>
    )
  }
})
