import { UTabs, UTabPane } from '@/comps/index'
import { defineComponent, ref } from 'vue'

const TabsDemoPage = defineComponent({
  name: 'TabsDemoPage',
  setup() {
    const cur = ref('a')
    return () => (
      <UTabs v-model:value={cur.value}>
        <UTabPane name="A" tab="a">
          A content
        </UTabPane>
        <UTabPane name="B" tab="b">
          B content
        </UTabPane>
        <UTabPane name="C" tab="c">
          C content
        </UTabPane>
      </UTabs>
    )
  }
})

export default TabsDemoPage
