import { NPagination } from 'naive-ui'
import type { PaginationProps } from 'naive-ui'
import type { SetupContext } from 'vue'
import './index.css'

export type UPaginationProps = PaginationProps

const UPagination = (props: UPaginationProps, { slots }: SetupContext) => {
  return (
    <NPagination class="u-pagination" {...props}>
      {slots.default?.()}
    </NPagination>
  )
}

export default UPagination
