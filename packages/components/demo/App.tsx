import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import { StyleProvider } from '@/comps/index'

interface IProps {}

export default defineComponent<IProps>({
  setup() {
    return () => {
      return (
        <StyleProvider>
          <RouterView></RouterView>
        </StyleProvider>
      )
    }
  }
})
