import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useEtherProvider } from './hooks/useEther'

export default defineComponent({
  name: 'App',
  setup() {
    useEtherProvider()
    return () => <RouterView />
  }
})
