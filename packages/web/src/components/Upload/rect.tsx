import { message, UTooltip, UUpload, UUploadDragger } from '@comunion/components'
import { QuestionCircleOutlined, RefreshOutlined, UploadFilled } from '@comunion/icons'
import { CustomRequest } from 'naive-ui/lib/upload/src/interface'
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
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
    },
    imageUrl: {
      type: String
    },
    customRequest: {
      type: Function as PropType<CustomRequest>
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
        message.warning(`The image max size is ${Math.round(this.fileSize / 1024 / 1024)}M`)
        return false
      }
    }
    return (
      <div>
        <UUpload
          onBeforeUpload={handleBeforeUpload}
          class="rect-upload"
          accept={this.accept}
          customRequest={this.customRequest}
        >
          <UUploadDragger class="h-45 p-0 w-45 overflow-hidden">
            {this.uploaded ? (
              <div class="flex h-full w-full justify-center items-center relative">
                <div class="bg-[rgba(0,0,0,0.5)] opacity-0 top-0 right-0 bottom-0 left-0 z-2 absolute rect-upload-mask">
                  <RefreshOutlined class="h-10 -mt-5 text-white -ml-5 top-1/2 left-1/2 w-10 absolute" />
                </div>
                <img
                  src={this.imageUrl || image}
                  class="h-full object-cover w-full top-0 left-0 z-1 absolute"
                />
              </div>
            ) : (
              <div class="bg-purple flex h-full w-full justify-center items-center">
                <div class="flex flex-col items-center">
                  <UploadFilled class="h-10 text-primary w-10" />
                  <p class="mt-4 u-body2">Upload</p>
                </div>
              </div>
            )}
          </UUploadDragger>
        </UUpload>
        <p class="flex font-600 mt-2 text-14px text-grey1 w-45 items-center">
          {this.text}
          <UTooltip trigger="hover">
            {{
              trigger: () => <QuestionCircleOutlined class="h-4 ml-2 text-grey3 w-4" />,
              default: this.tip()
            }}
          </UTooltip>
        </p>
      </div>
    )
  }
})
