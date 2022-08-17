import { ArrowDownOutlined, ArrowUpOutlined } from '@comunion/icons'
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
      return props.fold ? 'More' : 'Less'
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
        class="w-100px flex justify-end items-center text-primary cursor-pointer"
        onClick={handleMore}
      >
        <span class="u-title2 mr-4 text-primary">{this.btnText}</span>
        {this.fold ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
      </div>
    )
  }
})
