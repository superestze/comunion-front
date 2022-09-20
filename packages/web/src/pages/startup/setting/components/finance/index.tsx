import {
  USpin,
  FormInst,
  FormItemRule,
  UAddressInput,
  UButton,
  UDatePicker,
  UForm,
  UFormItem,
  UImage,
  UInput,
  UInputGroup,
  USelect,
  message
} from '@comunion/components'
import { CloseOutlined, PlusOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, ref, h, reactive, PropType } from 'vue'
import { allNetworks } from '@/constants'
import { services } from '@/services'

type WalletsType = {
  walletName: string
  walletAddress: string
  id: number
}

type FinanceType = {
  launchDate: string
  presaleStart: string
  presaleEnd: string
  tokenContractAddress: string
  launchNetwork: number
  tokenName: string
  tokenSymbol: string
  totalSupply: number
  wallets: WalletsType[]
}

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<FinanceType>,
      required: true
    },
    startupId: {
      type: String
    }
  },
  emits: ['saved'],
  setup(props) {
    const loading = ref(false)

    const form = ref<FormInst>()
    const dateList = ref({
      launchDate: props.data?.launchDate || '',
      presaleStart: props.data!.presaleStart || '',
      presaleEnd: props.data!.presaleEnd || '',
      allNetworksList: allNetworks
    })
    const info = reactive({
      presaleDate: dateList.value.presaleStart
        ? ref<[number, number]>([
            new Date(dateList.value.presaleStart).getTime(),
            new Date(dateList.value.presaleEnd).getTime()
          ])
        : null,
      launchDate: new Date(dateList.value.launchDate).getTime() || null,
      contract: props.data!.tokenContractAddress || '',
      network: Number(props.data!.launchNetwork) || null,
      tokenName: props.data!.tokenName,
      tokenSymbol: props.data!.tokenSymbol,
      totalSupply: props.data!.totalSupply,
      composes:
        props.data.wallets?.length > 0
          ? props.data.wallets.map(w => ({
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
    })

    return {
      loading,
      form,
      info,
      dateList
    }
  },
  render() {
    const dateToISO = (dataTime: string | null | number) => {
      return dayjs(dataTime).format('YYYY-MM-DD')
    }
    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (!err) {
          // loading
          this.loading = true
          const params = {
            startupId: this.startupId,
            tokenContractAddress: this.info.contract,
            launchNetwork: this.info.network as number,
            tokenName: this.info.tokenName,
            tokenSymbol: this.info.tokenSymbol,
            totalSupply: this.info.totalSupply,
            presaleStart: this.info.presaleDate ? String(this.info.presaleDate[0]) : '',
            presaleEnd: this.info.presaleDate ? String(this.info.presaleDate[1]) : '',
            launchDate: this.info.launchDate ? String(this.info.launchDate) : '',
            wallets: this.info.composes
          }
          // console.log(params)
          await services['startup@startup-finance-setting-update'](params)
          this.loading = false
          message.success('Successfully saved')
          this.$emit('saved')
        }
      })
    }

    const rules: Record<string, FormItemRule[]> = {
      tokenContract: [{ required: true, message: 'Token contract is required', trigger: 'blur' }],
      composes: [{ required: true, type: 'array', min: 1 }]
    }

    const addCompose = () => {
      this.info.composes.push({
        walletName: '',
        walletAddress: '',
        id: 0
      })
    }

    const removeCompose = (index: number) => {
      this.info.composes.splice(index, 1)
    }

    const presaleDateChange = (val: any) => {
      if (val) {
        this.dateList.presaleStart = String(dateToISO(val[0]))
        this.dateList.presaleEnd = String(dateToISO(val[1]))
      } else {
        this.dateList.presaleStart = ''
        this.dateList.presaleEnd = ''
      }
    }

    return (
      <USpin show={this.loading}>
        <div class="bg-white border rounded-sm mb-6 min-h-200 p-10 relative overflow-hidden">
          <UForm ref={(ref: any) => (this.form = ref)} rules={rules} model={this.info}>
            <UFormItem label="Launch Network" required={true}>
              <div class="w-full">
                <USelect
                  v-model:value={this.info.network}
                  // options={networkDateList}
                  placeholder="Select your launch network"
                  clearable
                  renderLabel={(option: any) => {
                    return [
                      h(<UImage src={option.logo} class="h-5 mr-2 w-5 inline float-left" />),
                      option.label as string
                    ]
                  }}
                  options={this.dateList.allNetworksList.map(item => ({
                    label: item.name,
                    value: item.chainId,
                    logo: item.logo
                  }))}
                />
              </div>
            </UFormItem>
            <UFormItem label="Token Name">
              <div class="w-full">
                <UInput
                  v-model:value={this.info.tokenName}
                  placeholder="Please enter your Token Name"
                  maxlength={50}
                />
              </div>
            </UFormItem>
            <UFormItem label="Token Symbol">
              <div class="w-full">
                <UInput
                  v-model:value={this.info.tokenSymbol}
                  placeholder="Please enter your Token Symbol"
                  maxlength={10}
                />
              </div>
            </UFormItem>
            <UFormItem label="Token Supply">
              <div class="w-full">
                <UInput
                  v-model:value={this.info.totalSupply}
                  placeholder="Please enter your Token Supply"
                  onInput={value => {
                    this.info.totalSupply = Number(value.replace(/[^\d]/g, ''))
                  }}
                />
              </div>
            </UFormItem>
            <UFormItem label="Token Contract">
              <UAddressInput
                placeholder="Please enter your token contract address"
                v-model:value={this.info.contract}
              />
            </UFormItem>
            {/* onChange={onTokenContractChange} */}
            <UFormItem label="Presale">
              <div class="w-full">
                <UDatePicker
                  v-model:value={this.info.presaleDate}
                  type="daterange"
                  clearable
                  startPlaceholder="yy-mm-dd (UTC time zone)"
                  endPlaceholder="yy-mm-dd (UTC time zone)"
                  onChange={presaleDateChange}
                />
              </div>
            </UFormItem>
            <UFormItem label="Launch">
              <div class="w-full">
                <UDatePicker
                  v-model:value={this.info.launchDate}
                  type="date"
                  clearable
                  placeholder="yy-mm-dd (UTC time zone)"
                />
              </div>
            </UFormItem>
            <UFormItem label="Wallet">
              <div class="w-full">
                {this.info.composes.map((compose, index) => (
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
                    {this.info.composes.length > 1 && (
                      <CloseOutlined
                        class="cursor-pointer ml-4 text-color3 hover:text-primary"
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
              <UButton class="w-30" type="primary" size="small" onClick={handleSubmit}>
                Save
              </UButton>
            </div>
          </UForm>
        </div>
      </USpin>
    )
  }
})
