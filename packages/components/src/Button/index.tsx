import { defineComponent } from 'vue'

// import './index.css'

export default defineComponent({
  name: 'Button',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    return () => (
      <button class={`px-2 py-1 ${props.disabled ? 'bg-grey' : 'bg-primary'}`} {...ctx.attrs}>
        {ctx.slots.default?.()}
      </button>
    )
  }
})
