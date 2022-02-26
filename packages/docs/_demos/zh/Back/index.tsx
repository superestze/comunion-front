import { defineComponent } from 'vue'
import { UBack, StyleProvider } from '@comunion/components'

const BackDemoPage = defineComponent({
  name: 'BackDemoPage',
  setup() {
    return () => (
      <>
        <StyleProvider>
          <UBack></UBack>
        </StyleProvider>
      </>
    )
  }
})

export default BackDemoPage
