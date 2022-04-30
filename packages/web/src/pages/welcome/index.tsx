import { defineComponent } from 'vue'
import HowWork from './components/HowWork'
import Recommend from './components/Recommend'

const UserWelcomePage = defineComponent({
  name: 'UserWelcomePage',

  setup() {
    return () => (
      <>
        <article class="mb-20">
          <div class="font-orbitron !font-normal font-700 text-[32px] leading-10 text-primary">
            Welcome to Comunion!
          </div>
          <div class="font-opensans font-600 text-[16px] font-normal text-grey1">
            Discover and join the startups that you like.
          </div>
          <section class="flex flex-row mt-10">
            <div class="left flex-1 mr-10">
              <Recommend />
            </div>
            <div class="w-111">
              <HowWork />
            </div>
          </section>
        </article>
      </>
    )
  }
})

export default UserWelcomePage
