import { PenOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['handleClick'],
  render() {
    const handleClick = () => {
      this.$emit('handleClick')
    }
    return (
      <span
        onClick={handleClick}
        class="cursor-pointer flex flex-row text-primary items-center u-body2"
      >
        {typeof this.$slots.default === 'function' ? (
          this.$slots.default()
        ) : (
          <>
            <PenOutlined class="h-4 mr-3 w-4" />
            EDIT
          </>
        )}
      </span>
    )
  }
})
