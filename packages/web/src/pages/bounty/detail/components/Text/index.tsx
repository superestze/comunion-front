import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: String,
      default: () => '100'
    },
    enhance: {
      type: Boolean,
      default: () => false
    },
    unit: {
      type: String,
      default: () => ''
    },
    plus: {
      type: Boolean,
      default: () => false
    },
    half: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props, ctx) {
    const formatText = computed(() => {
      if (props.enhance) {
        if (props.value === '0') {
          return <span class="u-h1 text-grey5 leading-none text-50px font-orbitron">0000</span>
        }
        const remaining = 4 - props.value.length
        let remainingStr = ''
        for (let i = 0; i < remaining; i++) {
          remainingStr += '0'
        }
        return (
          // text-warning
          <span
            class={`u-h1 ${
              ctx.attrs['text-color'] || 'text-primary'
            } leading-none text-50px font-orbitron`}
          >
            {props.value}.<span class="text-grey5">{remainingStr}</span>
          </span>
        )
      }
      return (
        <span
          class={`u-h1 ${
            ctx.attrs['text-color'] || 'text-primary'
          } leading-none text-36px font-orbitron`}
        >
          {props.value}
        </span>
      )
    })
    return {
      formatText
    }
  },
  render() {
    return (
      <p class="text-primary flex justify-center">
        <div class={`flex justify-end ${this.half ? 'basis-1/2' : 'basis-2/3'}`}>
          {this.plus ? (
            <span class="flex flex-col justify-end pb-6px">
              <span class="text-[1rem]"></span>
              <span class="text-[1.5rem]" data-name="placeholder">
                +
              </span>
            </span>
          ) : null}
          {this.formatText}
        </div>
        <div class={`flex justify-start ${this.half ? 'basis-1/2' : 'basis-1/3'}`}>
          {this.$slots.unit
            ? this.$slots.unit()
            : this.unit && (
                <span class="flex flex-col justify-end pb-6px text-grey1">
                  <span class="text-[1rem]"></span>
                  <span class="text-[1rem]">{this.unit}</span>
                </span>
              )}
        </div>
      </p>
    )
  }
})
