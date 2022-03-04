import { defineComponent } from 'vue'
import { UBack, UStyleProvider } from '@comunion/components'

const BackDemoPage = defineComponent({
  name: 'BackDemoPage',
  setup() {
    return () => (
      <>
        <UStyleProvider>
          <UBack></UBack>
        </UStyleProvider>
      </>
    )
  }
})

export default BackDemoPage
