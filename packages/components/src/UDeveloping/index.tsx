import { defineComponent } from 'vue'
import './index.css'

export const UDeveloping = defineComponent({
  name: 'UDeveloping',
  setup(props, { slots }) {
    return () => (
      <div class="u-developing">
        <div class="u-developing__title">{slots.default?.()}</div>
        <div class="u-developing__text">To be develop</div>
      </div>
    )
  }
})

export default UDeveloping