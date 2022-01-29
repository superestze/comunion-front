import { defineComponent } from 'vue'
import './index.css'

export default defineComponent({
  name: 'UTag',
  setup(props, { slots }) {
    return () => <div class="u-tag">{slots.default?.()}</div>
  }
})
