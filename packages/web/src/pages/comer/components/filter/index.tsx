import { UTabPane, UTabs } from '@comunion/components'
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
  emits: ['tabChange', 'selectedTagChange'],
  setup() {
    const tag1 = ref<any>()
    const tag2 = ref<any>()
    return {
      tag1,
      tag2
    }
  },
  render() {
    const tabsChange = (value: string) => {
      if (this.tag1) this.tag1.selectedList = ['All']
      if (this.tag2) this.tag2.selectedList = ['All']
      this.$emit('selectedTagChange', ['All'])
      this.$emit('tabChange', value === 'CREATED BY ME')
    }

    const handleSelectedChange = (selectedList: string[]) => {
      this.$emit('selectedTagChange', selectedList)
    }

    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden p-10">
        <UTabs onUpdateValue={tabsChange}>
          <UTabPane name="PARTICIPATED" tab="PARTICIPATED" class="h-10">
            <ModuleTags
              class="mt-4"
              tasks={this.tasks}
              onSelectedChange={handleSelectedChange}
              ref={(ref: any) => (this.tag1 = ref)}
            />
          </UTabPane>
          <UTabPane name="CREATED BY ME" tab="CREATED BY ME" class="h-10">
            <ModuleTags
              class="mt-4"
              tasks={this.tasks}
              onSelectedChange={handleSelectedChange}
              ref={(ref: any) => (this.tag2 = ref)}
            />
          </UTabPane>
        </UTabs>
      </div>
    )
  }
})