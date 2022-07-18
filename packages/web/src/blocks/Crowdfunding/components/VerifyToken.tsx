import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { SelectOption } from '@comunion/components/src/constants'
import { defineComponent, ref, computed, Ref, PropType, h } from 'vue'
import { CrowdfundingInfo } from '../typing'
import { useErc20Contract } from '@/contracts'
import { services } from '@/services'
import { useUserStore } from '@/stores'

export interface BountyBasicInfoRef {
  bountyDetailForm: FormInst | null
}

export const VerifyToken = defineComponent({
  name: 'VerifyToken',
  props: {
    crowdfundingInfo: {
      type: Object as PropType<CrowdfundingInfo>,
      required: true
    }
  },
  setup(props) {
    const usdcTokenContract = useErc20Contract()
    const verifyTokenForm = ref<FormInst | null>(null)
    const startupOptions = ref<SelectOption[]>([])
    const userStore = useUserStore()
    const verifyTokenFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'select',
        title: 'Startup',
        name: 'startupId',
        placeholder: 'Select a startup',
        rules: [
          { required: true, message: ' Please select a startup', type: 'number', trigger: 'blur' }
        ],
        options: startupOptions.value
      },
      {
        t: 'string',
        title: 'Token Contract',
        name: 'sellTokenContract',
        rules: [
          { required: true, message: 'Token concract cannot be blank', trigger: 'blur' },
          {
            validator: (rule, value: string) => {
              return /^0x[a-zA-Z\d]{40}/.test(value) && value.length === 42
            },
            message: 'Invalid token contract',
            trigger: 'blur'
          },
          {
            validator: async (rule, value: string) => {
              const tokenContract = await usdcTokenContract(value) // construct erc20 contract
              console.log('tokenContract===>', tokenContract)
              try {
                props.crowdfundingInfo.sellTokenName = await tokenContract.name()
                props.crowdfundingInfo.sellTokenSymbol = await tokenContract.symbol()
                props.crowdfundingInfo.sellTokenDecimals = await tokenContract.decimals()
                props.crowdfundingInfo.sellTokenSupply = await tokenContract.totalSupply()
                return true
              } catch (error) {
                return false
              }
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
        class: props.crowdfundingInfo.sellTokenName ? '!grid-rows-[0,1fr]' : 'hidden',
        render(value) {
          return (
            <div class="grid grid-cols-[100px,2fr]">
              <div class="u-body1 text-grey3 mb-6">Name:</div>
              <div>{props.crowdfundingInfo.sellTokenName}</div>
              <div class="u-body1 text-grey3 mb-6">Symbol:</div>
              <div>{props.crowdfundingInfo.sellTokenSymbol}</div>
              <div class="u-body1 text-grey3">Decimals:</div>
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
        slots: {
          label: () => [
            h(
              <div>
                Team Wallet Address
                <span class="n-form-item-label__asterisk">&nbsp;*</span>
                <span class="text-xs text-grey4 ml-4">
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

    const getStartupByComerId = async () => {
      const comerID = userStore.profile?.comerID

      try {
        const { error, data } = await services['bounty@bounty-startups']({
          comerID
        })
        if (!error) {
          startupOptions.value = (data.list || []).map(startup => ({
            label: startup.name!,
            value: startup.startupID!
          }))
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    const verifyTokenFieldsRules = getFieldsRules(verifyTokenFields.value)
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
