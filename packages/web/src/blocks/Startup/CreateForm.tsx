import {
  FormInst,
  message,
  getFieldsRules,
  FormItemRule,
  UForm,
  UFormItemsFactory,
  UButton,
  FormFactoryField
} from '@comunion/components'
import { defineComponent, PropType, reactive, ref, CSSProperties, h } from 'vue'
import { STARTUP_TYPES } from '@/constants'
import { useStartupContract } from '@/contracts'
import { services } from '@/services'
import { useWalletStore, useChainStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
type chainSelectOption = {
  label: string
  logo: string
}
type modelType = {
  nextwork: number | undefined
  switch: boolean
  name: string
  type: number | undefined
  mission: string
  overview: string
  tags: Array<string>
}
const CreateStartupForm = defineComponent({
  name: 'CreateStartupForm',
  props: {
    onCancel: {
      type: Function as PropType<() => void>
    }
  },
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const chainStore = useChainStore()
    const contractStore = useContractStore()
    const supportedNetworks = reactive(chainStore.supportedNetworks)
    const defaultModel = {
      nextwork: undefined,
      // logo: '',
      switch: false,
      name: '',
      type: undefined,
      mission: '',
      overview: '',
      tags: []
      // tokenContract: '',
      // composes: [
      //   {
      //     name: '',
      //     address: ''
      //   }
      // ]
    }
    // const defaultTokenInfo = {
    //   name: '',
    //   symbol: '',
    //   supply: null as number | null,
    //   liquidity: null as number | null,
    //   txns: null as number | null,
    //   holders: null as number | null
    // }
    const formRef = ref<FormInst>()
    const loading = ref(false)
    const model = reactive<modelType>({
      ...{
        ...defaultModel
        // composes: [...defaultModel.composes]
      }
    })
    const startupContract = useStartupContract()
    // const tokenInfo = reactive({ ...defaultTokenInfo })

    // const erc20ContractFactory = useErc20Contract()

    // console.log('m', model, infoForm.items)

    // function addCompose() {
    //   model.composes.push({
    //     name: '',
    //     address: ''
    //   })
    // }

    // function removeCompose(index: number) {
    //   model.composes.splice(index, 1)
    // }

    // async function onTokenContractChange(addr: string) {
    //   const contract = erc20ContractFactory(addr)
    //   // await contract.deployTransaction.wait()
    //   tokenInfo.name = await contract.name()
    //   tokenInfo.symbol = await contract.symbol()
    //   tokenInfo.supply = +utils.formatUnits(await contract.totalSupply(), 18)
    // }

    function onCancel() {
      Object.assign(model, {
        ...{
          ...defaultModel
          // composes: [...defaultModel.composes]
        }
      })
      // Object.assign(tokenInfo, { ...defaultTokenInfo })
      props.onCancel?.()
    }

    function onSubmit() {
      formRef.value?.validate(async error => {
        if (!error) {
          loading.value = true
          try {
            const { data } = await services['startup@startup-name-is-exist']({
              name: model.name
            })
            if (!data || data.isExist) {
              message.error('Startup name already exists')
              throw new Error('Startup name already exists')
            }
            try {
              if (model.switch) {
                await startupContract.newStartup(
                  [
                    model.name,
                    model.type ? model.type : 0,
                    // model.tags,
                    // model.logo,
                    model.nextwork === undefined ? 0 : model.nextwork,
                    model.mission,
                    // model.tokenContract,
                    // model.composes.map(item => [item.name, item.address]),
                    model.overview,
                    true
                  ],
                  model,
                  'Waiting to submit all contents to blockchain for creating startup',
                  `Startup "${model.name}" is Creating`
                )
              } else {
                const res = await contractStore.createStartupSuccessAfter({
                  nextwork: model.nextwork === undefined ? 0 : model.nextwork,
                  switch: false,
                  name: model.name,
                  type: model.type ? model.type : 0,
                  mission: model.mission,
                  overview: model.overview,
                  tags: model.tags,
                  txHash: ''
                })
                if (!res?.data) {
                  throw new Error('fail')
                }
              }
              ctx.emit('success', model)
              message.success(
                'Success send transaction to the chain, please wait for the confirmation'
              )
              onCancel()
            } catch (error) {
              // message.error('Failed to create startup, please check your network and contract')
              // console.error(error)
              // message.error(error.message)
            }
          } catch (e) {
            ctx.emit('error', e)
          } finally {
            loading.value = false
          }
        }
      })
    }
    const netWorkChange = async (value: number) => {
      if (walletStore.chainId !== value) {
        await walletStore.ensureWalletConnected()
        const result = await walletStore.wallet?.switchNetwork(value)
        if (!result) {
          model.nextwork = walletStore.chainId
        }
      }
    }
    const infoFields: FormFactoryField[] = [
      // {
      //   t: 'singleImageUpload',
      //   title: '',
      //   name: 'logo',
      //   text: 'Update'
      // },
      {
        t: 'select',
        title: 'Blockchain Network',
        name: 'nextwork',
        placeholder: 'Select startup Blockchain Network',
        options: supportedNetworks.map(item => ({
          value: item.chainId,
          label: item.name,
          logo: item.logo
        })),
        // 5.9Incomplete function
        // startupID Determine whether the current network is consistent with the network of choice
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
        ]
      },
      {
        t: 'string',
        title: 'Name',
        name: 'name',
        placeholder: 'Input startup name',
        maxlength: 24,
        rules: [
          {
            required: true,
            validator: (rule, value) => !!value,
            message: 'Name cannot be blank',
            trigger: 'blur'
          },
          {
            validator: (rule, value) => !value || value.length > 3,
            message: 'Name must be 3 characters or more',
            trigger: 'blur'
          }
        ]
      },
      {
        t: 'switch',
        title: '',
        name: 'switch',
        disabled: false,
        defaultValue: false,
        railStyle: ({ focused, checked }: { focused: boolean; checked: boolean }) => {
          const style: CSSProperties = {}
          if (checked) {
            style.background = '#00BFA5'
          }
          return style
        }
      },
      {
        t: 'select',
        title: 'Type',
        name: 'type',
        placeholder: 'Select startup type',
        options: STARTUP_TYPES.map((item, index) => ({ label: item, value: index + 1 })),
        rules: [
          {
            required: true,
            validator: (rule, value) => {
              return !!value
            },
            message: 'Type cannot be blank',
            trigger: 'blur'
          }
        ]
      },
      {
        t: 'startupTags',
        required: true,
        title: 'Tag',
        name: 'tags',
        placeholder: 'Select startup tag'
      },
      // {
      //   t: 'hashInput',
      //   required: true,
      //   title: 'Hashtag',
      //   category: 'startup',
      //   name: 'tags',
      //   placeholder: '#Enter you startup tag'
      // },
      {
        t: 'string',
        title: 'Mission',
        name: 'mission',
        placeholder: 'Input startup mission',
        maxlength: 100,
        rules: [
          {
            required: true,
            validator: (rule, value) => !!value,
            message: 'Mission cannot be blank',
            trigger: 'blur'
          },
          {
            validator: (rule, value) => !value || value.length > 12,
            message: 'Mission must be 12 characters or more',
            trigger: 'blur'
          }
        ]
      },
      {
        t: 'string',
        title: 'Overview',
        name: 'overview',
        placeholder: 'Input overview for introducing your startup',
        type: 'textarea',
        maxlength: 1000,
        rules: [
          {
            required: true,
            validator: (rule, value) => !!value,
            message: 'Overview cannot be blank',
            trigger: 'blur'
          },
          {
            validator: (rule, value) => !value || value.length > 100,
            message: 'Overview must be 100 characters or more',
            trigger: 'blur'
          }
        ],
        autosize: {
          minRows: 5,
          maxRows: 5
        }
      }
    ]
    const infoRules = getFieldsRules(infoFields)
    const allRules: Record<string, FormItemRule[]> = {
      ...infoRules
      // tokenContract: [{ required: true, message: 'Token contract is required', trigger: 'blur' }],
      // composes: [{ required: true, type: 'array', min: 1 }]
    }
    return () => (
      <UForm ref={formRef} rules={allRules} model={model}>
        {/* <p class="mb-7 text-primary1 u-card-title1">INFO SETTING</p> */}
        <UFormItemsFactory fields={infoFields} values={model} />
        {/* <div class="bg-purple h-13px my-8"></div> */}
        {/* <p class="mb-7 uppercase u-card-title1">Finance Setting</p> */}
        {/* <ul class="border rounded-lg list-disc border-grey5 mb-6 p-4 pl-8 text-body1 relative">
          <li>Firstly, the token must be bound to the Start-Up as Proof-of-Stake.</li>
          <li>A token can only be bound to one Startup and can't be changed after bound.</li>
          <li>If you have not a token yet, use Erc20-Generator to create your token.</li>
          <div class="flex text-primary right-4 bottom-4 absolute items-center">
            How to Set
            <TipOutlined class="ml-1" />
          </div>
        </ul> */}
        {/* <UFormItem label="Token Contract" required path="tokenContract">
          <UAddressInput
            placeholder="Please enter your token contract address"
            v-model:value={model.tokenContract}
            onChange={onTokenContractChange}
          />
        </UFormItem> */}
        {/* <div class="border rounded-lg border-grey5 mb-2 grid py-4.5 px-4 text-body2 gap-x-2 gap-y-4 grid-cols-2">
          <div class="flex items-center">
            <span class="w-36">TOKEN NAME:</span>
            <span>{tokenInfo.name || '--'}</span>
          </div>
          <div class="flex items-center">
            <span class="w-36">Total Liquidity:</span>
            <span>{tokenInfo.liquidity || '--'}</span>
          </div>
          <div class="flex items-center">
            <span class="w-36">TOKEN SYMBOL:</span>
            <span>{tokenInfo.symbol || '--'}</span>
          </div>
          <div class="flex items-center">
            <span class="w-36">Total Txns:</span>
            <span>{tokenInfo.txns || '--'}</span>
          </div>
          <div class="flex items-center">
            <span class="w-36">TOTAL SUPPLY:</span>
            <span>{tokenInfo.supply || '--'}</span>
          </div>
          <div class="flex items-center">
            <span class="w-36">Holders:</span>
            <span>{tokenInfo.holders || '--'}</span>
          </div>
        </div> */}
        {/* <UFormItem label="Wallet Compose" required path="composes">
          <div class="w-full">
            {model.composes.map((compose, index) => (
              <div class="flex mb-6 w-full items-center">
                <UInputGroup key={index} class="flex w-full">
                  <UInput v-model:value={compose.name} class="!w-50" placeholder="Wallet name" />
                  <UAddressInput
                    v-model:value={compose.address}
                    class="flex-1"
                    placeholder="Please entre wallet address"
                  />
                </UInputGroup>
                {model.composes.length > 1 && (
                  <CloseOutlined
                    class="cursor-pointer ml-4 text-grey3 hover:text-primary"
                    onClick={() => removeCompose(index)}
                  />
                )}
              </div>
            ))}
          </div>
        </UFormItem> */}
        {/* <UButton text onClick={addCompose} type="primary">
          <PlusOutlined class="mr-2" />
          ADD ANOTHER WALLET
        </UButton> */}
        <div class="flex mt-10 items-center justify-end">
          <UButton type="default" size="large" class="mr-4 w-41" onClick={onCancel}>
            Cancel
          </UButton>
          <UButton
            type="primary"
            size="large"
            class="w-41"
            loading={loading.value}
            onClick={onSubmit}
          >
            Submit
          </UButton>
        </div>
      </UForm>
    )
  }
})

export default CreateStartupForm
