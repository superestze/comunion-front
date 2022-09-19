import { defineComponent } from 'vue'

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
  render() {
    return (
      <div
        class={`n-card u-card border-1 rounded-sm bg-white overflow-hidden ${
          this.lock ? 'border-error' : 'border-color-border'
        }`}
      >
        {this.$slots.title ? (
          this.$slots.title()
        ) : (
          <p class="bg-purple border-b border-color-border p-4 text-color1 u-h4">{this.title}</p>
        )}
        {typeof this.$slots.default === 'function' && (
          <div class="n-card__content">{this.$slots.default()}</div>
        )}
      </div>
    )
  }
})
