import {
  DragFilled,
  SortIcon1Outlined,
  SortIcon2Outlined,
  SortIcon3Outlined,
  SortIcon4Outlined
} from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import draggable from 'vuedraggable'

type SortItemType = {
  index: number
  element: ListItemType
}

type ListItemType = {
  name: string
  text: string
  id: number
  icon: () => any
}

export default defineComponent({
  components: {
    draggable
  },
  setup() {
    const list = ref<ListItemType[]>([
      {
        name: 'Bounty',
        text: '',
        id: 0,
        icon: () => <SortIcon1Outlined class="w-full text-primary" />
      },
      {
        name: 'Crowdfunding',
        text: '',
        id: 1,
        icon: () => <SortIcon2Outlined class="w-full text-primary" />
      },
      {
        name: 'Governance',
        text: '',
        id: 2,
        icon: () => <SortIcon3Outlined class="w-full text-primary" />
      },
      {
        name: 'Other dapp',
        text: '',
        id: 3,
        icon: () => <SortIcon4Outlined class="w-full text-primary" />
      }
    ])
    return {
      list
    }
  },
  render() {
    return (
      <div class="flex w-full">
        <draggable
          tag="ul"
          list={this.list}
          class="w-full"
          handle=".handle"
          itemKey="name"
          v-slots={{
            item: (data: SortItemType) => {
              const { element, index } = data
              console.log(element, index)
              return (
                <li
                  class="w-full h-20 items-center flex justify-between rounded-6px bg-white mb-6"
                  style={{
                    boxShadow: '0px 2px 8px rgba(128, 145, 207, 0.1)'
                  }}
                >
                  <div class="flex items-center">
                    <div
                      class="w-12 h-12 flex items-center justify-center rounded-full mr-6 ml-4"
                      style={{ backgroundColor: 'rgba(83, 49, 244, 0.1)' }}
                    >
                      {element.icon()}
                    </div>
                    <p class="u-title2">{element.name}</p>
                  </div>
                  <div class="handle w-5 mr-8.5 cursor-pointer">
                    <DragFilled class="w-full text-grey3" />
                  </div>
                </li>
              )
            }
          }}
        />
      </div>
    )
  }
})
