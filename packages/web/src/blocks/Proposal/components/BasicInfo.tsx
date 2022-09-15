import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { SelectOption } from '@comunion/components/src/constants'
import { ethers } from 'ethers'
import { computed, defineComponent, PropType, ref, Ref } from 'vue'
import { ProposalInfo } from '../typing'
import RichEditor from '@/components/Editor'
import { infuraKey } from '@/constants'
import { useErc20Contract } from '@/contracts'
import { services } from '@/services'
import { useWalletStore } from '@/stores'

export interface ProposalBasicInformationRef {
  proposalBasicInfoForm: FormInst | null
}

export const BasicInfo = defineComponent({
  name: 'BasicInfo',
  props: {
    startupOptions: {
      type: Array as PropType<SelectOption[]>,
      required: true
    },
    proposalInfo: {
      type: Object as PropType<ProposalInfo>,
      required: true
    }
  },
  setup(props, ctx) {
    const tokenContract = useErc20Contract()
    const walletStore = useWalletStore()
    const proposalBasicInfoForm = ref<FormInst | null>(null)

    const getVotePower = async (strategy: {
      chainId: number
      strategyName: string
      voteDecimals: number
      tokenContractAddress?: string
    }) => {
      switch (strategy?.strategyName) {
        case 'ticket': {
          return 1
        }
        case 'erc20-balance-of': {
          if (strategy.tokenContractAddress) {
            const userAddress = walletStore.address

            const rpcProvider = walletStore.getRpcProvider(strategy.chainId, infuraKey)
            const tokenRes = tokenContract(strategy.tokenContractAddress, rpcProvider)
            const userBalance = await tokenRes.balanceOf(userAddress)
            return ethers.utils.formatUnits(userBalance, strategy.voteDecimals)
          }
          return 0
        }
        default:
          return 0
      }
    }

    const formFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'select',
        title: 'Startup',
        name: 'startupId',
        placeholder: 'Please select a startup',
        rules: [
          { required: true, message: 'Startup cannot be blank', type: 'number', trigger: 'blur' },
          {
            asyncValidator: async (rule, value, callback) => {
              if (!value) return
              try {
                const { error, data } = await services['governance@get-startup-governace-setting']({
                  startupID: value
                })
                if (!error && data) {
                  const strategy = data.strategies?.[data.strategies?.length - 1]
                  const votePower = await getVotePower(strategy)
                  console.log('votePower===>', votePower)
                  if (votePower < data.proposalThreshold) {
                    callback(
                      `You need to have a minimum of ${data.proposalThreshold} ${data.voteSymbol} in order to submit a proposal.`
                    )
                    return
                  }
                }
                callback()
              } catch (error) {
                console.error('error==>', error)
                callback(error as Error)
              }
            },
            trigger: 'blur'
          }
        ],
        options: props.startupOptions
      },
      {
        t: 'string',
        title: 'Title',
        name: 'title',
        formItemProps: {
          first: true
        },
        rules: [
          { required: true, message: 'Title cannot be blank', trigger: 'blur' },
          {
            validator: (rule, value) => {
              return value.length >= 12
            },
            message: 'Title must be 12 characters or more',
            trigger: 'blur'
          }
        ],
        placeholder: 'Title',
        maxlength: 64
      },
      {
        t: 'custom',
        title: 'Description',
        name: 'description',
        formItemProps: {
          first: true
        },
        render() {
          return (
            <div class="h-60 w-full">
              <RichEditor
                limit={6400}
                placeholder="Describe what you proposal is about"
                class="w-full h-full"
                v-model:value={props.proposalInfo.description}
              />
            </div>
          )
        }
      },
      {
        t: 'string',
        title: 'Discussion',
        name: 'discussion',
        placeholder: 'https://',
        rules: [
          {
            validator: (rule, value) => !value || (value && value.startsWith('https://')),
            message: 'Invalid URL',
            trigger: 'blur'
          }
        ],
        maxlength: 200
      }
    ])
    const proposalBasicInfoRules = getFieldsRules(formFields.value)

    ctx.expose({
      proposalBasicInfoForm
    })
    return {
      formFields,
      proposalBasicInfoForm,
      proposalBasicInfoRules
    }
  },
  render() {
    return (
      <div>
        <UForm
          ref={(ref: any) => (this.proposalBasicInfoForm = ref)}
          rules={this.proposalBasicInfoRules}
          model={this.proposalInfo}
          // class="grid grid-cols-2 gap-x-10"
        >
          <UFormItemsFactory fields={this.formFields} values={this.proposalInfo} />
        </UForm>
      </div>
    )
  }
})
