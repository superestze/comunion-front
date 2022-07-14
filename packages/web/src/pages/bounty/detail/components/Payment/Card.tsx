import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String
    }
  },
  setup(props, ctx) {
    return () => (
      <div class="flex flex-col border-purple-light border-1 border-solid rounded-8px bg-white overflow-hidden">
        {ctx.slots.title ? (
          ctx.slots.title()
        ) : (
          <p class="flex justify-between items-center bg-purple h-72px">
            <span class="text-20px ml-24px">{props.title}</span>
          </p>
        )}
        {ctx.slots.text?.()}
        {ctx.slots.btn?.()}
      </div>
    )
  }
})
