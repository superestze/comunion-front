import { defineComponent, PropType, ref } from 'vue'
import { ModuleTags } from '@/components/Tags'

export default defineComponent({
  props: {
    tasks: {
      type: Array as PropType<string[]>,
      default: () => [],
      required: true
    }
  },
  setup() {
    const tag = ref<any>()
    return {
      tag
    }
  },
  emits: ['selectedTagChange'],
  render() {
    const handleSelectedChange = (selectedList: string[]) => {
      this.$emit('selectedTagChange', selectedList)
    }
    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden p-6">
        <ModuleTags
          tasks={this.tasks}
          onSelectedChange={handleSelectedChange}
          ref={(ref: any) => (this.tag = ref)}
        />
      </div>
    )
  }
})
