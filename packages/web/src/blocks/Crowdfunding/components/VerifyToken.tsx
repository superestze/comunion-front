import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { SelectOption } from '@comunion/components/src/constants'
import { ArrowLineRightOutlined } from '@comunion/icons'
import { defineComponent, ref, computed, Ref, PropType, h, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { CrowdfundingInfo } from '../typing'
import { useErc20Contract } from '@/contracts'
import { services } from '@/services'
export interface VerifyTokenRef {
  verifyTokenForm: FormInst | null
}

interface StartupOption extends SelectOption {
  tokenAddress?: string
  onChain: boolean
}

export const VerifyToken = defineComponent({
  name: 'VerifyToken',
  props: {
    crowdfundingInfo: {
      type: Object as PropType<CrowdfundingInfo>,
      required: true
    }
  },
  emits: ['closeDrawer'],
  setup(props, ctx) {
    const router = useRouter()
    const erc20TokenContract = useErc20Contract()
    const verifyTokenForm = ref<FormInst | null>(null)
    const startupOptions = ref<StartupOption[]>([])
    const tokenContractField = ref()
    const changeStartup = (value: number) => {
      const findRes = startupOptions.value.find(startup => startup.value === value)
      if (findRes) {
        props.crowdfundingInfo.startupName = findRes.label
        if (findRes.tokenAddress) {
          props.crowdfundingInfo.sellTokenContract = findRes.tokenAddress
          nextTick(() => {
            tokenContractField.value.validate()
          })
        }
      }
    }
    const resetSellToken = () => {
      props.crowdfundingInfo.sellTokenName = ''
      props.crowdfundingInfo.sellTokenSymbol = ''
      props.crowdfundingInfo.sellTokenDecimals = ''
    }
    const getContractInfo = async (value: string) => {
      const tokenContract = await erc20TokenContract(value) // construct erc20 contract
      try {
        const [name, symbol, decimals] = await Promise.all([
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.decimals()
        ])
        props.crowdfundingInfo.sellTokenName = name
        props.crowdfundingInfo.sellTokenSymbol = symbol
        props.crowdfundingInfo.sellTokenDecimals = decimals
        // props.crowdfundingInfo.sellTokenSupply = await tokenContract.totalSupply()
        return true
      } catch (error) {
        resetSellToken()
        return false
      }
    }
    const verifyTokenFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'select',
        title: 'Startup',
        name: 'startupId',
        placeholder: 'Select a startup',
        rules: [
          {
            required: true,
            message: ' Please select a startup',
            type: 'number',
            trigger: ['blur']
          },
          {
            validator: (rule, value) => {
              if (value) {
                let status = true
                startupOptions.value.forEach(item => {
                  if (item.value === value) {
                    status = item.onChain
                  }
                })
                return status
              }
              return true
            },
            renderMessage: () => {
              return (
                <div class="flex items-center">
                  <span>
                    The startup cannot create a crowdfunding without being on the blockchain,
                  </span>
                  <span
                    onClick={() => goSetting()}
                    class="cursor-pointer flex ml-2 items-center !text-primary"
                  >
                    <span>Go to setting</span>
                    <ArrowLineRightOutlined class="h-[16px] ml-2 w-[16px]" />
                  </span>
                </div>
              )
            },
            trigger: 'blur'
          }
        ],
        onUpdateValue: changeStartup,
        options: startupOptions.value
      },
      {
        t: 'string',
        title: 'Token Contract',
        name: 'sellTokenContract',
        formItemProps: {
          ref: (value: any) => (tokenContractField.value = value),
          first: true
        },
        rules: [
          { required: true, message: 'Token contract cannot be blank', trigger: 'blur' },
          {
            validator: (rule, value: string) => {
              if (/^0x[a-zA-Z\d]{40}/.test(value) && value.length === 42) {
                return true
              } else {
                resetSellToken()
                return false
              }
            },
            message: 'Invalid token contract',
            trigger: 'blur'
          },
          {
            asyncValidator: (rule, value: string, callback, source, options) => {
              return new Promise(() => {
                getContractInfo(value).then((isValid: boolean) => {
                  callback(isValid ? undefined : '')
                })
              })
            },
            message: 'The token may not be on the current blockchain network',
            trigger: 'blur'
          }
        ],
        placeholder: 'EX：0x1Ce3......cF0d',
        maxlength: 64
      },
      {
        t: 'custom',
        name: '',
        title: '',
        class:
          props.crowdfundingInfo.sellTokenContract && props.crowdfundingInfo.sellTokenName
            ? '!grid-rows-[0,1fr]'
            : 'hidden',
        render(value) {
          return (
            <div class="grid grid-cols-[100px,2fr]">
              <div class="mb-6 text-grey3 u-body2">Name:</div>
              <div>{props.crowdfundingInfo.sellTokenName}</div>
              <div class="mb-6 text-grey3 u-body2">Symbol:</div>
              <div>{props.crowdfundingInfo.sellTokenSymbol}</div>
              <div class="text-grey3 u-body2">Decimals:</div>
              <div>{props.crowdfundingInfo.sellTokenDecimals}</div>
            </div>
          )
        }
      },
      {
        t: 'string',
        title: '',
        name: 'teamWallet',
        required: false,
        formItemProps: {
          first: true
        },
        slots: {
          label: () => [
            h(
              <div>
                Team Wallet Address
                <span class="n-form-item-label__asterisk">&nbsp;*</span>
                <span class="font-normal text-xs ml-4 text-grey4">
                  Team wallet address used to receive funds raised
                </span>
              </div>
            )
          ]
        },
        rules: [
          {
            validator: (rule, value) => !!value,
            message: 'Team wallet address cannot be  blank',
            trigger: 'blur'
          },
          {
            validator: (rule, value: string) => {
              return /^0x[a-zA-Z\d]{40}/.test(value) && value.length === 42
            },
            message: 'Invalid team wallet address',
            trigger: 'blur'
          }
        ],
        placeholder: 'EX：0x1Ce3......cF0d',
        maxlength: 64
      }
    ])
    onMounted(() => {
      getStartups()
    })
    const getStartups = async () => {
      try {
        const { error, data } = await services['crowdfunding@crowdfundable-startups']()
        if (!error) {
          startupOptions.value = (data || []).map(startup => ({
            label: startup.startupName || '',
            value: startup.startupId || 0,
            disabled: !startup.canRaise,
            tokenAddress: startup.tokenContract,
            onChain: startup.onChain || false
          }))
        }
      } catch (error) {
        console.error('error', error)
      }
    }
    const goSetting = async () => {
      router.push({ path: `/startup/setting/${props.crowdfundingInfo.startupId}` })
      ctx.emit('closeDrawer')
    }
    const verifyTokenFieldsRules = getFieldsRules(verifyTokenFields.value)
    ctx.expose({
      verifyTokenForm
    })
    return {
      verifyTokenForm,
      verifyTokenFields,
      verifyTokenFieldsRules
    }
  },
  render() {
    return (
      <UForm
        ref={(ref: any) => (this.verifyTokenForm = ref)}
        rules={this.verifyTokenFieldsRules}
        model={this.crowdfundingInfo}
      >
        <UFormItemsFactory fields={this.verifyTokenFields} values={this.crowdfundingInfo} />
      </UForm>
    )
  }
})
