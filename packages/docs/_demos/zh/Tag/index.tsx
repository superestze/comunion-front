import { defineComponent } from 'vue'
import { UTag, UStyleProvider } from '@comunion/components'

const ViewMoreDemoPage = defineComponent({
  name: 'ViewMoreDemoPage',
  setup() {
    return () => (
      <>
        <UStyleProvider>
          <UTag>Premium</UTag>
        </UStyleProvider>
      </>
    )
  }
})

export default ViewMoreDemoPage
