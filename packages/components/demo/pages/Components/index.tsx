import { defineComponent, watch } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

export default defineComponent({
  name: 'ComponentPage',
  props: {},
  setup() {
    const route = useRoute()
    return () => <div>{route.params.name}</div>
  },
})
