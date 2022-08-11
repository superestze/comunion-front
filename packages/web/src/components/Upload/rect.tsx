import { UUpload, UUploadDragger } from '@comunion/components'
import { QuestionCircleOutlined, RefreshOutlined, UploadFilled } from '@comunion/icons'
import { defineComponent, ref, PropType } from 'vue'

import image from './image.png'

type TipType = {
  text: string
  tip: string
}

export default defineComponent({
  props: {
    tip: {
      type: Object as PropType<TipType>,
      required: true
    }
  },
  setup() {
    const uploaded = ref<boolean>(true)
    return {
      uploaded
    }
  },
  render() {
    return (
      <div>
        <UUpload>
          <UUploadDragger class="w-45 h-45 p-0 overflow-hidden">
            {this.uploaded ? (
              <div class="w-full h-full flex justify-center items-center relative">
                <div
                  class="absolute left-0 right-0 top-0 bottom-0 z-2"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <RefreshOutlined class="w-10 h-10 text-white absolute left-1/2 top-1/2 -ml-5 -mt-5" />
                </div>
                <img src={image} class="absolute left-0 right-0 top-0 bottom-0 z-1" />
              </div>
            ) : (
              <div class="w-full h-full bg-purple flex justify-center items-center">
                <div class="flex flex-col items-center">
                  <UploadFilled class="w-10 h-10 text-primary" />
                  <p class="u-body2 mt-4">Upload</p>
                </div>
              </div>
            )}
          </UUploadDragger>
        </UUpload>
        <p class="text-14px font-600 text-grey1 mt-2 flex items-center w-45">
          {this.tip.text}
          <QuestionCircleOutlined class="text-grey3 w-3 h-3 ml-2 mt-1px" />
        </p>
      </div>
    )
  }
})
