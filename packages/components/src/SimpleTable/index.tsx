import { defineComponent } from 'vue'

// import './index.css'

export default defineComponent({
  name: 'SimpleTable',
  props: {},
  setup(props, ctx) {
    return () => <span>{ctx.slots.default?.()}</span>
  },
})
