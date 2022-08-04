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
        {this.end ? (
          <div class="w-100px flex justify-end items-center text-primary">
            <span class="u-title2 mr-4 text-primary">End</span>
          </div>
        ) : (
          <div
            class="w-100px flex justify-end items-center text-primary cursor-pointer"
            onClick={handleMore}
          >
            <span class="u-title2 mr-4 text-primary">More</span>
            <ArrowDownOutlined />
          </div>
        )}
      </>
    )
  }
})
