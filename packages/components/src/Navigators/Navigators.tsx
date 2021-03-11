import { defineComponent, PropType } from 'vue'
import { Navigators } from '../../src'

export default defineComponent({
  name: 'Navigators',
  props: {
    list: {
      type: Array as PropType<Navigator[]>,
    },
  },
  setup(props, ctx) {
    return () => (
      <Navigators title="Components">
        <Navigators.Item route={{}}></Navigators.Item>
      </Navigators>
    )
  },
})
