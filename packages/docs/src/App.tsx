import { defineComponent, provide } from 'vue'
import { useRouter } from 'vue-router'
import { RouterView } from 'vue-router'
import * as components from '@comunion/components/src'
import { componentSymbol } from './provide'

export default defineComponent({
  name: 'App',
  props: {},
  setup() {
    const { getRoutes } = useRouter()
    provide(componentSymbol, components)

    getRoutes().find(route => route.path === '/lib').redirect = `/lib/components/${
      Object.keys(components)[0]
    }`

    console.log(components)
    return () => (
      <div>
        <RouterView />
      </div>
    )
  },
})
