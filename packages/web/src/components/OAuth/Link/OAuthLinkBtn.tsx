import { UButton } from '@comunion/components'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OAuthLinkBtn',
  emits: ['triggerClick'],
  props: {
    disabled: {
      type: Boolean,
      required: true
    }
  },
  setup(props, ctx) {
    const handleClick = () => {
      ctx.emit('triggerClick')
    }

    return () => (
      <UButton
        class="ml-auto bg-white rounded-lg w-35 h-10"
        size="small"
        type="primary"
        ghost
        disabled={props.disabled}
        style={{
          '--n-border': '1px solid var(--u-primary-color)'
        }}
        onClick={handleClick}
      >
        {ctx.slots.default?.()}
      </UButton>
    )
  }
})
