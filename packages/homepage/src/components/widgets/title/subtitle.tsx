import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    color: {
      type: String,
      default: () => '#666666'
    },
    text: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const subTitleColor = computed(() => {
      return {
        color: props.color
      }
    })
    return {
      subTitleColor
    }
  },
  render() {
    return (
      <p class="text-16px text-center font-bold text-center" style={this.subTitleColor}>
        {this.text}
      </p>
    )
  }
})
