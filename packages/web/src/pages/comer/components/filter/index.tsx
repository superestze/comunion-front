import { UTabPane, UTabs } from '@comunion/components'
import { defineComponent, PropType, ref } from 'vue'
import { ModuleTags } from '@/components/Tags'

export default defineComponent({
  name: 'Filter',
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
      this.$emit('tabChange', value === 'CREATED')
    }

    const handleSelectedChange = (selectedList: string[]) => {
      this.$emit('selectedTagChange', selectedList)
    }

    return (
      <div class="bg-white border rounded-lg mb-6 py-6 px-8 relative overflow-hidden">
        <UTabs onUpdateValue={tabsChange}>
          <UTabPane name="CREATED" tab="CREATED">
            <ModuleTags
              class="mt-2"
              tasks={this.tasks}
              onSelectedChange={handleSelectedChange}
              ref={(ref: any) => (this.tag2 = ref)}
            />
          </UTabPane>
          <UTabPane name="PARTICIPATED" tab="PARTICIPATED">
            <ModuleTags
              class="mt-2"
              tasks={this.tasks}
              onSelectedChange={handleSelectedChange}
              ref={(ref: any) => (this.tag1 = ref)}
            />
          </UTabPane>
        </UTabs>
      </div>
    )
  }
})
