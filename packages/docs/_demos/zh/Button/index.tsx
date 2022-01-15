import { defineComponent, ref } from 'vue'
import { UButton } from '@comunion/components'

const ButtonDemoPage = defineComponent({
  name: 'ButtonDemoPage',
  setup() {
    const count = ref(0)
    const handleClick = () => {
      count.value++
    }
    return () => (
      <>
        <UButton onClick={handleClick}>Hello {count.value}</UButton>
      </>
    )
  }
})

export default ButtonDemoPage
