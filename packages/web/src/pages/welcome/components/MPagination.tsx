import { UPagination } from '@comunion/components/src'
import { defineComponent, PropType, inject, ref } from 'vue'

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
    const pageinationList = ref({
      page: props.pageList.page,
      total: props.pageList.total,
      pageSize: props.pageList.pageSize
    })
    const PARENT_PROVIDE = 'parentProvide'
    const parentTestFun = inject(`${PARENT_PROVIDE}/updatePage`)
    const updatePages = (page: number) => {
      pageinationList.value.page = page
      if (parentTestFun instanceof Function) parentTestFun(page)
    }
    return () => (
      <UPagination
        v-model:page={pageinationList.value.page}
        itemCount={pageinationList.value.total}
        v-model:pageSize={pageinationList.value.pageSize}
        on-update:page={updatePages}
      />
    )
  }
})

export default MPagination
