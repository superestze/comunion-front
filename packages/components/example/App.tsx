import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import Layout from './layout'

export default defineComponent({
  setup() {
    return () => {
      return (
        <RouterView>
          <Layout />
        </RouterView>
      )
    }
  }
})
