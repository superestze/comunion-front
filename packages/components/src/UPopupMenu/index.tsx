import { NDropdown } from 'naive-ui'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

const UPopupMenu = defineComponent({
  name: 'UPopupMenu',
  props: {
    trigger: {
      type: String as PropType<'click' | 'hover'>,
      default: 'click'
    },
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'medium'
    }
  },
  setup(props) {
    return () => <NDropdown trigger={props.trigger} showArrow></NDropdown>
  }
})

export default UPopupMenu
