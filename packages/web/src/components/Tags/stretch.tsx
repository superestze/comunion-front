import { UTag } from '@comunion/components'
import { defineComponent, computed, PropType } from 'vue'

export default defineComponent({
  props: {
    count: {
      type: Number,
      default: () => 3
    },
    tags: {
      type: Array as PropType<any[]>,
      default: () => []
    }
  },
  setup(props) {
    const hashtagsArray = computed(() =>
      props.tags.map(key => {
        return key.name
      })
    )
    return {
      hashtagsArray
    }
  },
  render() {
    return (
      <>
        {this.hashtagsArray.slice(0, this.count + 1).map((key, value) => {
          return value + 1 < this.count + 1 && <UTag key={value}>{key}</UTag>
        })}

        {this.hashtagsArray.length - this.count > 1 ? (
          <UTag>+ {this.hashtagsArray.length - this.count}</UTag>
        ) : null}
      </>
    )
  }
})
