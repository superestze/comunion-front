import { usePaginate } from '@comunion/hooks'
import { defineComponent, ExtractPropTypes, PropType } from 'vue'
import { UPagination } from '../UPagination'

type ServiceArgs = Parameters<typeof usePaginate>[0]

export const UPaginatedListProps = {
  service: {
    type: Function as PropType<ServiceArgs['service']>,
    required: true
  },
  defaultPageSize: {
    type: Number,
    default: 24
  },
  params: {
    type: Object as PropType<ServiceArgs['params']>
  }
  // onChange: {
  //   type: Function as PropType<(data: ReturnType<typeof usePaginate>['data']) => void>
  // }
} as const

export type UPaginatedListPropsType = ExtractPropTypes<typeof UPaginatedListProps>

const UPaginatedList = defineComponent({
  name: 'UPaginatedList',
  props: UPaginatedListProps,
  setup(props, ctx) {
    const { data } = usePaginate({
      service: props.service,
      pageSize: props.defaultPageSize,
      params: props.params
    })

    // watch([data], () => {
    //   props.onChange?.(data)
    // })

    return () => (
      <>
        {ctx.slots.default?.(data)}
        <div class="flex justify-center">
          <UPagination page={data.page} itemCount={data.total} pageSize={props.defaultPageSize} />
        </div>
      </>
    )
  }
})

export default UPaginatedList
