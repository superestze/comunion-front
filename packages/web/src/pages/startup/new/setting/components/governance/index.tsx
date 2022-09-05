import {
  message,
  UForm,
  UFormItem,
  UInput,
  UInputNumberGroup,
  UModal,
  USearch,
  USelect,
  USwitch
} from '@comunion/components'
import {
  AddCircleOutlined,
  CloseOutlined,
  DeleteFilled,
  MinusCircleOutlined,
  WarningFilled,
  ErrorTipFilled
} from '@comunion/icons'
import { defineComponent, reactive, ref, PropType } from 'vue'
import { StrategyType } from './typing.d'
import { allNetworks } from '@/constants'

import './style.css'
import { services } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
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
    const userStore = useUserStore()
    const walletStore = useWalletStore()
    const strategies: StrategyType[] = [
      { name: 'Ticket', key: 'ticketModal' },
      { name: 'erc20-balance-of', key: 'erc20BalanceModal' }
    ]

    const govSetting = reactive({
      strategies: [strategies[0]],
      voteSymbol: '',
      allowMember: true,
      proposalThreshold: 0,
      proposalValidity: 0,
      admins: [props.startup.blockChainAddress, '']
    })
    const erc20BalanceStrategy = reactive({
      network: 1,
      contractAddress: '',
      symbol: ''
    })
    const strategyModal = ref()
    const erc20BalanceForm = ref()
    const contractAddressExist = ref(true)

    const addStrategy = () => {
      strategyModal.value = 'selectModal'
    }

    const delStrategy = (key: string) => {
      const newStrategies = govSetting.strategies.filter(stra => stra.key !== key)
      govSetting.strategies = newStrategies
    }

    const addErc20Strategy = async (strategy: StrategyType) => {
      erc20BalanceForm.value?.validate(async (error: any) => {
        console.log('error===>', error)
        if (!error) {
          try {
            const { network, contractAddress } = erc20BalanceStrategy
            const provider = await walletStore.getRpcProvider(
              network,
              '65b449dc78314fe583ece8797faccc0a'
            )
            const code = await provider?.getCode(contractAddress)
            if (!code || code.length < 3) {
              contractAddressExist.value = false
              return
            }
            govSetting.strategies.push(strategy)
            strategyModal.value = undefined
          } catch (error) {
            contractAddressExist.value = false
          }
        }
      })
    }

    const saveGovSetting = async () => {
      try {
        formRef.value?.validate(async (error: Error) => {
          console.log('error===>', error)
          if (!govSetting.strategies.length) return
          if (!error) {
            const strategies = govSetting.strategies.map(strategy => ({
              strategName: strategy.name,
              chainId: strategy.chainId,
              tokenContractAddress: strategy.contractAddress
            }))
            const { error } = await services['governance@create-governace-setting']({
              startupId: Number(props.startupId),
              comerId: userStore.profile?.comerID,
              voteSymbol: govSetting.voteSymbol,
              allowMember: govSetting.allowMember,
              proposalThreshold: govSetting.proposalThreshold,
              proposalValidity: govSetting.proposalValidity,
              strategies,
              admins: govSetting.admins.filter(Boolean).map(admin => ({ walletAddress: admin }))
            })
            if (!error) {
              message.success('Save Successfully')
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

    return {
      govSetting,
      strategies,
      strategyModal,
      erc20BalanceStrategy,
      erc20BalanceForm,
      contractAddressExist,
      formRef,
      addStrategy,
      delStrategy,
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
          class="bg-white border rounded-lg mb-6 min-h-205.5 relative overflow-hidden p-10 governance-setting"
        >
          <div class="w-full mb-6 border border-grey5 rounded-lg">
            <div class="border-b border-b-grey5 py-3 px-6 u-title3">Strategie(s)</div>
            <div class="p-6">
              {this.govSetting.strategies.length ? (
                this.govSetting.strategies.map(strategy => (
                  <div class="rounded-lg border border-grey5 px-4 py-3 flex justify-between items-center mb-6">
                    <span class="u-body4">{strategy.name}</span>
                    <div
                      class="transform scale-75 cursor-pointer"
                      onClick={() => this.delStrategy(strategy.key)}
                    >
                      <DeleteFilled class="text-grey3" />
                    </div>
                  </div>
                ))
              ) : (
                <div class="flex items-center border rounded-lg border-warning py-4 px-6 mb-6">
                  <WarningFilled class="mr-2" />
                  <span>You must add at least one strategy</span>
                </div>
              )}
              {}
              <div
                class="border border-dashed rounded-lg u-body2 text-grey3 py-2 flex items-center justify-center cursor-pointer"
                onClick={this.addStrategy}
              >
                <span style={{ fontSize: '18px', marginRight: '10px' }}>+</span>
                <span>Add strategy</span>
              </div>
            </div>
          </div>
          <div class="w-full mb-6 border border-grey5 rounded-lg">
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
              <div class="u-tag text-grey4 mt-2">
                Set up a special vote symbol that can be used to distinguish it from other startup
              </div>
            </div>
          </div>
          <div class="w-full mb-6 border border-grey5 rounded-lg">
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
                <span class="u-body2 ml-4">Allow all team members to submit a proposal</span>
              </div>
              <div class="u-body4 mb-2">Proposal threshold </div>
              <UInputNumberGroup
                v-model:value={this.govSetting.proposalThreshold}
                type="withUnit"
                renderUnit={() => renderUnit(this.govSetting.voteSymbol)}
                inputProps={{
                  maxlength: 20,
                  precision: 18,
                  min: 0,
                  parse: (value: string) => {
                    if (value === null || value === '') return '0'
                    return value
                  }
                }}
              />
              <div class="u-tag text-grey4 mt-2">
                The minimum amount of voting power required to create a proposal
              </div>
            </div>
          </div>
          <div class="w-full mb-6 border border-grey5 rounded-lg">
            <div class="border-b border-b-grey5 py-3 px-6 u-title3">Proposal validity</div>
            <div class="p-6">
              <UInputNumberGroup
                v-model:value={this.govSetting.proposalValidity}
                type="withUnit"
                renderUnit={() => renderUnit(this.govSetting.voteSymbol)}
                inputProps={{
                  maxlength: 20,
                  precision: 18,
                  min: 0,
                  parse: (value: string) => {
                    if (value === null || value === '') return '0'
                    return value
                  }
                }}
              />
              <div class="u-tag text-grey4 mt-2">
                The minimum amount of voting power required for the proposal to pass
              </div>
            </div>
          </div>
          <div class="w-full mb-2 border border-grey5 rounded-lg">
            <div class="border-b border-b-grey5 py-3 px-6 u-title3">Admin</div>
            <div class="p-6">
              <div class="flex mb-4">
                <UInput disabled value={this.govSetting.admins[0]} />
                <div class="basis-20"></div>
              </div>
              {this.govSetting.admins.slice(1).map((_, itemIndex) => (
                <div class="flex items-center mb-4">
                  <UInput v-model:value={this.govSetting.admins[itemIndex + 1]} />
                  <div class="basis-20 flex items-center">
                    <div
                      class={[
                        'ml-3 cursor-pointer text-error',
                        { hidden: this.govSetting.admins.length <= 2 }
                      ]}
                    >
                      <MinusCircleOutlined
                        onClick={() => (itemIndex === 0 ? null : this.delAdmin(itemIndex))}
                      />
                    </div>

                    <AddCircleOutlined class="ml-3 cursor-pointer" onClick={this.addAdmin} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div class="u-tag text-grey4">
            The admins will be able to moderate proposals. You must add one address per line.
          </div>
          <div class="mt-10 flex justify-end">
            <div
              class="bg-primary1 text-white rounded-lg px-8 py-2 cursor-pointer"
              onClick={this.saveGovSetting}
            >
              Save
            </div>
          </div>
        </UForm>
        <UModal
          show={this.strategyModal === 'selectModal'}
          class="bg-white py-8 px-10 w-150 rounded-lg"
        >
          <div>
            <header class="flex justify-between items-center mb-6">
              <span class="u-card-title2 text-primary1 tracking-normal">Add strategy</span>
              <CloseOutlined
                class="text-primary1 text-xs cursor-pointer transform scale-75"
                onClick={() => {
                  this.strategyModal = ''
                }}
              />
            </header>
            <USearch class="my-6" placeholder="Search" />
            <div>
              {this.strategies.map(strate => (
                <div
                  class="border rounded-lg p-6 mb-6 u-title3 cursor-pointer"
                  onClick={() => (this.strategyModal = strate.key)}
                >
                  {strate.name}
                </div>
              ))}
            </div>
          </div>
        </UModal>
        <UModal
          show={this.strategyModal === 'erc20BalanceModal'}
          class="bg-white py-8 px-10 w-150 rounded-lg"
        >
          <div>
            <UForm
              model={this.erc20BalanceStrategy}
              ref={(ref: any) => (this.erc20BalanceForm = ref)}
            >
              <header class="flex justify-between items-center mb-6">
                <span class="u-card-title2 text-primary1">erc20-balance-of</span>
                <CloseOutlined
                  class="text-primary1 text-xs cursor-pointer transform scale-75"
                  onClick={() => (this.strategyModal = '')}
                />
              </header>
              {/* <div class="u-body4 my-2">Network</div> */}
              <UFormItem label="Network" path="network">
                <USelect
                  v-model:value={this.erc20BalanceStrategy.network}
                  options={allNetworks}
                  labelField="name"
                  valueField="chainId"
                />
              </UFormItem>
              {/* <div class="u-body4 my-2"></div> */}
              <UFormItem
                label="Contract address"
                path="contractAddress"
                rule={[
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
              {/* <div class="u-body4 my-2">Symbol</div> */}
              <UFormItem label="Symbol" path="symbol">
                <UInput v-model:value={this.erc20BalanceStrategy.symbol} />
              </UFormItem>
              <div class="u-tag text-grey4 mt-2 mb-6">
                This strategy returns the balances of the voters for a specific ERC20 token.You can
                edit the strategy by clicking on it if you want to add your own token.
              </div>
              {!this.contractAddressExist && (
                <div class="flex items-center border border-[#F53F3F] rounded-lg  mb-10 px-4 py-1">
                  <ErrorTipFilled class="text-[#F53F3F] transform scale-75" />
                  <span class="ml-4 u-body1 text-[#F53F3F]">
                    Type Error: Cannot read properties of undefined
                  </span>
                </div>
              )}
              <div class="mt-4 flex justify-end">
                <div
                  class="w-40 bg-primary1 text-white py-2 rounded-lg text-center cursor-pointer"
                  onClick={() =>
                    this.addErc20Strategy({
                      ...this.erc20BalanceStrategy,
                      name: 'erc20-balance-of',
                      key: 'erc20Balance'
                    })
                  }
                >
                  Add
                </div>
              </div>
            </UForm>
          </div>
        </UModal>
        <UModal
          show={this.strategyModal === 'ticketModal'}
          class="bg-white py-8 px-10 w-150 rounded-lg"
        >
          <div>
            <header class="flex justify-between items-center mb-6">
              <span class="u-card-title2 text-primary1">Ticket</span>
              <CloseOutlined
                class="text-primary1 text-xs cursor-pointer transform scale-75"
                onClick={() => (this.strategyModal = '')}
              />
            </header>
            <div class="text-sm text-grey4 mt-2 mb-6 inline-block">
              This strategy means that voting can be done as long as the wallet is linked, and each
              wallet address has only one vote
            </div>
            <div class="mt-4 flex justify-end">
              <div
                class="w-40 bg-primary1 text-white py-2 rounded-lg text-center cursor-pointer"
                onClick={() =>
                  this.addErc20Strategy({
                    name: 'Ticket',
                    key: 'ticket'
                  })
                }
              >
                Add
              </div>
            </div>
          </div>
        </UModal>
      </div>
    )
  }
})
