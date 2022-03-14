import { sizeFormat } from '@comunion/utils'
import { NImage, NProgress, NUpload } from 'naive-ui'
import { CustomRequest, OnBeforeUpload } from 'naive-ui/lib/upload/src/interface'
import { computed, defineComponent, ExtractPropTypes, ref } from 'vue'
import { useUpload } from './UUploadProvider'

export const USingleUploadProps = {
  value: {
    type: String
  },
  size: {
    type: Number,
    default: 72
  },
  text: {
    type: String,
    default: 'Select a file to upload'
  },
  accept: {
    type: String
  },
  sizeLimit: {
    type: Number,
    default: 1024 * 1024 * 10
  }
} as const

export type USingleUploadPropsType = ExtractPropTypes<typeof USingleUploadProps>

const USingleUpload = defineComponent({
  name: 'USingleUpload',
  props: USingleUploadProps,
  emits: ['update:value'],
  setup(props, ctx) {
    const { onUpload } = useUpload()
    const process = ref(100)
    const imgRef = ref()
    const sizeStyle = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`
    }))

    const onBeforeUpload: OnBeforeUpload = ({ file }) => {
      if (file.file && props.sizeLimit) {
        if (file.file?.size > props.sizeLimit) {
          return Promise.reject(
            new Error(`File should not large than ${sizeFormat(props.sizeLimit)}`)
          )
        }
      }
      return Promise.resolve()
    }

    const customRequest: CustomRequest = async ({ file, onProgress, onFinish, onError }) => {
      if (file.file) {
        process.value = 0
        onUpload(file.file, percent => {
          process.value = percent
          onProgress({ percent })
        })
          .then(url => {
            process.value = 100
            ctx.emit('update:value', url)
            onFinish()
          })
          .catch(err => {
            process.value = 100
            console.error(err)
            onError()
          })
      }
    }

    const preview = (e: Event) => {
      imgRef.value?.click()
      e.stopPropagation()
    }

    const remove = (e: Event) => {
      ctx.emit('update:value', '')
      e.stopPropagation()
    }

    return () => (
      <NUpload
        showFileList={false}
        accept={props.accept}
        onBeforeUpload={onBeforeUpload}
        customRequest={customRequest}
      >
        <div class="cursor-pointer inline-flex items-center relative overflow-hidden">
          {/* image wrapper */}
          <div class="rounded-full text-0px group overflow-hidden relative">
            {props.value && (
              <div
                class="flex flex-col bg-[rgba(0,0,0,0.3)] transform translate-y-full transition top-0 bottom-0 left-0 absolute items-center justify-center group-hover:translate-y-0"
                style={{
                  ...sizeStyle.value
                  // transform: `translateY(${props.size}px)`
                }}
              >
                {/* preview */}
                <svg
                  viewBox="0 0 24 24"
                  class="cursor-pointer mb-1 text-light-900 w-5 hover:text-white"
                  onClick={preview}
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="2"></circle>
                    <path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7"></path>
                  </g>
                </svg>
                {/* remove */}
                <svg
                  viewBox="0 0 24 24"
                  class="cursor-pointer mt-1 text-light-900 w-5 hover:text-white"
                  onClick={remove}
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M4 7h16"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"></path>
                    <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"></path>
                  </g>
                </svg>
              </div>
            )}
            {props.value ? (
              <NImage ref={imgRef} class="rounded-full" src={props.value} style={sizeStyle.value} />
            ) : (
              <div class="bg-purple rounded-full" style={sizeStyle.value} />
            )}
          </div>
          {process.value < 100 && (
            <NProgress
              class="-top-1 -left-1 absolute !h-20 !w-20"
              color="var(--u-primary-color)"
              railColor="transparent"
              strokeWidth={3}
              type="circle"
              percentage={process.value}
              showIndicator={false}
            />
          )}
          <span class="text-primary ml-5 u-title2">{props.text}</span>
        </div>
      </NUpload>
    )
  }
})

export default USingleUpload
