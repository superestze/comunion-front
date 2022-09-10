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
      const str = 'border-1 border-solid rounded-8px bg-white overflow-hidden'
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
          <p class="bg-purple flex h-72px justify-between items-center">
            <span class="ml-24px text-20px">{this.title}</span>
          </p>
        )}
        {this.$slots.text?.()}
        {this.$slots.btn?.()}
      </div>
    )
  }
})
