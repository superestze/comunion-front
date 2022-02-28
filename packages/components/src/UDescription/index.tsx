import { defineComponent } from 'vue'

export const descriptionProps = {} as const

// TODO
const UDescription = defineComponent({
  name: 'UDescription',
  props: descriptionProps,
  setup(props, ctx) {
    return () => <div>{ctx.slots.default?.()}</div>
  }
})

export default UDescription
