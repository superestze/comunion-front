import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'ComponentPage',
  props: {},
  setup() {
    const route = useRoute()
    return () => <div>{route.params.name}</div>
  },
})
