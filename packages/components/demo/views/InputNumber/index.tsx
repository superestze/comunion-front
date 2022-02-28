import { NInputNumber } from 'naive-ui'
import { defineComponent, ref } from 'vue'

const InputNumberDemoPage = defineComponent({
  name: 'InputNumberDemoPage',
  setup() {
    const v = ref(1)
    return () => <NInputNumber v-model={v.value} />
  }
})

export default InputNumberDemoPage
