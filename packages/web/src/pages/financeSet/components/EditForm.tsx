import {
  FormInst,
  FormItemRule,
  message,
  UForm,
  UFormItem,
  UAddressInput,
  UInputGroup,
  UInput,
  UButton,
  UDatePicker,
  USelect,
  UImage
} from '@comunion/components'
import { CloseOutlined, PlusOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { utils } from 'ethers'
import { defineComponent, PropType, reactive, ref, onMounted, h } from 'vue'
import avalanche from '@/assets/avalanche.png'
import bsc from '@/assets/bsc.png'
import ethereum from '@/assets/ethereum-eth-logo.png'
import fantom from '@/assets/fantom.png'
import polygon from '@/assets/polygon.png'
import { useErc20Contract } from '@/contracts'
import { services } from '@/services'
import { StartupItem } from '@/types'
dayjs.extend(utc)

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
      presaleDate: props.startup?.presaleDate || null,
      launchDate: props.startup?.launchDate || null,
      contract: props.startup!.tokenContractAddress || '',
      network: 'Ethereum',
      composes:
        props.startup!.wallets?.length > 0
          ? props.startup!.wallets.map(w => ({
              walletName: w.walletName,
              walletAddress: w.walletAddress
            }))
          : [
              {
                walletName: '',
                walletAddress: ''
              }
            ]
    }
    const networkList = ref([
      {
        label: 'Ethereum',
        value: 'Ethereum',
        src: ethereum
      },
      {
        label: 'Avalanche',
        value: 'Avalanche',
        src: avalanche
      },
      {
        label: 'Fantom',
        value: 'Fantom',
        src: fantom
      },
      {
        label: 'BSC',
        value: 'BSC',
        src: bsc
      },
      {
        label: 'Polygon',
        value: 'Polygon',
        src: polygon
      }
    ])

    const erc20ContractFactory = useErc20Contract()

    const defaultTokenInfo = {
      name: '',
      symbol: '',
      supply: null as number | null,
      liquidity: null as number | null,
      txns: null as number | null,
      holders: null as number | null
    }
    const formRef = ref<FormInst>()
    const formLabel = ref<string>('font-size:16px;font-weight:600')
    const loading = ref(false)
    const model = reactive({
      ...{
        ...defaultModel,
        composes: [...defaultModel.composes]
      }
    })

    const dateToISO = (dataTime: string | null) => {
      return dayjs.utc(dataTime).format()
    }

    const tokenInfo = reactive({ ...defaultTokenInfo })

    async function onTokenContractChange(addr: string) {
      const contract = erc20ContractFactory(addr)
      // await contract.deployTransaction.wait()
      tokenInfo.name = await contract.name()
      tokenInfo.symbol = await contract.symbol()
      tokenInfo.supply = +utils.formatUnits(await contract.totalSupply(), 18)
    }
    onMounted(() => {
      onTokenContractChange(defaultModel.contract)
    })

    function addCompose() {
      model.composes.push({
        walletName: '',
        walletAddress: ''
      })
    }

    function removeCompose(index: number) {
      model.composes.splice(index, 1)
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
            const { data } = await services['startup@startup-finance-setting-update']({
              startupId: props.startup!.id,
              tokenContractAddress: props.startup!.tokenContractAddress,
              presaleDate: dateToISO(model.presaleDate),
              launchDate: dateToISO(model.launchDate),
              wallets: model.composes
            })
            if (data) {
              console.log(data)
            }
            message.success(
              'Success send transaction to the chain, please wait for the confirmation'
            )
            onCancel()
          } catch (e) {
            ctx.emit('error', e)
          } finally {
            loading.value = false
          }
        }
      })
    }
    const allRules: Record<string, FormItemRule[]> = {
      tokenContract: [{ required: true, message: 'Token contract is required', trigger: 'blur' }],
      composes: [{ required: true, type: 'array', min: 1 }]
    }
    return () => (
      <UForm ref={formRef} rules={allRules} model={model}>
        <p class="mb-7 uppercase u-card-title1 text-[#3F2D99]">FINANCE SETTING</p>
        <ul class="u-body1 border rounded-lg list-disc border-grey5 mb-6 p-4 pl-8 text-body1 relative">
          <li>First, shilling startup by filling token information</li>
          <li>
            If you have not a token yet， please contact comunion team help you to create your
            token.
          </li>
        </ul>
        <UFormItem label="Launch Network" required={true} labelStyle={formLabel.value}>
          <div class="w-full">
            <USelect
              v-model:value={model.network}
              options={networkList.value}
              renderLabel={(option: any) => {
                return [
                  h(<UImage src={option.src} class="w-5 h-5 inline float-left mr-2" />),
                  option.label as string
                ]
              }}
            />
          </div>
        </UFormItem>
        <UFormItem label="Token Name" labelStyle={formLabel.value} class="font-600">
          <div class="w-full">
            <UInput v-model:value={tokenInfo.name} placeholder="Please enter your Token Name" />
          </div>
        </UFormItem>
        <UFormItem label="Token Symbol" labelStyle={formLabel.value} class="font-600">
          <div class="w-full">
            <UInput v-model:value={tokenInfo.symbol} placeholder="Please enter your Token Symbol" />
          </div>
        </UFormItem>
        <UFormItem label="Token Supply" labelStyle={formLabel.value} class="font-600">
          <div class="w-full">
            <UInput v-model:value={tokenInfo.supply} placeholder="Please enter your Token Supply" />
          </div>
        </UFormItem>
        <UFormItem label="Token Contract" labelStyle={formLabel.value}>
          <UAddressInput
            placeholder="Please enter your token contract address"
            v-model:value={model.contract}
            onChange={onTokenContractChange}
          />
        </UFormItem>
        <UFormItem label="Presale date" labelStyle={formLabel.value}>
          <div class="w-full">
            <UDatePicker v-model:value={model.presaleDate} type="date" />
          </div>
        </UFormItem>
        <UFormItem label="Launch date" labelStyle={formLabel.value}>
          <div class="w-full">
            <UDatePicker v-model:value={model.launchDate} type="date" />
          </div>
        </UFormItem>
        <UFormItem label="Wallet" labelStyle={formLabel.value}>
          <div class="w-full">
            {model.composes.map((compose, index) => (
              <div class="flex mb-6 w-full items-center">
                <UInputGroup key={index} class="flex w-full">
                  <UInput
                    v-model:value={compose.walletName}
                    class="!w-50"
                    placeholder="Wallet name"
                  />
                  <UAddressInput
                    v-model:value={compose.walletAddress}
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
