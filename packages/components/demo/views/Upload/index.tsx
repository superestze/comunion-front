import { defineComponent, ref } from 'vue'
import { UButton, UUpload } from '@/comps/index'

const UploadDemoPage = defineComponent({
  name: 'UploadDemoPage',
  setup() {
    const fileList = ref([
      {
        id: 'razars',
        name: '刀',
        status: 'finished',
        percentage: 100
      }
    ] as const)
    return () => (
      <UUpload
        abstract
        defaultFileList={fileList.value}
        action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
      >
        <UButton>点我</UButton>
      </UUpload>
    )
  }
})

export default UploadDemoPage