import {
  FormInst,
  FormItemRule,
  UForm,
  UFormItem,
  UAddressInput,
  UInputGroup,
  UInput,
  UButton,
  UDatePicker,
  USelect,
  UImage,
  message
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
    const dateToISO = (dataTime: string | null | number) => {
      return dayjs(dataTime).format('YYYY-MM-DD')
    }
    const dateList = ref({
      // presaleDate: props.startup?.presaleDate || [],
      presaleDate: props.startup?.presaleDate || '',
      launchDate: props.startup?.launchDate || '',
      presaleStartDate: null || 0,
      presaleEndDate: null || 0
    })
    const defaultModel = {
      presaleDate: new Date(dateList.value.presaleDate).getTime() || null,
      // presaleDate: Number([]),
      // presaleDate: ref<number | [number, number] | null>(null),
      launchDate: new Date(dateList.value.launchDate).getTime() || null,
      contract: props.startup!.tokenContractAddress || '',
      network: null,
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

    // function presaleDateChange1(val: any) {
    //   const date = []
    //   date[0] = new Date(val[0]).getTime()
    //   date[1] = new Date(val[1]).getTime()
    //   return date
    // }

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
      supply: null as number | null | string,
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
      // const date = [new Date('2021-10-2').getTime(), new Date('2021-10-2').getTime()]
      // defaultModel.presaleDate.value = date
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
    function presaleDateChange(val: any) {
      dateList.value.presaleStartDate = new Date(val[0]).getTime()
      dateList.value.presaleEndDate = new Date(val[1]).getTime()
    }

    const allRules: Record<string, FormItemRule[]> = {
      tokenContract: [{ required: true, message: 'Token contract is required', trigger: 'blur' }],
      composes: [{ required: true, type: 'array', min: 1 }]
    }

    const divStyle = {
      'font-weight': '600',
      'font-size': '16px'
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
        <UFormItem label="Launch Network" required={true} label-style={divStyle}>
          <div class="w-full">
            <USelect
              v-model:value={model.network}
              options={networkList.value}
              placeholder="Select your launch network"
              renderLabel={(option: any) => {
                return [
                  h(<UImage src={option.src} class="w-5 h-5 inline float-left mr-2" />),
                  option.label as string
                ]
              }}
            />
          </div>
        </UFormItem>
        <UFormItem label="Token Name" label-style={divStyle}>
          <div class="w-full">
            <UInput
              v-model:value={tokenInfo.name}
              placeholder="Please enter your Token Name"
              maxlength={50}
            />
          </div>
        </UFormItem>
        <UFormItem label="Token Symbol" label-style={divStyle}>
          <div class="w-full">
            <UInput
              v-model:value={tokenInfo.symbol}
              placeholder="Please enter your Token Symbol"
              maxlength={10}
            />
          </div>
        </UFormItem>
        <UFormItem label="Token Supply" label-style={divStyle}>
          <div class="w-full">
            <UInput
              v-model:value={tokenInfo.supply}
              placeholder="Please enter your Token Supply"
              onInput={value => {
                tokenInfo.supply = value.replace(/[^\d]/g, '')
              }}
            />
          </div>
        </UFormItem>
        <UFormItem label="Token Contract" label-style={divStyle}>
          <UAddressInput
            placeholder="Please enter your token contract address"
            v-model:value={model.contract}
            onChange={onTokenContractChange}
          />
        </UFormItem>
        <UFormItem label="Presale" label-style={divStyle}>
          <div class="w-full">
            <UDatePicker
              v-model:value={model.presaleDate}
              type="daterange"
              clearable
              startPlaceholder="yy-mm-dd (UTC time zone)"
              endPlaceholder="yy-mm-dd (UTC time zone)"
              onChange={presaleDateChange}
              update:value={presaleDateChange}
            />
          </div>
        </UFormItem>
        <UFormItem label="Launch" label-style={divStyle}>
          <div class="w-full">
            <UDatePicker
              v-model:value={model.launchDate}
              type="date"
              clearable
              placeholder="yy-mm-dd (UTC time zone)"
            />
          </div>
        </UFormItem>
        <UFormItem label="Wallet" label-style={divStyle}>
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
                    placeholder="Please enter wallet address"
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

export default EditStartupForm
