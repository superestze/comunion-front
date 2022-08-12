import { defineComponent, PropType, computed, ref } from 'vue'

type Tab = {
  id: string
  title: string
  subTitle: string
  class?: string
}

export default defineComponent({
  props: {
    currentId: {
      type: String,
      required: true,
      default: () => '0'
    },
    tabs: {
      type: Array as PropType<Tab[]>,
      required: true
    }
  },
  emits: ['switchPanel'],
  setup(props) {
    const currentTabId = ref<string>(props.currentId)
    const tabList = computed(() => {
      return props.tabs.map(tab => {
        let str =
          'w-1/3 flex w-30 flex-col justify-center text-14px font-bold text-center cursor-pointer flex-grow'
        if (tab.id === currentTabId.value) {
          str += ' text-primary pb-4 border-primary'
          return {
            ...tab,
            class: str
          }
        }
        str += ' text-primary1 pb-4 border-grey5'
        return {
          ...tab,
          class: str
        }
      })
    })

    return {
      tabList,
      currentTabId
    }
  },
  render() {
    const switchTab = (id: string) => () => {
      this.$emit('switchPanel', id)
      this.currentTabId = id
    }
    return (
      <div class="flex">
        {this.tabList.map(tab => {
          return (
            <p
              class={tab.class}
              style={{ 'border-bottom-width': '1px' }}
              onClick={switchTab(tab.id)}
              key={tab.id}
            >
              <p>{tab.title}</p>
              <p class="mt-1">{tab.subTitle}</p>
            </p>
          )
        })}
      </div>
    )
  }
})
