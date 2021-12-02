import { defineComponent, ref } from 'vue'
import { Button } from '@comunion/components'

const ButtonDemoPage = defineComponent({
  name: 'ButtonDemoPage',
  setup() {
    const count = ref(0)
    const handleClick = () => {
      count.value++
    }
    return () => <Button onClick={handleClick}>Hello {count.value}</Button>
  }
})

export default ButtonDemoPage
