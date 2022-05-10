import { defineComponent } from 'vue'
import HowWork from './components/HowWork'
import Recommend from './components/Recommend'

const UserWelcomePage = defineComponent({
  name: 'UserWelcomePage',

  setup() {
    return () => (
      <>
        <article class="mt-50px mb-20">
          <div class="text-primary u-h2">Welcome to Comunion!</div>
          <div class="mt-2 text-grey1 u-title2">
            The first decentralized startup and security protocol.
          </div>
          <section class="flex flex-row mt-10">
            <div class="flex-1 left mr-10">
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
