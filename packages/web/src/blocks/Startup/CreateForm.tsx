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
      nextwork: walletStore.chainId,
      // logo: '',
      switch: true,
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
                const res1 = await startupContract.newStartup(
                  [
                    model.name,
                    // model.type ? model.type : 0,
                    // model.tags,
                    // model.logo,
                    model.nextwork === undefined ? 0 : model.nextwork,
                    // model.mission,
                    // model.tokenContract,
                    // model.composes.map(item => [item.name, item.address]),
                    // model.overview,
                    true
                  ],
                  model,
                  'Waiting to submit all contents to blockchain for creating startup',
                  `Startup "${model.name}" is Creating`
                )
                if (!res1) {
                  throw new Error('fail')
                }
              } else {
                const res2 = await contractStore.createStartupSuccessAfter({
                  nextwork: model.nextwork === undefined ? 0 : model.nextwork,
                  switch: false,
                  name: model.name,
                  type: model.type ? model.type : 0,
                  mission: model.mission,
                  overview: model.overview,
                  tags: model.tags,
                  txHash: ''
                })
                if (!res2?.data) {
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
        defaultValue: walletStore.chainId,
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
        <UFormItemsFactory fields={infoFields} values={model} />

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
