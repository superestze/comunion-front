import { ArrowDownOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    end: {
      type: Boolean,
      required: true
    }
  },
  emits: ['more'],
  render() {
    const handleMore = () => {
      this.$emit('more')
    }
    return (
      <>
        {this.end ? null : (
          <div
            class="w-100px flex justify-center items-center text-color2 text-[14px] font-primary font-semibold cursor-pointer"
            onClick={handleMore}
          >
            <span class="mr-2 text-[14px] font-primary font-semibold">More</span>
            <ArrowDownOutlined class="text-color2 w-4 h-4" />
          </div>
        )}
      </>
    )
  }
})
