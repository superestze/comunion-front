import { defineComponent } from 'vue'
import ComunionEconomics from '../components/ComunionEconomics' // Comunion 经济学
import Fotter from '../components/Fotter' // Fotter
// import { RouterLink } from 'vue-router'
import Head from '../components/Head' // Head
import IntroduceAndJoin from '../components/IntroduceAndJoin' // 介绍/加入
import Mission from '../components/Mission' // 使命
import OurResponse from '../components/OurResponse' // Response
import UseCases from '../components/UseCases' // 用例

export default defineComponent({
  name: 'HomePage',
  props: {},
  setup() {
    return () => (
      <div>
        {/* Head */}
        <Head />
        {/* 内容区 */}
        <div class="bg-pageBgColor">
          {/* 介绍/加入 */}
          <IntroduceAndJoin />
          {/* Comunion 经济学 */}
          <ComunionEconomics />
          {/* 使命 */}
          <Mission />
          {/* Response */}
          <OurResponse />
          {/* 用例 */}
          <UseCases />
          {/* Fotter */}
          <Fotter />
        </div>
      </div>
    )
  }
})
