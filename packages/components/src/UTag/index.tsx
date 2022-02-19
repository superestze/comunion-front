import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import './index.css'

export const UTagProps = {
  uTagType: {
    type: String as PropType<'outlined' | 'filled'>,
    default: 'outlined'
  },
  bgColor: {
    type: String,
    default: '#5331F4'
  }
}

export const Utag = defineComponent({
  name: 'UTag',
  props: UTagProps,
  setup(props, { slots }) {
    return () => (
      <div
        class={`u-tag u-tag__${props.uTagType}`}
        style={props.uTagType === 'filled' ? { backgroundColor: props.bgColor } : undefined}
      >
        {slots.default?.()}
      </div>
    )
  }
})

export default Utag
