import { defineComponent, ref } from 'vue'
import { UHashInput } from '@/comps/UInput'

export const HashInputDemoPage = defineComponent({
  name: 'HashInputDemoPage',
  setup() {
    const value = ref([])

    return () => (
      <>
        {value.value.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
        <UHashInput category="comerSkill" v-model={value.value} />
      </>
    )
  }
})

export default HashInputDemoPage
