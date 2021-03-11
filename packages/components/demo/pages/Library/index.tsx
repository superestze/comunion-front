import { inject, defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { componentSymbol } from '../../provide'
import { ComponentMap } from '../../types'
import { Navigators } from '../../../src'

import './index.css'

export default defineComponent({
  name: 'Library',
  setup() {
    const components: ComponentMap = inject(componentSymbol)!
    return () => (
      <div class="p-library">
        <div class="p-library-navs">
          <Navigators title="Components">
            {Object.keys(components).map(componentName => (
              <Navigators.Item key={componentName} route={`/lib/components/${componentName}`}>
                {componentName}
              </Navigators.Item>
            ))}
          </Navigators>
        </div>
        <RouterView />
      </div>
    )
  },
})
