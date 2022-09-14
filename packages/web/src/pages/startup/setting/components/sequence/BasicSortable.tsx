import {
  DragFilled,
  SortIcon1Outlined,
  SortIcon2Outlined,
  SortIcon3Outlined,
  SortIcon4Outlined
} from '@comunion/icons'
import { defineComponent, ref, watch, PropType } from 'vue'
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

export const startupSortItemList = [
  {
    name: 'Bounty',
    text: '',
    id: 2,
    icon: () => <SortIcon1Outlined class="text-primary w-full" />
  },
  {
    name: 'dCrowdfunding',
    text: '',
    id: 3,
    icon: () => <SortIcon2Outlined class="text-primary w-full" />
  },
  {
    name: 'Governance',
    text: '',
    id: 4,
    icon: () => <SortIcon3Outlined class="text-primary w-full" />
  },
  {
    name: 'Other dapp',
    text: '',
    id: 5,
    icon: () => <SortIcon4Outlined class="text-primary w-full" />
  }
]

export default defineComponent({
  name: 'Sortable',
  props: {
    modelValue: {
      type: Object as PropType<number[]>
    }
  },
  components: {
    draggable
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const list = ref<ListItemType[]>([...startupSortItemList])

    const emitChange = () => {
      ctx.emit(
        'update:modelValue',
        list.value.map(e => e.id)
      )
    }

    watch(
      () => props.modelValue,
      propData => {
        if (
          Array.isArray(propData) &&
          propData.length &&
          !propData.filter(e => [2, 3, 4, 5].indexOf(e) === -1).length
        ) {
          list.value = propData.map(index => {
            return startupSortItemList[startupSortItemList.findIndex(e => e.id === index)]
          })
        } else {
          list.value = [2, 3, 4, 5].map(index => {
            return startupSortItemList[startupSortItemList.findIndex(e => e.id === index)]
          })
        }
      },
      {
        immediate: true
      }
    )

    return {
      list,
      emitChange
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
          onEnd={this.emitChange}
          v-slots={{
            item: (data: SortItemType) => {
              const { element } = data
              // console.log(element, index)
              return (
                <li
                  class="bg-white flex rounded-6px h-20 mb-6 w-full items-center justify-between"
                  style={{
                    boxShadow: '0px 2px 8px rgba(128, 145, 207, 0.1)'
                  }}
                >
                  <div class="flex items-center">
                    <div
                      class="rounded-full flex h-12 mr-6 ml-4 w-12 items-center justify-center"
                      style={{ backgroundColor: 'rgba(83, 49, 244, 0.1)' }}
                    >
                      {element.icon()}
                    </div>
                    <p class="u-title2">{element.name}</p>
                  </div>
                  <div class="cursor-pointer mr-8.5 w-5 handle">
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
