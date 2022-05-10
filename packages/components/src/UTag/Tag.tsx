import { defineComponent } from 'vue'
import type { PropType, ExtractPropTypes } from 'vue'
import './index.css'

export const UTagProps = {
  type: {
    type: String as PropType<'outlined' | 'filled'>,
    default: 'outlined'
  },
  bgColor: {
    type: String,
    default: '#5331F4'
  }
}

export type UTagPropsType = ExtractPropTypes<typeof UTagProps>

export const Utag = defineComponent({
  name: 'UTag',
  props: UTagProps,
  setup(props, { slots }) {
    return () => (
      <div
        class={`u-tag u-tag__${props.type}`}
        style={props.type === 'filled' ? { backgroundColor: props.bgColor } : undefined}
      >
        {slots.default?.()}
      </div>
    )
  }
})

export default Utag
