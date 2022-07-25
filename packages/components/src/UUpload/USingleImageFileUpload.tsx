import {
  UploadFilled,
  PosterFilled,
  CloseOutlined,
  RefreshOutlined,
  DeleteFilled
} from '@comunion/icons'
import { sizeFormat } from '@comunion/utils'
import { NUpload, NProgress } from 'naive-ui'
import { CustomRequest, OnBeforeUpload, FileInfo } from 'naive-ui/lib/upload/src/interface'
export type { FileInfo } from 'naive-ui/lib/upload/src/interface'
import { defineComponent, computed, ref, PropType } from 'vue'
import { useUpload } from './UUploadProvider'

export const USingleImageFileUpload = defineComponent({
  name: 'USingleImageFileUpload',
  props: {
    placeholder: {
      type: String
    },
    value: {
      type: Object as PropType<FileInfo>
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    sizeLimit: {
      type: Number,
      required: false,
      default: 1024 * 1024 * 10
    },
    aspectRatio: {
      type: Number
    }
  },
  emits: ['update:value'],
  setup(props, ctx) {
    const uploadRef = ref()
    const { onUpload } = useUpload()
    const status = ref<FileInfo['status']>()
    const process = ref(100)
    const checkImageWH = (file: File) => {
      // 参数分别是上传的file，想要限制的宽，想要限制的高
      return new Promise(function (resolve, reject) {
        const fileReader = new FileReader()
        fileReader.onload = (e: any) => {
          const src = e.target.result
          const image = new Image()
          image.onload = function () {
            const isValid = (this as any).width / (this as any).height === props.aspectRatio
            isValid ? resolve(true) : reject(new Error('Image ratio is invalid'))
          }
          image.onerror = reject
          image.src = src
        }
        fileReader.readAsDataURL(file)
      })
    }
    const EmptyStatus = computed(() => () => (
      <div class="rounded-lg border border-grey5 h-12 px-4 flex items-center cursor-pointer">
        <UploadFilled class="mr-3.5" />
        <span class="text-grey1">{props.placeholder}</span>
      </div>
    ))
    {
      /* Process status */
    }
    const ProcessStatus = computed(() => () => (
      <div class="flex flex-col justify-center rounded-lg border border-grey5 h-12 px-4 relative">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <PosterFilled class="mr-3.5 text-primary" />
            <span>{props.value?.name}</span>
          </div>
          <CloseOutlined class="text-grey4 cursor-pointer" onClick={delImage} />
        </div>
        <div class="absolute" style={{ bottom: '2px', left: '48px', right: '48px' }}>
          <NProgress
            status="success"
            type="line"
            height={2}
            percentage={process.value}
            showIndicator={false}
          />
        </div>
      </div>
    ))
    {
      /* Failed status */
    }
    const FailedStatus = computed(() => () => (
      <div class="rounded-lg border border-grey5 h-12 px-4 flex justify-between items-center text-error">
        <div class="flex items-center">
          <PosterFilled class="mr-3.5" />
          <span>{props.value?.name}</span>
        </div>
        <div class="flex items-center">
          <CloseOutlined class="cursor-pointer" onClick={delImage} />
          <RefreshOutlined class="ml-4 cursor-pointer" onClick={() => uploadRef.value?.submit()} />
        </div>
      </div>
    ))
    {
      /* Success status */
    }
    const SuccessStatus = computed(() => () => (
      <div class="rounded-lg border border-grey5 h-12 px-4 flex items-center justify-between">
        <div class="flex items-center">
          {/* <ULazyImage src={props.value!.url!} /> */}
          <PosterFilled class="mr-3.5 text-primary" />
          <span>{props.value?.name}</span>
        </div>
        <DeleteFilled class="text-grey4 cursor-pointer" onClick={delImage} />
      </div>
    ))

    const delImage = (e: Event) => {
      e.stopPropagation()
      status.value = undefined
      ctx.emit('update:value', undefined)
    }

    const onBeforeUpload: OnBeforeUpload = ({ file }) => {
      if (file.file && props.sizeLimit) {
        if (file.file?.size > props.sizeLimit) {
          return Promise.reject(
            new Error(`File should not large than ${sizeFormat(props.sizeLimit)}`)
          )
        }
      }
      if (file.file && props.aspectRatio) {
        return checkImageWH(file.file)
      }
      return Promise.resolve()
    }

    const customRequest: CustomRequest = async ({ file, onProgress, onFinish, onError }) => {
      if (file.file) {
        process.value = 0

        ctx.emit('update:value', file)
        onUpload(file.file, percent => {
          status.value = 'uploading'
          process.value = percent * 100
          onProgress({ percent })
        })
          .then(url => {
            console.log('url==>', url)
            if (!url) {
              throw new Error()
            }
            status.value = 'finished'
            process.value = 100
            ctx.emit('update:value', { ...file, url })
            onFinish()
          })
          .catch(err => {
            console.log('err==>', err)

            status.value = 'error'
            process.value = 100
            ctx.emit('update:value', file)
            console.error(err)
            onError()
          })
      }
    }

    const Content = computed(() => {
      if (status.value) {
        switch (status.value) {
          case 'finished':
            return SuccessStatus.value
          case 'uploading':
            return ProcessStatus.value
          case 'error':
            return FailedStatus.value
          default:
            return EmptyStatus.value
        }
      } else {
        return EmptyStatus.value
      }
    })

    return () => (
      <NUpload
        ref={uploadRef}
        showFileList={false}
        accept={props.accept}
        onBeforeUpload={onBeforeUpload}
        customRequest={customRequest}
        triggerStyle={{ width: '100%' }}
      >
        <Content.value />
      </NUpload>
    )
  }
})
