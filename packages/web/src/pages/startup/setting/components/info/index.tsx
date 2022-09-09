import {
  USpin,
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory,
  useUpload
} from '@comunion/components'
import { CustomRequest } from 'naive-ui/lib/upload/src/interface'
import { defineComponent, ref, reactive, PropType, watch, CSSProperties, h } from 'vue'
import { RectDraggerUpload } from '@/components/Upload'
import { getStartupTypeFromNumber, STARTUP_TYPES, supportedNetworks } from '@/constants'
import { services } from '@/services'
type InfoPropType = {
  logo: string
  cover: string
  name: string
  mode: number
  mission: string
  overview: string
  blockChainAddress: string
  chainID: number | undefined
}

type onlyType = {
  type: string
}

type InfoType = Omit<InfoPropType, 'mode' | 'blockChainAddress'> & onlyType
type chainSelectOption = {
  label: string
  logo: string
}
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<InfoPropType>,
      required: true
    },
    startupId: {
      type: String
    }
  },
  setup(props) {
    const loading = ref(false)
    const info = reactive<InfoType>({
      logo: props.data.logo || '',
      cover: props.data.cover || '',
      name: props.data.name || '',
      type: getStartupTypeFromNumber(props.data.mode) || '',
      mission: props.data.mission || '',
      overview: props.data.overview || '',
      chainID: props.data.chainID
    })
    const netWorkChange = (value: number) => {
      console.log(value)
    }
    watch(
      () => props.data,
      data => {
        info.logo = data.logo
        info.cover = data.cover
        info.name = data.name
        info.type = getStartupTypeFromNumber(data.mode)
        info.mission = data.mission
        info.overview = data.overview
      }
    )

    // const walletStore = useWalletStore()
    const fields: FormFactoryField[] = [
      // {
      //   t: 'custom',
      //   title: 'BlockChainAddress',
      //   name: 'blockChainAddress',
      //   required: true,
      //   render: () => {
      //     return h(
      //       <UAddress
      //         autoSlice={true}
      //         blockchainExplorerUrl={walletStore.blockchainExplorerUrl}
      //         address={props.data.blockChainAddress}
      //       />,
      //       {}
      //     )
      //   }
      // },
      {
        t: 'select',
        title: 'Blockchain Network',
        name: 'Blockchain Network',
        placeholder: 'Select startup Blockchain Network',
        options: supportedNetworks.map(item => ({
          value: item.chainId,
          label: item.name,
          logo: item.logo
        })),
        // 5.9功能未完善
        // 获取startupID判断当下网络和选择网络是否一致
        onUpdateValue: (value: number) => netWorkChange(value),
        renderTag: ({ option }) => {
          return h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center'
              }
            },
            [
              h('img', {
                src: option.logo,
                round: true,
                size: 20,
                style: {
                  marginRight: '12px'
                }
              }),
              option.label as string
            ]
          )
        },
        renderLabel: (option: chainSelectOption) => {
          return h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center'
              }
            },
            [
              h('img', {
                src: option.logo,
                round: true,
                size: 20
              }),
              h(
                'div',
                {
                  style: {
                    marginLeft: '12px',
                    padding: '4px 0'
                  }
                },
                [
                  h('div', null, [option.label as string])
                  // h(
                  //   NText,
                  //   { depth: 3, tag: 'div' },
                  //   {
                  //     default: () => 'description'
                  //   }
                  // )
                ]
              )
            ]
          )
        },
        rules: [
          {
            required: true,
            validator: (rule, value) => !!value,
            message: 'Blockchain Network cannot be blank',
            trigger: 'blur'
          }
        ],
        defaultValue: info.chainID,
        disabled: true
      },
      {
        t: 'string',
        title: 'Name',
        name: 'name',
        required: true,
        placeholder: 'Please enter your startup name',
        maxlength: 24,
        disabled: true
      },
      {
        t: 'switch',
        title: '',
        name: 'switch',
        railStyle: ({ focused, checked }: { focused: boolean; checked: boolean }) => {
          const style: CSSProperties = {}
          if (checked) {
            style.background = '#00BFA5'
          }
          return style
        },
        disabled: true
      },
      {
        t: 'select',
        title: 'Type',
        name: 'type',
        required: true,
        placeholder: 'Startup type',
        options: STARTUP_TYPES.map(item => ({ label: item, value: item })),
        disabled: true
      },
      {
        t: 'startupTags',
        required: true,
        title: 'Tag',
        name: 'tags',
        placeholder: 'Select startup tag'
      },
      {
        t: 'string',
        title: 'Mission',
        name: 'mission',
        placeholder: 'Please enter your startup mission',
        maxlength: 100,
        disabled: true,
        required: true
      },
      {
        t: 'string',
        title: 'Overview',
        name: 'overview',
        placeholder: 'Describe your startup',
        minlength: 100,
        required: true,
        type: 'textarea',
        disabled: true,
        rules: [
          {
            required: true,
            message: 'Please enter a description of at least 100 letters'
          }
        ]
      }
    ]
    const form = ref<FormInst>()
    const { onUpload } = useUpload()
    const handleUploadLogo: CustomRequest = async ({ file, onProgress, onFinish, onError }) => {
      if (file.file) {
        onUpload(file.file, percent => {
          onProgress({ percent })
        })
          .then(url => {
            info.logo = url as string
            onFinish()
          })
          .catch(err => {
            onError()
          })
      }
    }

    const handleUploadCover: CustomRequest = async ({ file, onProgress, onFinish, onError }) => {
      if (file.file) {
        onUpload(file.file, percent => {
          onProgress({ percent })
        })
          .then(url => {
            info.cover = url as string
            onFinish()
          })
          .catch(err => {
            onError()
          })
      }
    }

    return {
      loading,
      form,
      fields,
      info,
      handleUploadLogo,
      handleUploadCover
    }
  },
  render() {
    /**
     * logo: props.data.logo || '',
      cover: props.data.cover || '',
      name: props.data.name || '',
      type: getStartupTypeFromNumber(props.data.mode) || '',
      mission: props.data.mission || '',
      overview: props.data.overview || ''
     *
     */
    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (!err) {
          this.loading = true
          await services['startup@startup-basic-setting-update-new']({
            startupId: this.startupId,
            logo: this.info.logo,
            cover: this.info.cover,
            name: this.info.name,
            mode: this.data.mode,
            mission: this.info.mission,
            overview: this.info.overview
          })
          this.loading = false
        }
      })
    }

    const rules = getFieldsRules(this.fields)
    return (
      <USpin show={this.loading}>
        <div class="bg-white border rounded-lg mb-6 min-h-205.5 relative overflow-hidden">
          <div class="my-9.5 mx-10">
            <div class="flex mb-14">
              <RectDraggerUpload
                text="Startup logo"
                tip={() => (
                  <p class="text-white text-center u-body2">
                    <p>Recommended：180px*180px</p>
                    <p>Max size：10MB</p>
                  </p>
                )}
                fileSize={10 * 1024 * 1024}
                accept="image/png, image/jpeg, image/bmp, image/psd, image/svg, image/tiff"
                imageUrl={this.info.logo}
                customRequest={this.handleUploadLogo}
              />
              <RectDraggerUpload
                class="ml-16"
                text="Startup Banner"
                tip={() => (
                  <p class="text-white text-center u-body2">
                    <p>Recommended：1380px*210px</p>
                    <p>Max size：10MB</p>
                  </p>
                )}
                fileSize={10 * 1024 * 1024}
                accept="image/png, image/jpeg, image/bmp, image/psd, image/svg, image/tiff"
                imageUrl={this.info.cover}
                customRequest={this.handleUploadCover}
              />
            </div>
            <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
              <UFormItemsFactory fields={this.fields} values={this.info} />
            </UForm>
            <div class="flex mt-10 items-center justify-end">
              <UButton class="w-30" type="primary" size="small" onClick={handleSubmit}>
                Save
              </UButton>
            </div>
          </div>
        </div>
      </USpin>
    )
  }
})
