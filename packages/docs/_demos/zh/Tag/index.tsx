import { defineComponent } from 'vue'
import { UTag, StyleProvider } from '@comunion/components'

const ViewMoreDemoPage = defineComponent({
  name: 'ViewMoreDemoPage',
  setup() {
    return () => (
      <>
        <StyleProvider>
          <UTag>Premium</UTag>
        </StyleProvider>
      </>
    )
  }
})

export default ViewMoreDemoPage
