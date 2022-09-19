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
  UImage
} from '@comunion/components'
import { CloseOutlined, PlusOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
// import { utils } from 'ethers'
import { defineComponent, PropType, reactive, ref, onMounted, h } from 'vue'
import { allNetworks } from '@/constants'
// import { useErc20Contract } from '@/contracts'
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
    console.log(props.startup)
    const dateToISO = (dataTime: string | null | number) => {
      return dayjs(dataTime).format('YYYY-MM-DD')
    }
    const dateList = ref({
      launchDate: props.startup?.launchDate || '',
      presaleStart: props.startup!.presaleStart || '',
      presaleEnd: props.startup!.presaleEnd || '',
      allNetworksList: allNetworks
    })
    const defaultModel = {
      presaleDate: dateList.value.presaleStart
        ? ref<number | [number, number] | null>([
            new Date(dateList.value.presaleStart).getTime(),
            new Date(dateList.value.presaleEnd).getTime()
          ])
        : null,
      launchDate: new Date(dateList.value.launchDate).getTime() || null,
      contract: props.startup!.tokenContractAddress || '',
      network: Number(props.startup!.launchNetwork) || null,
      tokenName: props.startup!.tokenName,
      tokenSymbol: props.startup!.tokenSymbol,
      totalSupply: props.startup!.totalSupply,
      composes:
        props.startup.wallets?.length > 0
          ? props.startup.wallets.map(w => ({
              walletName: w.walletName,
              walletAddress: w.walletAddress,
              id: w.id
            }))
          : [
              {
                walletName: '',
                walletAddress: '',
                id: 0
              }
            ]
    }
    // const erc20ContractFactory = useErc20Contract()

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

    // async function onTokenContractChange(addr: string) {
    //   const contract = erc20ContractFactory(addr)
    //   // await contract.deployTransaction.wait()
    //   tokenInfo.name = await contract.name()
    //   tokenInfo.symbol = await contract.symbol()
    //   tokenInfo.supply = +utils.formatUnits(await contract.totalSupply(), 18)
    // }

    onMounted(() => {
      // onTokenContractChange(defaultModel.contract)
    })

    function addCompose() {
      model.composes.push({
        walletName: '',
        walletAddress: '',
        id: 0
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
            try {
              const { error } = await services['startup@startup-finance-setting-update']({
                startupId: props.startup!.id,
                tokenContractAddress: model.contract,
                launchNetwork: Number(model.network),
                presaleStart: String(dateList.value.presaleStart),
                presaleEnd: String(dateList.value.presaleEnd),
                launchDate: dateToISO(model.launchDate),
                wallets: model.composes,
                tokenName: model.tokenName,
                tokenSymbol: model.tokenSymbol,
                totalSupply: Number(model.totalSupply)
              })
              if (!error) {
                console.log(error)
              }
              // message.success(
              //   'Success send transaction to the chain, please wait for the confirmation'
              // )
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
    function presaleDateChange(val: any) {
      console.log(val)
      if (val) {
        dateList.value.presaleStart = String(dateToISO(val[0]))
        dateList.value.presaleEnd = String(dateToISO(val[1]))
      } else {
        dateList.value.presaleStart = ''
        dateList.value.presaleEnd = ''
      }
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
        <p class="mb-7 text-[#3F2D99] uppercase u-card-title1">FINANCE SETTING</p>
        <ul class="border rounded-sm list-disc border-color-border mb-6 p-4 pl-8 text-body1 relative u-body1">
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
              // options={networkDateList}
              placeholder="Select your launch network"
              clearable
              renderLabel={(option: any) => {
                return [
                  h(<UImage src={option.logo} class="h-5 mr-2 w-5 inline float-left" />),
                  option.label as string
                ]
              }}
              options={dateList.value.allNetworksList.map(item => ({
                label: item.name,
                value: item.chainId,
                logo: item.logo
              }))}
            />
          </div>
        </UFormItem>
        <UFormItem label="Token Name" label-style={divStyle}>
          <div class="w-full">
            <UInput
              v-model:value={model.tokenName}
              placeholder="Please enter your Token Name"
              maxlength={50}
            />
          </div>
        </UFormItem>
        <UFormItem label="Token Symbol" label-style={divStyle}>
          <div class="w-full">
            <UInput
              v-model:value={model.tokenSymbol}
              placeholder="Please enter your Token Symbol"
              maxlength={10}
            />
          </div>
        </UFormItem>
        <UFormItem label="Token Supply" label-style={divStyle}>
          <div class="w-full">
            <UInput
              v-model:value={model.totalSupply}
              placeholder="Please enter your Token Supply"
              onInput={value => {
                model.totalSupply = Number(value.replace(/[^\d]/g, ''))
              }}
            />
          </div>
        </UFormItem>
        <UFormItem label="Token Contract" label-style={divStyle}>
          <UAddressInput
            placeholder="Please enter your token contract address"
            v-model:value={model.contract}
          />
        </UFormItem>
        {/* onChange={onTokenContractChange} */}
        <UFormItem label="Presale" label-style={divStyle}>
          <div class="w-full">
            <UDatePicker
              v-model:value={model.presaleDate}
              type="daterange"
              clearable
              startPlaceholder="yy-mm-dd (UTC time zone)"
              endPlaceholder="yy-mm-dd (UTC time zone)"
              onChange={presaleDateChange}
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
