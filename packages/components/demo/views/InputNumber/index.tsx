import UInputNumber from '@/comps/UInputNumber'
import { defineComponent, ref } from 'vue'

const InputNumberDemoPage = defineComponent({
  name: 'InputNumberDemoPage',
  setup() {
    const v = ref(1)
    return () => (
      <>
        <UInputNumber v-model:value={v.value}>
          {{
            prefix: () => <span>$</span>,
            suffix: () => <span>%</span>
          }}
        </UInputNumber>
        {v.value}
      </>
    )
  }
})

export default InputNumberDemoPage
