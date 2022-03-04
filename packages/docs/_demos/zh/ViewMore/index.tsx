import { defineComponent } from 'vue'
import { UViewMore, UStyleProvider } from '@comunion/components'

const ViewMoreDemoPage = defineComponent({
  name: 'ViewMoreDemoPage',
  setup() {
    return () => (
      <>
        <UStyleProvider>
          <UViewMore>View all 250 comers</UViewMore>
        </UStyleProvider>
      </>
    )
  }
})

export default ViewMoreDemoPage
