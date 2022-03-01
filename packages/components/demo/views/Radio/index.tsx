import { URadio, URadioGroup } from '@/comps/URadio'
import { defineComponent, ref } from 'vue'

const RadioDemoPage = defineComponent({
  name: 'RadioDemoPage',
  setup() {
    const v = ref(1)
    return () => (
      <>
        <URadioGroup v-model:value={v.value}>
          <URadio value={1}>1</URadio>
          <URadio value={2}>2</URadio>
        </URadioGroup>
      </>
    )
  }
})

export default RadioDemoPage
