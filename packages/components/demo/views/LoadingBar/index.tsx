import ULoadingBar from '@/comps/ULoadingBar'
import { defineComponent } from 'vue'

const LoadingBarDemoPage = defineComponent({
  name: 'LoadingBarDemoPage',
  setup() {
    return () => <ULoadingBar />
  }
})

export default LoadingBarDemoPage
