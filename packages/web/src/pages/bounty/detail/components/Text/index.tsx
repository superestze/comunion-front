import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    enhance: {
      type: Boolean,
      default: () => false
    },
    unit: {
      type: String,
      default: () => ''
    },
    second: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props, ctx) {
    const operatorClass = computed(() => {
      return `text-18px pb-6px ${props.second ? 'invisible' : ''}`
    })
    return () => (
      <p class="text-primary flex justify-center">
        <span class="flex flex-col justify-end">
          <span class="text-16px"></span>
          <span class={operatorClass.value} data-name="placeholder">
            +
          </span>
        </span>
        <span class="u-h1 text-primary leading-none text-50px font-orbitron">100</span>
        <span class="invisible" data-name="placeholder">
          P
        </span>
        {ctx.slots.unit ? (
          ctx.slots.unit()
        ) : (
          <span class="flex flex-col justify-end">
            <span class="text-16px"></span>
            <span class="text-16px pb-6px">{props.unit}</span>
          </span>
        )}
      </p>
      // <p class="text-primary w-full text-center mt-12px">
      //   <span class="text-18px">+</span>
      //   <span class="u-h1 text-primary leading-none">100</span>
      //   <span class="invisible" data-name="placeholder">
      //     P
      //   </span>
      //   <span>UVU</span>
      //   <span class="invisible" data-name="placeholder">
      //     P
      //   </span>
      // </p>
    )
  }
})
