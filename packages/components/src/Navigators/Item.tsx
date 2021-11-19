import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'
import { addClassPrefix } from '../utils'

import './Item.css'

export default defineComponent({
  name: 'NavigatorItem',
  props: {
    route: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true
    }
  },
  setup(props, ctx) {
    return () => (
      <RouterLink
        to={props.route}
        class={addClassPrefix('navigator-item')}
        activeClass={addClassPrefix('navigator-item_active')}
      >
        {() => ctx.slots.default?.()}
      </RouterLink>
    )
  }
})
