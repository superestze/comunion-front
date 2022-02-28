import UImage from '@/comps/UImage'
import { defineComponent } from 'vue'

const ImageDemoPage = defineComponent({
  name: 'ImageDemoPage',
  setup() {
    return () => <UImage />
  }
})

export default ImageDemoPage
