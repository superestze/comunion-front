import { defineComponent } from 'vue'
import HowWork from './components/HowWork'
import Recommend from './components/Recommend'

const UserWelcomePage = defineComponent({
  name: 'UserWelcomePage',

  setup() {
    return () => (
      <>
        <article class="mb-20">
          <div class="u-h2 text-primary">Welcome to Comunion!</div>
          <div class="u-title2 text-grey1">
            The first decentralized startup and security protocol.
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
