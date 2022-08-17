import { message, UTooltip, UUpload, UUploadDragger } from '@comunion/components'
import { QuestionCircleOutlined, RefreshOutlined, UploadFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'

import image from './image.png'
import './rect.css'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true
    },
    tip: {
      type: Function,
      required: true
    },
    accept: {
      type: String,
      default: () => ''
    },
    fileSize: {
      type: Number,
      default: () => 0
    }
  },
  setup() {
    const uploaded = ref<boolean>(true)
    return {
      uploaded
    }
  },
  render() {
    const handleBeforeUpload = (data: any): any => {
      if (this.fileSize === 0) {
        return
      }
      const { file } = data
      if (file.file.size > this.fileSize) {
        message.warning('The image max size is 10MB')
        return false
      }
    }
    return (
      <div>
        <UUpload onBeforeUpload={handleBeforeUpload} class="rect-upload" accept={this.accept}>
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
          {this.text}
          <UTooltip trigger="hover">
            {{
              trigger: () => <QuestionCircleOutlined class="text-grey3 w-4 h-4 ml-2" />,
              default: this.tip()
            }}
          </UTooltip>
        </p>
      </div>
    )
  }
})
