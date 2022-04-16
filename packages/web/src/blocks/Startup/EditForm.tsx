import {
  FormInst,
  message,
  getFieldsRules,
  FormItemRule,
  UForm,
  UFormItemsFactory,
  UFormItem,
  UAddressInput,
  UInputGroup,
  UInput,
  UButton
} from '@comunion/components'
import { TipOutlined, CloseOutlined, PlusOutlined } from '@comunion/icons'
import { utils } from 'ethers'
import { defineComponent, PropType, reactive, ref } from 'vue'
import { getStartupTypeFromNumber, STARTUP_TYPES, StartupTypesType } from '@/constants'
import { useStartupContract, useErc20Contract } from '@/contracts'
import { StartupItem } from '@/types'

const EditStartupForm = defineComponent({
  name: 'EditStartupForm',
  props: {
    onCancel: {
      type: Function as PropType<() => void>
    },
    startup: {
      type: Object as PropType<StartupItem>,
      required: true
    }
  },
  setup(props, ctx) {
    const defaultModel = {
      logo: props.startup!.logo || '',
      name: props.startup!.name || '',
      type: getStartupTypeFromNumber(props.startup!.mode) || '',
      tags: (props.startup!.hashTags || []).map(t => t.name) as string[],
      mission: props.startup!.mission || '',
      overview: props.startup!.overview || '',
      tokenContract: props.startup!.tokenContractAddress || '',
      composes:
        props.startup!.wallets?.length > 0
          ? props.startup!.wallets.map(w => ({ name: w.walletName, address: w.walletAddress }))
          : [
              {
                name: '',
                address: ''
              }
            ]
    }

    const defaultTokenInfo = {
      name: '',
      symbol: '',
      supply: null as number | null,
      liquidity: null as number | null,
      txns: null as number | null,
      holders: null as number | null
    }
    const formRef = ref<FormInst>()
    const loading = ref(false)
    const model = reactive({
      ...{
        ...defaultModel,
        composes: [...defaultModel.composes]
      }
    })
    const startupContract = useStartupContract()

    const tokenInfo = reactive({ ...defaultTokenInfo })

    const erc20ContractFactory = useErc20Contract()

    // console.log('m', model, infoForm.items)

    function addCompose() {
      model.composes.push({
        name: '',
        address: ''
      })
    }

    function removeCompose(index: number) {
      model.composes.splice(index, 1)
    }

    async function onTokenContractChange(addr: string) {
      const contract = erc20ContractFactory(addr)
      // await contract.deployTransaction.wait()
      tokenInfo.name = await contract.name()
      tokenInfo.symbol = await contract.symbol()
      tokenInfo.supply = +utils.formatUnits(await contract.totalSupply(), 18)
    }

    function onCancel() {
      Object.assign(model, {
        ...{
          ...defaultModel,
          composes: [...defaultModel.composes]
        }
      })
      Object.assign(tokenInfo, { ...defaultTokenInfo })
      props.onCancel?.()
    }

    function onSubmit() {
      formRef.value?.validate(async error => {
        if (!error) {
          loading.value = true
          try {
            try {
              await startupContract().newStartup([
                model.name,
                STARTUP_TYPES.indexOf(model.type as StartupTypesType),
                model.tags,
                model.logo,
                model.mission,
                model.tokenContract,
                model.composes.map(item => [item.name, item.address]),
                model.overview,
                true
              ])
              ctx.emit('success', model)
              message.success(
                'Success send transaction to the chain, please wait for the confirmation'
              )
              onCancel()
            } catch (error) {
              message.error('Failed to create startup, please check your network and contract')
              console.error(error)
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
    const infoFields = [
      {
        t: 'singleImageUpload',
        title: '',
        name: 'logo',
        text: 'Upload startup Logo'
      },
      {
        t: 'string',
        title: 'Name',
        name: 'name',
        required: true,
        placeholder: 'Please enter your startup name',
        maxlength: 24
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
        t: 'hashInput',
        required: true,
        title: 'Hashtag',
        category: 'startup',
        name: 'tags',
        placeholder: '#Enter you startup tag'
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
    ]
    const infoRules = getFieldsRules(infoFields)
    const allRules: Record<string, FormItemRule[]> = {
      ...infoRules,
      tokenContract: [{ required: true, message: 'Token contract is required', trigger: 'blur' }],
      composes: [{ required: true, type: 'array', min: 1 }]
    }

    return () => (
      <UForm ref={formRef} rules={allRules} model={model}>
        <p class="mb-7 u-card-title1">INFO SETTING</p>
        <UFormItemsFactory fields={infoFields} values={model} />
        <div class="bg-purple h-13px my-8"></div>
        <p class="mb-7 uppercase u-card-title1">Finance Setting</p>
        <ul class="border rounded-lg list-disc border-grey5 mb-6 p-4 pl-8 text-body1 relative">
          <li>Firstly，the token must be bound to the Start-Up as Proof-of-Stake.</li>
          <li>A token can only be bound to one Startup and can’t be changed after bound.</li>
          <li>If you have not a token yet， use Erc20-Generator to create your token.</li>
          <div class="flex text-primary right-4 bottom-4 absolute items-center">
            How to Set
            <TipOutlined class="ml-1" />
          </div>
        </ul>
        <UFormItem label="Token Contract" required path="tokenContract">
          <UAddressInput
            placeholder="Please enter your token contract address"
            v-model:value={model.tokenContract}
            onChange={onTokenContractChange}
          />
        </UFormItem>
        <div class="border rounded-lg border-grey5 mb-2 grid py-4.5 px-4 text-body2 gap-x-2 gap-y-4 grid-cols-2">
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
        </div>
        <UFormItem label="Wallet Compose" required path="composes">
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
        </UFormItem>
        <UButton text onClick={addCompose} type="primary">
          <PlusOutlined class="mr-2" />
          ADD ANOTHER WALLET
        </UButton>
        <div class="flex mt-16 items-center justify-end">
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

export default EditStartupForm
