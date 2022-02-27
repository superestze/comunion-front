import type { GridItemProps } from 'naive-ui'
import { NGridItem } from 'naive-ui'
import { defineComponent } from 'vue'
export type UGridItemProps = GridItemProps

const UGridItem = defineComponent<UGridItemProps>({
  name: 'UGridItem',
  setup(props) {
    return () => {
      return <NGridItem {...props} />
    }
  }
})

export default UGridItem
