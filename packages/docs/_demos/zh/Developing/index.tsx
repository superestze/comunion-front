import { UDeveloping, UStyleProvider } from '@comunion/components'
import { defineComponent } from 'vue'

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
