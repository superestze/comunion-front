import UCard from '@/comps/UCard'
import { defineComponent } from 'vue'

const CardDemoPage = defineComponent({
  name: 'CardDemoPage',
  setup() {
    return () => <UCard />
  }
})

export default CardDemoPage
