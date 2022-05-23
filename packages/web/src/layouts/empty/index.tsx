import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

const EmptyLayout = defineComponent({
  name: 'EmptyLayout',
  setup() {
    return () => <RouterView />
  }
})

export default EmptyLayout
