import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['handleClick'],
  render() {
    const handleClick = () => {
      this.$emit('handleClick')
    }
    return (
      <span onClick={handleClick} class="cursor-pointer text-grey3 u-body2 hover:text-primary">
        {typeof this.$slots.default === 'function' ? this.$slots.default() : 'Edit'}
      </span>
    )
  }
})
