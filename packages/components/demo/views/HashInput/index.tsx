import { UHashInput } from '@/comps/UInput'
import { defineComponent, ref } from 'vue'

export const HashInputDemoPage = defineComponent({
  name: 'HashInputDemoPage',
  setup() {
    const value = ref([])

    return () => <UHashInput category="comerSkill" v-model={value.value} />
  }
})

export default HashInputDemoPage
