import { UButton } from '@comunion/components'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import IntroImg1 from './assets/intro1.png'
import IntroImg2 from './assets/intro2.png'
import IntroImg3 from './assets/intro3.png'
import IntroImg4 from './assets/intro4.png'
import RegisterLayout from './components/Layout'

const RegisterIntroductionPage = defineComponent({
  name: 'RegisterIntroductionPage',
  setup() {
    const { push } = useRouter()

    const toProfile = () => {
      push('./profile')
    }

    return () => (
      <RegisterLayout>
        <h1 class="text-primary pt-[9vh] u-h1">About to enter the decentralized network！</h1>
        <h2 class="mt-3 text-primary u-h1">You're a comer now！</h2>
        <p class="mt-6 text-grey3 u-body2">
          Comunion is a next, new startup paradigm of digital economic growth
        </p>
        <p class="mt-2 text-grey3 u-body2">
          Through the comunization form, Integrating remaining productivity of labor to construct a
          new startup mutual network, that is comunion economic paradigm, promote success rate of
          startup, in this process, realize labor-capitalized , enhance labor value liquidity
        </p>
        <div class="mt-18 grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <img src={IntroImg1} class="w-full max-w-[315px]" />
          <img src={IntroImg2} class="w-full max-w-[315px]" />
          <img src={IntroImg3} class="w-full max-w-[315px]" />
          <img src={IntroImg4} class="w-full max-w-[315px]" />
        </div>
        <div class="flex py-6 justify-end">
          <UButton
            type="primary"
            class="rounded-lg font-[16px] w-30"
            size="large"
            onClick={toProfile}
          >
            Next
          </UButton>
        </div>
      </RegisterLayout>
    )
  }
})

export default RegisterIntroductionPage
