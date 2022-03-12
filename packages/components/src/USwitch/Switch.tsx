import type { SwitchProps } from 'naive-ui'
import { NSwitch } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type USwitchPropsType = SwitchProps

const USwitch = defineComponent({
  name: 'USwitch',
  extends: NSwitch,
  props: {
    size: {
      type: String as PropType<SwitchProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => <NSwitch {...props} v-slots={ctx.slots} />
  }
})

export default USwitch
