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
        class={props.uTagType == 'filled' ? `u-tag-filled bg-[${props.bgColor}]` : 'u-tag-outlined'}
      >
        {slots.default?.()}
      </div>
    )
  }
})

export default Utag
