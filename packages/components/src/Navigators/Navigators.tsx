import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { Navigators } from '../../src'

export default defineComponent({
  name: 'Navigators',
  props: {
    list: {
      type: Array as PropType<Navigator[]>
    }
  },
  setup() {
    return () => (
      <Navigators title="Components">
        <Navigators.Item route={{}}></Navigators.Item>
      </Navigators>
    )
  }
})
