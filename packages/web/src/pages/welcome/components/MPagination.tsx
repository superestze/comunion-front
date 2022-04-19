import { UPagination } from '@comunion/components/src'
import { defineComponent, PropType, inject } from 'vue'

interface pageList {
  page: number
  total: number
  pageSize: number
}
const MPagination = defineComponent({
  name: 'MPagination',
  props: {
    pageList: {
      type: Object as PropType<pageList>,
      required: true
    }
  },
  emits: ['updatePage'],
  setup(props, ctx) {
    // 注入父组件指定方法
    const PARENT_PROVIDE = 'parentProvide'
    // 注入父组件 ref
    const parentTestFun = inject(`${PARENT_PROVIDE}/updatePage`)
    const updatePages = (page: number) => {
      props.pageList.page = page
      parentTestFun(page)
    }
    return () => (
      <UPagination
        v-model:page={props.pageList.page}
        itemCount={props.pageList.total}
        v-model:pageSize={props.pageList.pageSize}
        on-update:page={updatePages}
      />
    )
  }
})

export default MPagination
