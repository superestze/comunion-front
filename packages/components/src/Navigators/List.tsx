import { defineComponent } from 'vue'
import { addClassPrefix } from '../utils'

import './List.css'

export default defineComponent({
  name: 'Navigators',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    return () => (
      <div class={addClassPrefix('navigator')}>
        <div class={addClassPrefix('navigator-title')}>{props.title}</div>
        {ctx.slots.default?.()}
      </div>
    )
  },
})
