import type { CardProps } from 'naive-ui'
import { NCard } from 'naive-ui'
import { defineComponent } from 'vue'

export type UCardPropsType = CardProps

const UCard = defineComponent({
  name: 'UCard',
  extends: NCard,
  setup(props, ctx) {
    return () => <NCard {...props} v-slots={ctx.slots} />
  }
})

export default UCard