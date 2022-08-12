import { defineComponent, ref, computed, PropType } from 'vue'

export default defineComponent({
  props: {
    tasks: {
      type: Array as PropType<string[]>,
      default: () => [],
      required: true
    }
  },
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
  emits: ['selectedChange'],
  render() {
    const handleTag = (key: string) => () => {
      if (key === 'All') {
        this.selectedList = ['All']
        this.$emit('selectedChange', this.selectedList)
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
        this.$emit('selectedChange', this.selectedList)
        return
      }
      const allIndex = this.selectedList.findIndex(value => value === 'All')
      if (allIndex > -1) {
        this.selectedList.splice(allIndex, 1)
      }
      this.selectedList.push(key)
      this.$emit('selectedChange', this.selectedList)
    }
    return (
      <div class="flex w-auto">
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
    )
  }
})
