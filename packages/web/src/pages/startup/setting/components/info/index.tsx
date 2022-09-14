import {
  USpin,
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory,
  useUpload,
  message
} from '@comunion/components'
import { CustomRequest } from 'naive-ui/lib/upload/src/interface'
import { defineComponent, ref, reactive, PropType, watch, CSSProperties, h, computed } from 'vue'
import { RectDraggerUpload } from '@/components/Upload'
import {
  getStartupTypeFromNumber,
  STARTUP_TYPES,
  ChainNetworkType,
  StartupTypesType,
  getStartupNumberFromType
} from '@/constants'
import { useStartupContract } from '@/contracts'
import { useChainStore, useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
type InfoPropType = {
  logo: string
  cover: string
  name: string
  mode: number
  mission: string
  overview: string
  blockChainAddress: string
  chainID: number | undefined
  hashTags: Array<string>
  isChain: boolean | undefined
}

type onlyType = {
  type: string
}

type InfoType = Omit<InfoPropType, 'mode' | 'blockChainAddress'> & onlyType
type chainSelectOption = {
  label: string
  logo: string
}
type fieldType = {
  options?: Array<{
    chainId?: number
    logo?: string
    name?: string
  }>
}
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<InfoPropType>,
      required: true
    },
    startupId: {
      type: String,
      defualt: ''
    }
  },
  setup(props) {
    const walletStore = useWalletStore()
    const chainStore = useChainStore()
    const contractStore = useContractStore()
    const loading = ref(false)
    const info = reactive<InfoType & { switchChain: boolean }>({
      logo: props.data.logo || '',
      cover: props.data.cover || '',
      name: props.data.name || '',
      type: getStartupTypeFromNumber(props.data.mode) || '',
      mission: props.data.mission || '',
      overview: props.data.overview || '',
      chainID: props.data.chainID,
      hashTags: props.data.hashTags,
      isChain: props.data.isChain,
      switchChain: false
    })
    const supportedNetworks = computed(() => {
      const data = chainStore.supportedNetworks
      return data
    })
    const netWorkChange = async (value: number) => {
      if (walletStore.chainId !== value && info.switchChain) {
        await walletStore.ensureWalletConnected()
        const result = await walletStore.wallet?.switchNetwork(value)
        if (!result) {
          info.switchChain = false
        }
      }
    }
    const switchChange = async (value: boolean) => {
      if (value) {
        netWorkChange(info.chainID!)
      }
    }
    const getNetWorkList = (supportedNetworks: Array<ChainNetworkType> = []) => {
      return supportedNetworks.map((item: ChainNetworkType) => ({
        value: item.chainId,
        label: item.name,
        logo: item.logo
      }))
    }
    const setFieldsStatus = (status = false) => {
      const stringArr = ['switchChain', 'chainID', 'name']
      fields.map(item => {
        if (stringArr.includes(item.name)) {
          item.disabled = status
        }
      })
    }
    watch(
      () => props.data,
      data => {
        info.logo = (data as InfoPropType).logo
        info.cover = (data as InfoPropType).cover
        info.name = (data as InfoPropType).name
        info.type = getStartupTypeFromNumber((data as InfoPropType).mode)
        info.mission = (data as InfoPropType).mission
        info.overview = (data as InfoPropType).overview
        info.chainID = (data as InfoPropType).chainID
        info.hashTags = (data as InfoPropType).hashTags
        info.isChain = (data as InfoPropType).isChain
        if (info.isChain) {
          info.switchChain = info.isChain
        }
        setFieldsStatus(info.isChain)
      }
    )
    watch(
      () => supportedNetworks.value,
      data => {
        ;(fields[0] as fieldType).options = getNetWorkList(data)
      }
    )
    const fields: FormFactoryField[] = reactive([
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
        name: 'chainID',
        placeholder: 'Select startup Blockchain Network',
        defaultValue: info.chainID,
        options: getNetWorkList(supportedNetworks.value),
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
        disabled: info.isChain
      },
      {
        t: 'string',
        title: 'Name',
        name: 'name',
        required: true,
        placeholder: 'Please enter your startup name',
        maxlength: 24,
        disabled: info.isChain
      },
      {
        t: 'switch',
        title: '',
        name: 'switchChain',
        railStyle: ({ focused, checked }: { focused: boolean; checked: boolean }) => {
          const style: CSSProperties = {}
          if (checked) {
            style.background = '#00BFA5'
          }
          return style
        },
        onUpdateValue: (value: boolean) => switchChange(value),
        disabled: info.isChain
      },
      {
        t: 'select',
        title: 'Type',
        name: 'type',
        required: true,
        placeholder: 'Startup type',
        options: STARTUP_TYPES.map(item => ({ label: item, value: item }))
      },
      {
        t: 'startupTags',
        required: true,
        title: 'Tag',
        name: 'hashTags',
        placeholder: 'Select startup tag'
      },
      {
        t: 'string',
        title: 'Mission',
        name: 'mission',
        placeholder: 'Please enter your startup mission',
        maxlength: 100,
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
        rules: [
          {
            required: true,
            message: 'Please enter a description of at least 100 letters'
          }
        ]
      }
    ])
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
      handleUploadCover,
      contractStore,
      setFieldsStatus
    }
  },
  render() {
    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (!err) {
          this.loading = true
          const startupContract = useStartupContract()
          try {
            const requestParams = {
              startupId: this.startupId === undefined ? '' : this.startupId,
              logo: this.info.logo,
              cover: this.info.cover,
              nextwork: this.info.chainID === undefined ? 0 : this.info.chainID,
              name: this.info.name,
              type:
                this.info.type === undefined
                  ? 0
                  : getStartupNumberFromType(this.info.type as StartupTypesType),
              mission: this.info.mission,
              overview: this.info.overview,
              txHash: '',
              switch: false,
              tags: this.info.hashTags,
              setting: true
            }
            if (!this.info.isChain && this.info.switchChain) {
              try {
                await startupContract.newStartup(
                  [
                    this.info.name,
                    this.info.type === undefined
                      ? 0
                      : getStartupNumberFromType(this.info.type as StartupTypesType),
                    this.info.chainID === undefined ? 0 : this.info.chainID,
                    this.info.mission,
                    this.info.overview,
                    true
                  ],
                  requestParams,
                  'Waiting to submit all contents to blockchain for creating startup',
                  `Startup "${this.info.name}" is Creating`
                )
                message.success('successfully saved')
              } catch (error) {
                this.info.switchChain = false
                this.info.isChain = false
                throw new Error('cancel to chain')
              }
              this.setFieldsStatus(true)
            } else {
              await this.contractStore.setStartupSuccessAfter(requestParams)
              message.success('successfully saved')
            }
          } catch (error) {
            console.error(error)
          }
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
