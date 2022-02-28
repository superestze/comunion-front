import UUpload from '@/comps/UUpload'
import { defineComponent } from 'vue'

const UploadDemoPage = defineComponent({
  name: 'UploadDemoPage',
  setup() {
    return () => <UUpload />
  }
})

export default UploadDemoPage
