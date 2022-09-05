import { defineComponent, ref } from 'vue'
import { ModuleTags } from '@/components/Tags'
import { services, ServiceReturn } from '@/services'
type DataType = NonNullable<ServiceReturn<'startup@tartup-businness-data-count'>>

export default defineComponent({
  props: {
    startupId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const tag = ref<any>()
    const dataCount = ref<DataType>()
    const tasks = ref([])

    services['startup@tartup-businness-data-count']({
      startupID: props.startupId
    }).then(res => {
      if (!res.error) {
        dataCount.value = res.data
      }
    })

    return {
      tasks,
      tag
    }
  },
  emits: ['selectedTagChange'],
  render() {
    const handleSelectedChange = (selectedList: string[]) => {
      this.$emit('selectedTagChange', selectedList)
    }
    return (
      <div class="bg-white border rounded-lg mb-6 p-6 relative overflow-hidden">
        <ModuleTags
          tasks={this.tasks}
          onSelectedChange={handleSelectedChange}
          ref={(ref: any) => (this.tag = ref)}
        />
      </div>
    )
  }
})
