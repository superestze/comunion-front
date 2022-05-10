// Comunion Economics
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
import { useContractStore } from '@/stores/contract'

export default defineComponent({
  name: 'HomePage',
  setup() {
    const contractStore = useContractStore()
    // @ts-ignore
    window.contract = contractStore
    return () => (
      <div class="bg-home-bg">
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
    )
  }
})
