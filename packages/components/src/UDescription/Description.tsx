import type { PropType, VNode } from 'vue'
import { defineComponent } from 'vue'

export interface UDescriptionItem {
  label: string
  value: string | number | ((data: unknown) => VNode)
}

export const descriptionProps = {
  items: {
    type: Array as PropType<UDescriptionItem[]>,
    required: true
  }
} as const

// TODO
const UDescription = defineComponent({
  name: 'UDescription',
  props: descriptionProps,
  setup(props, ctx) {
    return () => <div>{ctx.slots.default?.()}</div>
  }
})

export default UDescription
