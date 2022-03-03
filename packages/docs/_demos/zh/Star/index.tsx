import { defineComponent } from 'vue'
import { UStar, UStyleProvider } from '@comunion/components'

const ViewMoreDemoPage = defineComponent({
  name: 'ViewMoreDemoPage',
  setup() {
    return () => (
      <>
        <UStyleProvider>
          <UStar>Premium</UStar>
        </UStyleProvider>
      </>
    )
  }
})

export default ViewMoreDemoPage
