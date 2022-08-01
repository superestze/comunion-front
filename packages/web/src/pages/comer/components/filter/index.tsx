import { UTabPane, UTabs } from '@comunion/components'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    tasks: {
      type: Array as PropType<string[]>,
      default: () => [],
      required: true
    }
  },
  render() {
    const tabsChange = () => {
      // todo
    }
    const temp =
      'flex h-8 rounded-8px justify-center items-center bg-purple text-grey2 mr-2 min-w-12 px-4 py-1.5 cursor-pointer'
    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden p-10">
        <UTabs onUpdateValue={tabsChange}>
          <UTabPane name="PARTICIPATED" tab="PARTICIPATED" class="h-112">
            <div class="flex w-full">
              {this.tasks.map((task, $index) => {
                if ($index === 0) {
                  return (
                    <>
                      <div class={temp}>All</div>
                      <div class={temp}>{task}</div>
                    </>
                  )
                }
                return <div class={temp}>{task}</div>
              })}
            </div>
          </UTabPane>
          <UTabPane name="CREATED BY ME" tab="CREATED BY ME" class="h-112"></UTabPane>
        </UTabs>
      </div>
    )
  }
})
