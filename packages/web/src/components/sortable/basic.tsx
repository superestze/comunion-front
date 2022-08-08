import { DragFilled, SortIcon1Outlined } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import draggable from 'vuedraggable'

export default defineComponent({
  components: {
    draggable
  },
  setup() {
    const list = ref<any>([
      { name: 'John', text: '', id: 0 },
      { name: 'Joao', text: '', id: 1 },
      { name: 'Jean', text: '', id: 2 }
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
            item: ({ element, index }) => {
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
                      <SortIcon1Outlined class="w-full text-primary" />
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
        ></draggable>
      </div>
    )
  }
})
