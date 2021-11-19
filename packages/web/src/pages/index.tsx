// Comunion Economics
import ComunionEconomics from '@/pages/components/ComunionEconomics'
// Fotter
import Fotter from '@/pages/components/Fotter'
// Head
import Head from '@/pages/components/Head'
// introduce_and_join
import IntroduceAndJoin from '@/pages/components/IntroduceAndJoin'
// Mission
import Mission from '@/pages/components/Mission'
// Response
import OurResponse from '@/pages/components/OurResponse'
// PainsOfWorld
import PainsOfWorld from '@/pages/components/PainsOfWorld'
// UseCases
import UseCases from '@/pages/components/UseCases'
import { defineComponent } from 'vue'
import styles from './index.module.css'

export default defineComponent({
  name: 'HomePage',
  props: {},
  setup() {
    return () => (
      <div class="bg-pageBgColor">
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
        {/* Fotter */}
        <Fotter />
      </div>
    )
  }
})
