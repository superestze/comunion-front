import { defineComponent } from 'vue'
import { UStar, StyleProvider } from '@comunion/components'

const ViewMoreDemoPage = defineComponent({
  name: 'ViewMoreDemoPage',
  setup() {
    return () => (
      <>
        <StyleProvider>
          <UStar>Premium</UStar>
        </StyleProvider>
      </>
    )
  }
})

export default ViewMoreDemoPage
