import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

const CommonLayout = defineComponent({
  name: 'CommonLayout',
  setup(_, ctx) {
    return () => (
      <div class="bg-purple h-full min-h-screen text-[14px] relative">
        {ctx.slots?.header?.()}
        <div class="u-page-container">
          <RouterView />
        </div>
        {ctx.slots?.footer?.()}
      </div>
    )
  }
})

export default CommonLayout
