import type { GridProps } from 'naive-ui'
import { NGrid } from 'naive-ui'
import { defineComponent } from 'vue'
export type UGridProps = GridProps

const UGrid = defineComponent<UGridProps>({
  name: 'UGrid',
  setup(props) {
    return () => {
      return <NGrid {...props} />
    }
  }
})

export default UGrid
