import { defineComponent } from 'vue'
import './index.css'

export const UNoContent = defineComponent({
  name: 'UNoContent',
  props: {
    textTip: {
      type: String,
      default: 'To be developed'
    }
  },
  setup(props, { slots }) {
    return () => (
      <div class="u-developing">
        <div class="u-developing__img">{slots.default?.()}</div>
        <div class="u-developing__text">{props.textTip}</div>
      </div>
    )
  }
})

export default UNoContent
