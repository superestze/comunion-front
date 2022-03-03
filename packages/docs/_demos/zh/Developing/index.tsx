import { defineComponent } from 'vue'
import { UDeveloping, UStyleProvider } from '@comunion/components'

const BackDemoPage = defineComponent({
  name: 'DevelopingDemoPage',
  setup() {
    return () => (
      <>
        <UStyleProvider>
          <UDeveloping style="height:400px">BOUNTIES</UDeveloping>
        </UStyleProvider>
      </>
    )
  }
})

export default BackDemoPage
