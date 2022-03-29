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

export default defineComponent({
  name: 'HomePage',
  props: {},
  setup() {
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
