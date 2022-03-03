import { UTabs, UTabPane, UCard } from '@/comps/index'
import { defineComponent, ref } from 'vue'

const TabsDemoPage = defineComponent({
  name: 'TabsDemoPage',
  setup() {
    const cur = ref('a')
    return () => (
      <UCard>
        <UTabs v-model:value={cur.value}>
          <UTabPane name="a" tab="A">
            A content
          </UTabPane>
          <UTabPane name="b" tab="B">
            B content
          </UTabPane>
          <UTabPane name="c" tab="C">
            C content
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default TabsDemoPage
