import { defineComponent } from 'vue'
import { UDeveloping, StyleProvider } from '@comunion/components'

const BackDemoPage = defineComponent({
  name: 'DevelopingDemoPage',
  setup() {
    return () => (
      <>
        <StyleProvider>
          <UDeveloping style="height:400px">BOUNTIES</UDeveloping>
        </StyleProvider>
      </>
    )
  }
})

export default BackDemoPage
