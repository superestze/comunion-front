import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String
    },
    lock: {
      type: Boolean,
      require: true,
      default: () => false
    }
  },
  setup(props) {
    const outlined = computed(() => {
      const str = 'flex flex-col border-1 border-solid rounded-8px bg-white overflow-hidden'
      if (props.lock) {
        return `${str} border-error`
      }
      return `${str} border-purple-light`
    })
    return {
      outlined
    }
  },
  render() {
    return (
      <div class={this.outlined}>
        {this.$slots.title ? (
          this.$slots.title()
        ) : (
          <p class="flex justify-between items-center bg-purple h-72px">
            <span class="text-20px ml-24px">{this.title}</span>
          </p>
        )}
        {this.$slots.text?.()}
        {this.$slots.btn?.()}
      </div>
    )
  }
})
