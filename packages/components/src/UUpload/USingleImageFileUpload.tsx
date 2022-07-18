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
    }
  },
  emits: ['update:value'],
  setup(props, ctx) {
    const { onUpload } = useUpload()
    const status = ref<FileInfo['status']>()
    const process = ref(100)
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
          <div>
            <CloseOutlined class="text-grey4" />
          </div>
        </div>
        <div class="absolute inset-x-12 bottom-0.5">
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
        <div>
          <CloseOutlined />
          <RefreshOutlined />
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
        <div>
          <DeleteFilled class="text-grey4 cursor-pointer" onClick={delImage} />
        </div>
      </div>
    ))

    const delImage = () => {
      status.value = undefined
    }

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

        ctx.emit('update:value', file)
        onUpload(file.file, percent => {
          status.value = 'uploading'
          process.value = percent
          onProgress({ percent })
        })
          .then(url => {
            status.value = 'finished'
            process.value = 100
            ctx.emit('update:value', file)
            onFinish()
          })
          .catch(err => {
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
        showFileList={false}
        max={1}
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
