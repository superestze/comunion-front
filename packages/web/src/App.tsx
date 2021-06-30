import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useEthProvider } from './providers/EthProvider'

export default defineComponent({
  name: 'App',
  setup() {
    useEthProvider()
    return () => <RouterView />
  }
})
