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
      default: () => [
        {
          id: '0',
          title: 'STARTUP',
          subTitle: '(98)'
        },
        {
          id: '1',
          title: 'COMER',
          subTitle: '(300)'
        },
        {
          id: '2',
          title: 'CONNECTOR',
          subTitle: '(1.4w)'
        }
      ]
    }
  },
  emits: ['switchPanel'],
  setup(props) {
    const currentTabId = ref<string>(props.currentId)
    const tabList = computed(() => {
      let str =
        'w-1/3 flex w-30 flex-col justify-center text-14px font-bold text-center cursor-pointer'
      return props.tabs.map(tab => {
        if (tab.id === currentTabId.value) {
          str += ' text-primary pb-4 border-primary'
          return {
            ...tab,
            class: str
          }
        }
        str += ' text-primary1  pb-4 border-grey5'
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
