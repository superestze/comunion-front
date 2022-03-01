import { defineComponent } from 'vue'
import { UViewMore, StyleProvider } from '@comunion/components'

const ViewMoreDemoPage = defineComponent({
  name: 'ViewMoreDemoPage',
  setup() {
    return () => (
      <>
        <StyleProvider>
          <UViewMore>View all 250 comers</UViewMore>
        </StyleProvider>
      </>
    )
  }
})

export default ViewMoreDemoPage
