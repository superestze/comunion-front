import { NTabPane } from 'naive-ui'
import { defineComponent } from 'vue'

const UTabsPane = defineComponent({
  name: 'UTabsPane',
  extends: NTabPane,
  setup(props, ctx) {
    return () => <NTabPane {...props}>{ctx.slots.default?.()}</NTabPane>
  }
})

export default UTabsPane
