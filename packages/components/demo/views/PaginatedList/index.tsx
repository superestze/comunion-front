import { defineComponent, reactive, ref } from 'vue'

import { UPaginatedList } from '@/comps/index'

export default defineComponent({
  setup() {
    const data = reactive([1, 2, 3, 4, 5, 6])
    const pageNum = ref<number>(1)

    return () => {
      return (
        <div class="h-full">
          <UPaginatedList
            dataSource={data}
            cellRender={i => {
              return <div class="h-[200px]">{i}</div>
            }}
            pagination={{
              page: pageNum.value,
              pageCount: 9,
              onUpdatePage(page) {
                pageNum.value = page
              }
            }}
          />
        </div>
      )
    }
  }
})
