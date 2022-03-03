import { USelect } from '@/comps/index'
import { defineComponent, ref } from 'vue'

const SelectDemoPage = defineComponent({
  name: 'SelectDemoPage',
  setup() {
    const v = ref(1)
    return () => (
      <USelect
        v-model:value={v.value}
        options={[
          { value: 1, label: '1' },
          { value: 2, label: '2' }
        ]}
      ></USelect>
    )
  }
})

export default SelectDemoPage
