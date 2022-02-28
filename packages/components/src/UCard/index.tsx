import { NCard } from 'naive-ui'
import { defineComponent } from 'vue'

const UCard = defineComponent({
  name: 'UCard',
  extends: NCard,
  setup(props, ctx) {
    return () => <NCard {...props}>{ctx.slots.default?.()}</NCard>
  }
})

export default UCard
