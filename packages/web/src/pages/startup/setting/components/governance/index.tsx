import {
  message,
  UButton,
  UForm,
  UFormItem,
  UInput,
  UInputNumberGroup,
  UModal,
  USearch,
  USelect,
  USwitch,
  UTooltip
} from '@comunion/components'
import {
  AddCircleOutlined,
  CloseOutlined,
  DeleteFilled,
  MinusCircleOutlined,
  WarningFilled,
  ErrorTipFilled,
  QuestionFilled
} from '@comunion/icons'
import { defineComponent, reactive, ref, PropType, onMounted, computed } from 'vue'
import { StrategyType } from './typing.d'
import { allNetworks, infuraKey } from '@/constants'

import './style.css'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useWalletStore } from '@/stores'
import { StartupDetail } from '@/types'

export const renderUnit = (name: string) => (
  <div
    class={[
      'flex justify-center items-center border rounded-r-lg bg-white w-30',
      { 'text-grey1': name, 'text-grey4': !name }
    ]}
  >
    {name || 'Token'}
  </div>
)

export default defineComponent({
  name: 'StartupGovernance',
  props: {
    startupId: {
      type: String,
      required: true
    },
    startup: {
      type: Object as PropType<StartupDetail>,
      required: true
    }
  },
  setup(props) {
    const formRef = ref()
    const addStrategyBtnLoading = ref(false)
    const walletStore = useWalletStore()
    const tokenContract = useErc20Contract()
    const strategies = ref<ServiceReturn<'meta@dict-list-by-type'>>()

    const govSetting = reactive<{
      strategies: StrategyType[]
      voteDecimals: number
      voteSymbol: string
      allowMember: boolean
      proposalThreshold: number
      proposalValidity: number
      admins: string[]
    }>({
      strategies: [],
      voteDecimals: 0,
      voteSymbol: '',
      allowMember: true,
      proposalThreshold: 0,
      proposalValidity: 0,
      admins: []
    })
    //  ticket strategy
    const ticketStrategy = reactive({
      network: 1
    })
    const erc20BalanceStrategy = reactive({
      network: 1,
      contractAddress: '',
      symbol: ''
    })
    const strategyModal = ref()
    const erc20BalanceForm = ref()
    const contractAddressExist = ref(true)

    onMounted(() => {
      getStrategies()
      getGovernanceSetting()
    })

    const getStrategies = async () => {
      try {
        const { error, data } = await services['meta@dict-list-by-type']({
          type: 'governanceStrategy'
        })
        if (!error) {
          console.log('data===>', data)
          strategies.value = data
        }
      } catch (error) {
        console.error('error===>', error)
      }
    }

    const getGovernanceSetting = async () => {
      try {
        const { error, data } = await services['governance@get-startup-governace-setting']({
          startupID: props.startupId
        })
        if (!error) {
          govSetting.strategies = data.strategies.map(item => ({
            ...item,
            dictLabel: item.strategyName
          }))
          govSetting.voteSymbol = data.voteSymbol
          govSetting.allowMember = data.allowMember
          govSetting.proposalThreshold = Number(data.proposalThreshold)
          govSetting.proposalValidity = Number(data.proposalValidity)
          govSetting.admins = data.admins.length
            ? data.admins.map(item => item.walletAddress).concat([''])
            : ['', '']
        }
      } catch (error) {
        console.error('error==>', error)
      }
    }

    const addStrategy = () => {
      strategyModal.value = 'selectModal'
    }

    const delStrategy = (dictValue: string) => {
      const newStrategies = govSetting.strategies?.filter(stra => stra.dictValue !== dictValue)
      govSetting.strategies = newStrategies || []
    }

    const addErc20Strategy = async (strategy: StrategyType) => {
      erc20BalanceForm.value?.validate(async (error: any) => {
        console.log('error===>', error)
        console.log('strategy==>', strategy)
        if (!error) {
          addStrategyBtnLoading.value = true
          try {
            const { network, contractAddress, symbol } = erc20BalanceStrategy
            const provider = await walletStore.getRpcProvider(network, infuraKey)

            const code = await provider?.getCode(contractAddress)
            if (!code || code.length < 3) {
              contractAddressExist.value = false
              return
            }
            const erc20Token = tokenContract(contractAddress, provider)
            const decimal = await erc20Token.decimals()
            // govSetting.strategies?.push({ ...strategy, voteDecimals: decimal, symbol })
            govSetting.strategies = [{ ...strategy, voteDecimals: decimal, voteSymbol: symbol }]
            strategyModal.value = undefined
            addStrategyBtnLoading.value = false
          } catch (error) {
            contractAddressExist.value = false
            addStrategyBtnLoading.value = false
          }
        }
      })
    }

    const addTicketStrategy = async (strategy: StrategyType) => {
      // govSetting.strategies?.push(strategy)
      govSetting.strategies = [strategy]
      strategyModal.value = undefined
    }

    const saveGovSetting = async () => {
      try {
        formRef.value?.validate(async (error: Error) => {
          console.log('error===>', error)
          if (!govSetting.strategies?.length) return
          if (!error) {
            const strategies = govSetting.strategies?.map(strategy => ({
              strategyName: strategy.dictLabel,
              voteSymbol: strategy.voteSymbol,
              dictValue: strategy.dictValue,
              chainId: strategy.network,
              tokenContractAddress: strategy.contractAddress,
              voteDecimals: strategy.voteDecimals
            }))
            const { error } = await services['governance@create-governace-setting']({
              startupID: Number(props.startupId),
              voteSymbol: govSetting.voteSymbol,
              allowMember: govSetting.allowMember,
              proposalThreshold: Number(govSetting.proposalThreshold),
              proposalValidity: Number(govSetting.proposalValidity),
              strategies,
              admins: govSetting.admins.filter(Boolean).map(admin => ({ walletAddress: admin }))
            })
            if (!error) {
              message.success('successfully saved')
            }
          }
        })
      } catch (error) {
        console.error((error as Error).message)
      }
    }

    const addAdmin = () => {
      govSetting.admins.push('')
    }

    const delAdmin = (index: number) => {
      const newAdmins = govSetting.admins.filter((_, adminIndex) => adminIndex !== index)
      govSetting.admins = newAdmins
    }

    const networks = computed(() => {
      // const showChainId = [1, 43114 ]
      return allNetworks
    })

    const editStrategy = async (strategy: StrategyType) => {
      switch (strategy.dictValue) {
        case 'ticket': {
          ticketStrategy.network = strategy.network as number
          strategyModal.value = 'ticket'
          break
        }
        case 'erc20Balance': {
          erc20BalanceStrategy.network = strategy.chainId as number
          erc20BalanceStrategy.contractAddress = strategy.tokenContractAddress as string
          erc20BalanceStrategy.symbol = strategy.voteSymbol as string
          strategyModal.value = 'erc20-balance-of'
          break
        }
      }
    }

    return {
      govSetting,
      strategies,
      strategyModal,
      ticketStrategy,
      erc20BalanceStrategy,
      erc20BalanceForm,
      contractAddressExist,
      formRef,
      networks,
      addStrategyBtnLoading,
      addStrategy,
      editStrategy,
      delStrategy,
      addTicketStrategy,
      addErc20Strategy,
      saveGovSetting,
      addAdmin,
      delAdmin
    }
  },
  render() {
    return (
      <div>
        <UForm
          ref={(ref: any) => (this.formRef = ref)}
          model={this.govSetting}
          class="bg-white border rounded-sm mb-6 min-h-200 p-10 relative overflow-hidden governance-setting"
        >
          <div class="border rounded-sm border-grey5 mb-6 w-full">
            <div class="border-b flex border-b-grey5 py-3 px-6 items-center u-title3">
              <span class="mr-2">Strategie(s)</span>
              <UTooltip placement="right">
                {{
                  trigger: () => <QuestionFilled class="h-4 text-color3 w-4" />,
                  default: () => (
                    <div class="w-60">
                      Strategris are used determine voting power or whether a user is eligible to
                      create a proposal(Voting power is cumulative)
                    </div>
                  )
                }}
              </UTooltip>
            </div>
            <div class="p-6">
              {this.govSetting.strategies.length ? (
                this.govSetting.strategies.map(strategy => (
                  <div
                    class="border rounded-sm flex border-grey5 mb-6 py-3 px-4 justify-between items-center"
                    onClick={() => this.editStrategy(strategy)}
                  >
                    <span class="u-body4">
                      {strategy.dictLabel}{' '}
                      {strategy.voteSymbol && (
                        <span class="bg-[#8247E50F] rounded-2xl text-primary text-xs ml-4 py-1 px-4">
                          {strategy.voteSymbol}
                        </span>
                      )}
                    </span>
                    <div
                      class="cursor-pointer transform scale-75"
                      onClick={() => this.delStrategy(strategy.dictValue!)}
                    >
                      <DeleteFilled class="text-color3" />
                    </div>
                  </div>
                ))
              ) : (
                <div class="border border-warning rounded-sm flex mb-6 py-4 px-6 items-center">
                  <WarningFilled class="mr-2" />
                  <span>You must add at least one strategy</span>
                </div>
              )}
              {}
              <div
                class="border border-dashed rounded-sm cursor-pointer flex py-2 text-color3 items-center justify-center u-body2"
                onClick={this.addStrategy}
              >
                <span style={{ fontSize: '18px', marginRight: '10px' }}>+</span>
                <span>Add strategy</span>
              </div>
            </div>
          </div>
          <div class="border rounded-sm border-grey5 mb-6 w-full">
            <div class="border-b border-b-grey5 py-3 px-6 u-title3">Vote symbol</div>
            <div class="p-6">
              <UFormItem
                showLabel={false}
                path="voteSymbol"
                rule={[
                  {
                    required: true,
                    message: 'Vote symbol cannot be blank',
                    trigger: 'blur'
                  }
                ]}
              >
                <UInput v-model:value={this.govSetting.voteSymbol} maxlength={8} />
              </UFormItem>
              <div class="mt-2 text-grey4 u-tag">
                Set up a special vote symbol that can be used to distinguish it from other startup
              </div>
            </div>
          </div>
          <div class="border rounded-sm border-grey5 mb-6 w-full">
            <div class="border-b border-b-grey5 py-3 px-6 u-title3">Proposal precondition</div>
            <div class="p-6">
              <div class="mb-6">
                <USwitch
                  v-model:value={this.govSetting.allowMember}
                  railStyle={({ checked }) => {
                    if (checked) return { background: '#00BFA5', boxShadow: 'unset' }
                    return {}
                  }}
                />
                <span class="ml-4 u-body2">Allow all team members to submit a proposal</span>
              </div>
              <div class="mb-2 u-body4">Proposal threshold </div>
              <UInputNumberGroup
                v-model:value={this.govSetting.proposalThreshold}
                type="withUnit"
                renderUnit={() => renderUnit(this.govSetting.voteSymbol)}
                v-slots={{
                  suffix: () => null
                }}
                inputProps={{
                  maxlength: 20,
                  precision: 18,
                  min: 0,
                  parse: (value: string) => {
                    const newVal = value.replace('-', '')
                    if (newVal === null || newVal === '') return 0
                    return newVal
                  }
                }}
              />
              <div class="mt-2 text-grey4 u-tag">
                The minimum amount of voting power required to create a proposal
              </div>
            </div>
          </div>
          <div class="border rounded-sm border-grey5 mb-6 w-full">
            <div class="border-b border-b-grey5 py-3 px-6 u-title3">Proposal validity</div>
            <div class="p-6">
              <UInputNumberGroup
                class="w-full"
                v-model:value={this.govSetting.proposalValidity}
                type="withUnit"
                renderUnit={() => renderUnit(this.govSetting.voteSymbol)}
                v-slots={{
                  suffix: () => null
                }}
                inputProps={{
                  maxlength: 20,
                  precision: 18,
                  min: 0,
                  parse: (value: string) => {
                    const newVal = value.replace('-', '')
                    if (newVal === null || newVal === '') return 0
                    return newVal
                  }
                }}
              />
              <div class="mt-2 text-grey4 u-tag">
                The minimum amount of voting power required for the proposal to pass
              </div>
            </div>
          </div>
          <div class="border rounded-sm border-grey5 mb-2 w-full">
            <div class="border-b border-b-grey5 py-3 px-6 u-title3">Admin</div>
            <div class="p-6">
              <div class="flex mb-4">
                <UInput disabled value={this.govSetting.admins[0]} class="flex-1" />
                <div class="basis-20"></div>
              </div>
              {this.govSetting.admins.slice(1).map((item, itemIndex) => (
                <UFormItem
                  showLabel={false}
                  class="mb-4"
                  path={`admins[${itemIndex + 1}]`}
                  rule={[
                    {
                      validator: (rule, value) => {
                        if (!item || (/^0x[a-zA-Z\d]{40}/.test(item) && item.length === 42)) {
                          return true
                        }
                        return false
                      },
                      message: 'Invalid wallet address',
                      trigger: 'blur'
                    }
                  ]}
                >
                  <UInput v-model:value={this.govSetting.admins[itemIndex + 1]} class="flex-1" />
                  <div class="flex items-center basis-20">
                    <MinusCircleOutlined
                      onClick={() => this.delAdmin(itemIndex)}
                      class={`
                        ml-3 cursor-pointer text-error
                        ${this.govSetting.admins?.length <= 2 ? 'hidden' : ''}
                      `}
                    />

                    <AddCircleOutlined class="cursor-pointer ml-3" onClick={this.addAdmin} />
                  </div>
                </UFormItem>
              ))}
            </div>
          </div>
          <div class="text-grey4 u-tag">
            The admins will be able to moderate proposals. You must add one address per line.
          </div>
          <div class="flex mt-10 justify-end">
            <div
              class="rounded-sm cursor-pointer bg-primary1 text-white py-2 px-8"
              onClick={this.saveGovSetting}
            >
              Save
            </div>
          </div>
        </UForm>
        <UModal
          show={this.strategyModal === 'selectModal'}
          class="bg-white rounded-sm py-8 px-10 w-150"
        >
          <div>
            <header class="flex mb-6 justify-between items-center">
              <span class="tracking-normal text-primary1 u-card-title2">Add strategy</span>
              <CloseOutlined
                class="cursor-pointer text-xs transform text-primary1 scale-75"
                onClick={() => {
                  this.strategyModal = ''
                }}
              />
            </header>
            <USearch class="my-6" placeholder="Search" />
            <div>
              {this.strategies?.map(strate => (
                <div
                  class="border rounded-sm cursor-pointer mb-6 p-6 u-title3"
                  onClick={() => (this.strategyModal = strate.dictValue)}
                >
                  {strate.dictLabel}
                </div>
              ))}
            </div>
          </div>
        </UModal>
        <UModal
          show={this.strategyModal === 'erc20-balance-of'}
          class="bg-white rounded-sm py-8 px-10 w-150"
        >
          <div>
            <UForm
              model={this.erc20BalanceStrategy}
              ref={(ref: any) => (this.erc20BalanceForm = ref)}
            >
              <header class="flex mb-6 justify-between items-center">
                <span class="text-primary1 u-card-title2">erc20-balance-of</span>
                <CloseOutlined
                  class="cursor-pointer text-xs transform text-primary1 scale-75"
                  onClick={() => (this.strategyModal = '')}
                />
              </header>
              {/* <div class="my-2 u-body4">Network</div> */}
              <UFormItem label="Network" path="network">
                <USelect
                  v-model:value={this.erc20BalanceStrategy.network}
                  options={this.networks}
                  labelField="name"
                  valueField="chainId"
                />
              </UFormItem>
              {/* <div class="my-2 u-body4"></div> */}
              <UFormItem
                label="Contract address"
                path="contractAddress"
                first={true}
                rule={[
                  {
                    validator: (rule, value) => !!value,
                    message: 'Contract address cannot be blank',
                    trigger: 'blur'
                  },
                  {
                    validator: (rule, value) => {
                      return /^0x[a-zA-Z\d]{40}/.test(value) && value.length === 42
                    },
                    message: 'Invalid contract address',
                    trigger: 'blur'
                  }
                ]}
              >
                <UInput v-model:value={this.erc20BalanceStrategy.contractAddress} />
              </UFormItem>
              {/* <div class="my-2 u-body4">Symbol</div> */}
              <UFormItem label="Symbol" path="symbol">
                <UInput
                  value={this.erc20BalanceStrategy.symbol}
                  maxlength={10}
                  onUpdateValue={value => {
                    this.erc20BalanceStrategy.symbol = (value as string).replace(
                      /[^0-9a-zA-Z]/gi,
                      ''
                    )
                  }}
                />
              </UFormItem>
              <div class="mt-2 mb-6 text-grey4 u-tag">
                This strategy returns the balances of the voters for a specific ERC20 token.You can
                edit the strategy by clicking on it if you want to add your own token.
              </div>
              {!this.contractAddressExist && (
                <div class="border rounded-sm flex border-[#F53F3F] mb-10  py-1 px-4 items-center">
                  <ErrorTipFilled class="transform text-[#F53F3F] scale-75" />
                  <span class="ml-4 text-[#F53F3F] u-body1">
                    The token address was not found, please make sure the network is correct
                  </span>
                </div>
              )}
              <div class="flex mt-4 justify-end">
                <UButton
                  type="primary"
                  loading={this.addStrategyBtnLoading}
                  class="rounded-sm cursor-pointer bg-primary1 !hover:bg-primary1 text-white text-center py-2 w-40"
                  onClick={() =>
                    this.addErc20Strategy({
                      ...this.erc20BalanceStrategy,
                      dictLabel: 'erc20-balance-of',
                      dictValue: 'erc20Balance'
                    })
                  }
                >
                  Add
                </UButton>
              </div>
            </UForm>
          </div>
        </UModal>
        <UModal show={this.strategyModal === 'ticket'} class="bg-white rounded-sm py-8 px-10 w-150">
          <div>
            <UForm model={this.ticketStrategy}>
              <header class="flex justify-between items-center mb-6">
                <span class="u-card-title2 text-primary1">Ticket</span>
                <CloseOutlined
                  class="text-primary1 text-xs cursor-pointer transform scale-75"
                  onClick={() => (this.strategyModal = '')}
                />
              </header>
              {/* <div class="u-body4 my-2">Network</div> */}
              <UFormItem label="Network" path="network">
                <USelect
                  v-model:value={this.ticketStrategy.network}
                  options={this.networks}
                  labelField="name"
                  valueField="chainId"
                />
              </UFormItem>

              <div class="u-tag text-grey4 mt-2 mb-6">
                This strategy means that voting can be done as long as the wallet is linked, and
                each wallet address has only one vote
              </div>
              <div class="mt-4 flex justify-end">
                <div
                  class="w-40 bg-primary1 text-white py-2 rounded-sm text-center cursor-pointer"
                  onClick={() =>
                    this.addTicketStrategy({
                      ...this.ticketStrategy,
                      dictLabel: 'Ticket',
                      dictValue: 'ticket'
                    })
                  }
                >
                  Add
                </div>
              </div>
            </UForm>
          </div>
        </UModal>
      </div>
    )
  }
})
