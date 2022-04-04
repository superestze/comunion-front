import type { CardProps } from 'naive-ui'
import { NCard } from 'naive-ui'
import { defineComponent, PropType } from 'vue'
import './index.css'

export type UCardPropsType = CardProps

const UCard = defineComponent({
  name: 'UCard',
  extends: NCard,
  props: {
    size: {
      type: String as PropType<CardProps['size']>,
      default: 'huge'
    }
  },
  setup(props, ctx) {
    return () => <NCard {...props} class="u-card" v-slots={ctx.slots} />
  }
})

export default UCard
