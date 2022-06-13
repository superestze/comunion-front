import { UCard } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'

export type DialogContentConfig = {
  width: number
}

export default defineComponent({
  name: 'DialogContent',
  props: {
    content: {
      type: String,
      default: () => ''
    },
    title: {
      type: String,
      require: true
    },
    config: {
      type: Object as PropType<DialogContentConfig>,
      require: true
    }
  },
  setup(props, ctx) {
    const widthStyle = computed<string>(() => {
      return `width: ${props.config?.width}px`
    })

    return () => (
      <UCard
        style={widthStyle.value}
        title={props.title}
        bordered={false}
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div>
          {typeof ctx.slots.content === 'function' ? ctx.slots.content() : <p> {props.content}</p>}
          {ctx.slots.footer?.()}
        </div>
      </UCard>
    )
  }
})
