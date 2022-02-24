import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import './index.css'

export const UStarProps = {
  type: {
    type: String as PropType<'follow' | 'followed'>,
    default: 'follow'
  }
}

export const UStar = defineComponent({
  name: 'UStar',
  props: UStarProps,
  setup(props) {
    return () => <div class={`u-star u-star__${props.type}`}>{props.type}</div>
  }
})

export default UStar
