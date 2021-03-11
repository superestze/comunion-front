import { defineComponent, PropType } from 'vue'
import { RouteLocationRaw, RouterLink } from 'vue-router'
import { addClassPrefix } from '../utils'

import './Item.css'

export default defineComponent({
  name: 'NavigatorItem',
  props: {
    route: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true,
    },
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
  },
})
