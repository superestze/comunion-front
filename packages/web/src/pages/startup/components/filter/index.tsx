import { defineComponent, PropType, computed } from 'vue'
import { startupSortItemList } from '../../setting/components/sequence/BasicSortable'
import { ModuleTags } from '@/components/Tags'

export default defineComponent({
  props: {
    tabSequence: {
      type: Object as PropType<number[]>
    }
  },
  setup(props) {
    const tasksList = computed<string[]>(() => {
      const _tabSequence = Array.isArray(props.tabSequence) ? props.tabSequence : [2, 3, 4, 5]
      return _tabSequence.map(value => {
        const targetIndex = startupSortItemList.findIndex(item => item.id === value)
        if (targetIndex !== -1) {
          return startupSortItemList[targetIndex].name
        }
        return ''
      })
    })

    const tasks = computed(() => {
      return ['All', ...tasksList.value.filter(item => !!item)]
    })

    return {
      tasks
    }
  },
  emits: ['selectedTagChange'],
  render() {
    const handleSelectedChange = (selectedList: string[]) => {
      this.$emit('selectedTagChange', selectedList)
    }
    return (
      <div class="bg-white border rounded-[2px] mb-6 p-6 relative overflow-hidden">
        <ModuleTags tasks={this.tasks} onSelectedChange={handleSelectedChange} />
      </div>
    )
  }
})
