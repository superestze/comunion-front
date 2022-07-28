import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    color: {
      type: String,
      default: () => '#111111'
    },
    text: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const h1Color = computed(() => {
      return {
        color: props.color
      }
    })
    return {
      h1Color
    }
  },
  render() {
    return (
      <h1 class="text-40px text-center font-bold" style={this.h1Color}>
        {this.text}
      </h1>
    )
  }
})
