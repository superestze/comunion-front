import { defineComponent } from 'vue'

export const UNoContent = defineComponent({
  name: 'UNoContent',
  props: {
    textTip: {
      type: String,
      default: 'To be developed'
    }
  },
  setup(props, { slots }) {
    return () => (
      <div class="u-developing">
        <div class="flex items-center justify-center">{slots.default?.()}</div>
        <div class="text-center text-color3 u-h4">{props.textTip}</div>
      </div>
    )
  }
})

export default UNoContent
