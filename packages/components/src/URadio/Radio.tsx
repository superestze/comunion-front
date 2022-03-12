import { NRadio, RadioProps } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type URadioPropsType = RadioProps

const URadio = defineComponent({
  name: 'URadio',
  extends: NRadio,
  props: {
    size: {
      type: String as PropType<RadioProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => <NRadio {...props} v-slots={ctx.slots} />
  }
})

export default URadio
