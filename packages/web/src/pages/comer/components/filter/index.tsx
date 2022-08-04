import { UTabPane, UTabs } from '@comunion/components'
import { defineComponent, PropType, ref, computed } from 'vue'

export default defineComponent({
  props: {
    tasks: {
      type: Array as PropType<string[]>,
      default: () => [],
      required: true
    }
  },
  emits: ['tabChange', 'selectedTagChange'],
  setup(props) {
    const selectedList = ref<string[]>(['All'])
    const taskList = computed(() => {
      const str =
        'flex h-8 rounded-8px justify-center items-center mr-2 min-w-12 px-4 py-1.5 cursor-pointer'
      return props.tasks.map(task => {
        const index = selectedList.value.findIndex(item => item === task)
        if (index > -1) {
          return {
            value: task,
            class: `${str} text-primary`,
            active: true
          }
        }
        return {
          value: task,
          class: `${str} bg-purple text-grey2`,
          active: false
        }
      })
    })
    return {
      selectedList,
      taskList
    }
  },
  render() {
    const tabsChange = (value: string) => {
      this.selectedList = ['All']
      this.$emit('selectedTagChange', this.selectedList)
      this.$emit('tabChange', value === 'CREATED BY ME')
    }

    const handleTag = (key: string) => () => {
      if (key === 'All') {
        this.selectedList = ['All']
        this.$emit('selectedTagChange', this.selectedList)
        return
      }
      const index = this.selectedList.findIndex(value => {
        return value === key
      })
      if (index > -1) {
        this.selectedList.splice(index, 1)
        if (this.selectedList.length === 0) {
          this.selectedList = ['All']
        }
        this.$emit('selectedTagChange', this.selectedList)
        return
      }
      const allIndex = this.selectedList.findIndex(value => value === 'All')
      if (allIndex > -1) {
        this.selectedList.splice(allIndex, 1)
      }
      this.selectedList.push(key)
      this.$emit('selectedTagChange', this.selectedList)
    }
    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden p-10">
        <UTabs onUpdateValue={tabsChange}>
          <UTabPane name="PARTICIPATED" tab="PARTICIPATED" class="h-10">
            <div class="flex w-full mt-4">
              {this.taskList.map(task => {
                return (
                  <div
                    class={task.class}
                    onClick={handleTag(task.value)}
                    style={task.active ? { backgroundColor: 'rgba(83, 49, 244, 0.1)' } : {}}
                  >
                    {task.value}
                  </div>
                )
              })}
            </div>
          </UTabPane>
          <UTabPane name="CREATED BY ME" tab="CREATED BY ME" class="h-10">
            <div class="flex w-full mt-4">
              {this.taskList.map(task => {
                return (
                  <div
                    class={task.class}
                    onClick={handleTag(task.value)}
                    style={task.active ? { backgroundColor: 'rgba(83, 49, 244, 0.1)' } : {}}
                  >
                    {task.value}
                  </div>
                )
              })}
            </div>
          </UTabPane>
        </UTabs>
      </div>
    )
  }
})
