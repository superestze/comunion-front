import { UBackTop } from '@/comps/index'
import { defineComponent } from 'vue'

const BackTopDemoPage = defineComponent({
  name: 'BackTopDemoPage',
  setup() {
    return () => (
      <div class="h-[2000px]">
        <UBackTop />
      </div>
    )
  }
})

export default BackTopDemoPage
