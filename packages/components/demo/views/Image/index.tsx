import { UImage } from '@/comps/index'
import { defineComponent } from 'vue'

const ImageDemoPage = defineComponent({
  name: 'ImageDemoPage',
  setup() {
    return () => (
      <UImage width={100} src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
    )
  }
})

export default ImageDemoPage
