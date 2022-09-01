import { ArrowRightOutlined, ArrowUpOutlined } from '@comunion/icons'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    fold: {
      type: Boolean,
      required: true
    }
  },
  emits: ['more'],
  setup(props) {
    const btnText = computed(() => {
      return props.fold ? 'View all' : 'Pack up'
    })
    return {
      btnText
    }
  },
  render() {
    const handleMore = () => {
      this.$emit('more')
    }
    return (
      <div
        class="w-110px flex justify-end items-center text-primary cursor-pointer"
        onClick={handleMore}
      >
        <span class="u-title2 mr-2 text-primary">{this.btnText}</span>
        {this.fold ? <ArrowRightOutlined /> : <ArrowUpOutlined />}
      </div>
    )
  }
})
