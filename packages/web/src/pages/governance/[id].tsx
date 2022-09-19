import {
  message,
  UButton,
  UCard,
  ULazyImage,
  UModal,
  UPopover,
  USpin,
  UTable,
  UTag
} from '@comunion/components'
import {
  CloseOutlined,
  MoreFilled,
  ShareOutlined,
  SignOutlined,
  UrlOutlined,
  WarningFilled
} from '@comunion/icons'
import { shortenAddress } from '@comunion/utils'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { NSpin } from 'naive-ui'
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CurrentResult } from './components/CurrentResult'
import StartupCard from './components/StartupCard'
import { StrategyInformation } from './components/StrategyInfo'
import { GOVERNANCE_KEY, GOVERNANCE_STATUS_STYLE, signerVoteTypes } from './utils'
import CreateProposalBlock, { CreateProposalRef } from '@/blocks/Proposal/Create'
import CustomCard from '@/components/CustomCard'
import { allNetworks, infuraKey } from '@/constants'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useWalletStore } from '@/stores'
import { StartupDetail } from '@/types'
import { getClient } from '@/utils/ipfs'

type SelectChoiceType = NonNullable<
  NonNullable<ServiceReturn<'governance@get-proposal-detail'>>['choices']
>[number]

const ProposalDetail = defineComponent({
  name: 'ProposalDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const ipfsClient = getClient()
    const walletStore = useWalletStore()
    const tokenContract = useErc20Contract()
    const createProposalRef = ref<CreateProposalRef>()
    const startupInfo = ref<StartupDetail>()
    const proposalInfo = ref<ServiceReturn<'governance@get-proposal-detail'>>()
    const voteRecords =
      ref<NonNullable<ServiceReturn<'governance@proposal-vote-record-list'>>['rows']>()
    const govSetting = ref<NonNullable<ServiceReturn<'governance@get-startup-governace-setting'>>>()
    const pageLoading = ref(false)
    const pagination = reactive<{
      pageSize: number
      total: number
      page: number
      loading: boolean
    }>({
      pageSize: 10,
      total: 0,
      page: 1,
      loading: false
    })
    const selectedChoice = ref<SelectChoiceType>()
    const votePower = ref<number | string>(0)
    const votePowerShow = ref<boolean>(false)
    const strategyInfo = ref()
    const voteInfoVisible = ref(false)
    const strategyVisible = ref(false)
    const delProposalVisible = ref(false)
    const ipfsDetail = ref({
      visible: false,
      hash: '',
      address: '',
      choice: ''
    })

    const getStartupInfo = async (startupId: number) => {
      try {
        pageLoading.value = true
        const { error, data } = await services['startup@startup-get']({ startupId })
        if (!error) {
          startupInfo.value = data
        }
        pageLoading.value = false
      } catch (error) {
        pageLoading.value = false
        console.error('error===>', error)
      }
    }

    const getVotePower = async (strategy: {
      chainId: number
      dictValue: string
      voteDecimals: number
      tokenContractAddress?: string
    }) => {
      switch (strategy?.dictValue) {
        case 'ticket': {
          votePower.value = 1
          break
        }
        case 'erc20Balance': {
          votePowerShow.value = true
          if (strategy.tokenContractAddress) {
            const userAddress = walletStore.address

            const rpcProvider = walletStore.getRpcProvider(strategy.chainId, infuraKey)
            const tokenRes = tokenContract(strategy.tokenContractAddress, rpcProvider)
            const userBalance = await tokenRes.balanceOf(userAddress, {
              blockTag: proposalInfo.value?.blockNumber
            })
            votePower.value = ethers.utils.formatUnits(userBalance, strategy.voteDecimals)
          }
          votePowerShow.value = false
          break
        }
        default:
          votePower.value = 0
      }
    }

    const getGovernanceSetting = async (startupId: number) => {
      try {
        const { error, data } = await services['governance@get-startup-governace-setting']({
          startupID: startupId
        })
        if (!error) {
          govSetting.value = data
        }
      } catch (error) {
        console.error('error==>', error)
      }
    }

    const getProposalDetail = async () => {
      try {
        pageLoading.value = true
        const { error, data } = await services['governance@get-proposal-detail']({
          proposalID: route.params.id
        })
        if (!error && data) {
          proposalInfo.value = data
          const strategy =
            proposalInfo.value?.strategies?.[proposalInfo.value?.strategies?.length - 1]
          strategyInfo.value = strategy
          getStartupInfo(data.startupId!)
          getGovernanceSetting(data.startupId!)
          if (strategy) {
            getVotePower(strategy)
          }
        }
        pageLoading.value = false
      } catch (error) {
        pageLoading.value = false
      }
    }

    const getVoteRecords = async (page: number, override = false) => {
      try {
        const { error, data } = await services['governance@proposal-vote-record-list']({
          limit: pagination.pageSize,
          page,
          proposalID: route.params.id
        })
        if (!error) {
          pagination.total = data.totalRows
          if (override) {
            voteRecords.value = data.rows || []
          } else {
            voteRecords.value = [...(voteRecords.value || []), ...(data.rows || [])]
          }
        }
      } catch (error) {
        console.error('error===>', error)
      }
    }

    const choiceVote = async (voteInfo: SelectChoiceType) => {
      selectedChoice.value = voteInfo
    }

    const showVoteInfo = async () => {
      voteInfoVisible.value = true
    }

    const confirmVote = async () => {
      if (selectedChoice.value) {
        try {
          const { itemName, id } = selectedChoice.value

          const saveContent = {
            From: walletStore.address,
            Startup: proposalInfo.value?.startupName,
            timestamp: dayjs().valueOf(),
            proposal: proposalInfo.value?.title,
            choice: itemName
          }

          const domain = {
            name: 'Comunion'
          }

          // const signature = await walletStore.wallet?.sign(JSON.stringify(saveContent, null, 4))
          const signature = await walletStore.wallet?.signTypedData(
            domain,
            signerVoteTypes,
            saveContent
          )

          if (signature) {
            const { cid } = await ipfsClient.add(
              JSON.stringify({
                address: walletStore.address,
                sig: signature,
                data: {
                  domain,
                  types: signerVoteTypes,
                  message: saveContent
                }
              })
            )
            const { error } = await services['governance@vote-proposal']({
              proposalID: route.params.id,
              voterWalletAddress: walletStore.address!,
              choiceItemId: id,
              votes: Number(votePower.value),
              ipfsHash: cid.toString()
            })
            if (!error) {
              getProposalDetail()
              getVoteRecords(1, true)
              voteInfoVisible.value = false
            }
          }
        } catch (error) {
          console.error('error', error)
        }
      }
    }

    const showVerifyModal = (hash: string, address: string, choice: string) => {
      ipfsDetail.value = {
        visible: true,
        hash,
        address,
        choice
      }
    }

    const toVerify = async ({ ipfs }: { ipfs: string }) => {
      window.open(`https://signator.io/view?ipfs=${ipfs}`)
    }

    const duplicateProposal = () => {
      if (proposalInfo.value) {
        createProposalRef.value?.show({
          current: 1,
          title: proposalInfo.value.title,
          discussion: proposalInfo.value.discussionLink,
          description: proposalInfo.value.description,
          startupId: proposalInfo.value.startupId,
          vote: proposalInfo.value.voteSystem,
          voteChoices: proposalInfo.value.choices?.map(choice => ({ value: choice.itemName })),
          startTime: dayjs(proposalInfo.value.startTime).valueOf(),
          endTime: dayjs(proposalInfo.value.endTime).valueOf()
        })
      }
    }

    const deleteProposal = async () => {
      const proposalID = route.params.id
      const { error } = await services['governance@delete-proposal']({
        proposalID
      })
      if (!error) {
        message.success('delete successfully')
        router.replace({
          path: '/governance/list'
        })
      }
    }

    const statusStyle = computed(() => {
      return GOVERNANCE_STATUS_STYLE[
        proposalInfo.value?.status as keyof typeof GOVERNANCE_STATUS_STYLE
      ]
    })

    const toIPFSRaw = (hash: string) => {
      window.open(`/ipfs/raw/${hash}`)
    }

    const closeIPFSDetail = () => {
      ipfsDetail.value = {
        visible: false,
        hash: '',
        address: '',
        choice: ''
      }
    }

    const toComerDetail = (comerId?: number) => {
      if (comerId) {
        router.push({ path: '/comer', query: { id: comerId } })
      }
    }

    const loadMoreVoteRecords = () => {
      pagination.page += 1
      getVoteRecords(pagination.page)
    }

    const blockExploreUrl = computed(() => {
      if (strategyInfo.value.chainId) {
        const findRes = allNetworks.find(network => network.chainId === strategyInfo.value.chainId)
        return findRes?.explorerUrl
      }
      return undefined
    })

    const isAdmin = computed(() => {
      return (
        proposalInfo.value!.admins?.findIndex(
          admin => admin.walletAddress === walletStore.address
        ) > -1
      )
    })

    onMounted(() => {
      getProposalDetail()
      getVoteRecords(1, true)
    })

    return {
      startupInfo,
      pageLoading,
      proposalInfo,
      pagination,
      statusStyle,
      voteRecords,
      selectedChoice,
      votePower,
      votePowerShow,
      voteInfoVisible,
      strategyVisible,
      createProposalRef,
      strategyInfo,
      govSetting,
      ipfsDetail,
      blockExploreUrl,
      isAdmin,
      delProposalVisible,
      showVoteInfo,
      choiceVote,
      confirmVote,
      toVerify,
      duplicateProposal,
      deleteProposal,
      showVerifyModal,
      toIPFSRaw,
      closeIPFSDetail,
      toComerDetail,
      loadMoreVoteRecords
    }
  },
  render() {
    return (
      <USpin show={this.pageLoading}>
        <div class="flex mt-1 mb-14">
          <UCard style="flex:2" class="mr-4">
            <div class="flex mb-5 justify-between">
              <span class="max-w-9/10 text-color1truncate u-h3">{this.proposalInfo?.title}</span>
              <UTag class="text-color2">
                {GOVERNANCE_KEY[this.proposalInfo?.status as keyof typeof GOVERNANCE_KEY]}
              </UTag>
            </div>
            <div class="flex items-center">
              <div
                class="cursor-pointer flex items-center"
                onClick={() => this.toComerDetail(this.proposalInfo?.authorComerId)}
              >
                <ULazyImage
                  class="rounded-full h-7 w-7"
                  src={this.proposalInfo?.authorComerAvatar || ''}
                />
                <div class="mx-4 text-color2 u-h6 hover:text-primary">
                  {this.proposalInfo?.authorComerName}
                </div>
              </div>
              <UPopover
                trigger="click"
                placement="bottom"
                v-slots={{
                  trigger: () => <MoreFilled class="cursor-pointer h-7 w-9" />,
                  default: () => (
                    <div class="flex flex-col">
                      <UButton
                        size="small"
                        type="primary"
                        class="text-white"
                        quaternary
                        onClick={this.duplicateProposal}
                      >
                        Duplicate proposal
                      </UButton>
                      {this.isAdmin && (
                        <UButton
                          size="small"
                          type="error"
                          class="mt-1"
                          quaternary
                          onClick={() => (this.delProposalVisible = true)}
                        >
                          Delete proposal
                        </UButton>
                      )}
                    </div>
                  )
                }}
              ></UPopover>
            </div>
            {this.proposalInfo?.description && (
              <div class="mt-4 text-color2 u-h6" v-html={this.proposalInfo?.description} />
            )}
            {this.proposalInfo?.discussionLink && (
              <div class="mt-8">
                <div class="mb-1 text-color1 u-h4">Discussion：</div>
                <a
                  href={this.proposalInfo.discussionLink}
                  target="__blank"
                  class="text-color3 u-h5 hover:text-primary"
                >
                  {this.proposalInfo.discussionLink}
                </a>
              </div>
            )}

            <CustomCard class="mb-6 mt-10" title="Cast your vote">
              <div class="pt-6">
                {this.proposalInfo?.choices?.map(voteInfo => (
                  <div
                    class={`u-h4 border text-center py-3 mb-4 rounded-sm cursor-pointer hover:border-[#5331F4] hover:text-primary ${
                      this.selectedChoice?.id === voteInfo.id
                        ? 'border-primary  text-primary'
                        : 'border-primary-10  text-color2'
                    }`}
                    onClick={() => this.choiceVote(voteInfo)}
                  >
                    {voteInfo.itemName}
                  </div>
                ))}
                <div
                  class={[
                    'text-white u-h4 text-center py-3 rounded-sm',
                    this.selectedChoice && this.proposalInfo?.status === 2
                      ? 'bg-primary cursor-pointer'
                      : 'bg-grey5 cursor-not-allowed'
                  ]}
                  onClick={() =>
                    this.selectedChoice && this.proposalInfo?.status === 2
                      ? this.showVoteInfo()
                      : null
                  }
                >
                  Vote
                </div>
              </div>
            </CustomCard>

            {!!this.voteRecords?.length && (
              <CustomCard title={`Votes${this.pagination.total}`}>
                <div class="-mx-6 -mb-6">
                  <UTable bordered={false}>
                    <tbody>
                      {this.voteRecords?.map(record => (
                        <tr key={record.voterComerId}>
                          <td>
                            <div class="flex ml-2 items-center">
                              <ULazyImage src={record.voterComerAvatar} class="h-7 mr-3 w-7" />
                              <span class="text-color2 u-h6">{record.voterComerName}</span>
                            </div>
                          </td>
                          <td>
                            <div class="flex text-color1 items-center u-h6">
                              {record.choiceItemName}
                            </div>
                          </td>
                          <td>
                            <div class="flex text-color3 justify-end items-center u-h6">
                              <span>{record.votes}</span>
                              <span class="mx-2">{this.strategyInfo?.voteSymbol}</span>
                              <SignOutlined
                                class="cursor-pointer mr-5 text-color2"
                                onClick={() =>
                                  this.showVerifyModal(
                                    record.ipfsHash,
                                    record.voterWalletAddress,
                                    record.choiceItemName
                                  )
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                      {this.pagination.page * this.pagination.pageSize < this.pagination.total && (
                        <tr>
                          <td colspan={3}>
                            <div
                              class="text-center text-primary"
                              onClick={this.loadMoreVoteRecords}
                            >
                              See more
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </UTable>
                </div>
              </CustomCard>
            )}
          </UCard>
          <div class="flex-1 ">
            {this.startupInfo && (
              <UCard contentStyle={{ paddingTop: 24 }} class="mb-6">
                <StartupCard startup={this.startupInfo} />
              </UCard>
            )}
            {this.proposalInfo && (
              <StrategyInformation
                class="mb-6"
                proposalInfo={this.proposalInfo}
                onShowStrategyDetail={() => (this.strategyVisible = true)}
                blockExploreUrl={this.blockExploreUrl}
              />
            )}
            {!!this.proposalInfo && !!this.strategyInfo && (
              <CurrentResult
                proposalInfo={this.proposalInfo}
                voteSymbol={this.strategyInfo.voteSymbol}
              />
            )}
          </div>
          <UModal show={this.voteInfoVisible} class="bg-white rounded-sm p-10 w-150">
            <div>
              <div class="mb-6 u-h3">Vote overview</div>
              <div class="border border-color-border rounded-sm grid py-4 px-6 gap-y-4 grid-cols-2">
                <div class="text-color1 u-h5">Option(s)</div>
                <div class="text-right text-color3 u-h6">{this.selectedChoice?.itemName}</div>
                <div class="text-color1 u-h5">Block height</div>
                <div class="flex text-color3 justify-end items-center u-h6">
                  {this.proposalInfo?.blockNumber?.toLocaleString()}
                  {this.blockExploreUrl && (
                    <a
                      href={`${this.blockExploreUrl}/block/${this.proposalInfo?.blockNumber}`}
                      target="__blank"
                      class="outline-none ml-2 leading-4"
                    >
                      <UrlOutlined class="text-primary" />
                    </a>
                  )}
                </div>
                <div class="text-color1 u-h5">Your voting power</div>
                <div class="text-right text-color3 u-h6">
                  <NSpin size="small" show={this.votePowerShow}>
                    {!this.votePowerShow && <span>{this.votePower}</span>}
                    <span> {this.proposalInfo?.voteSymbol}</span>
                  </NSpin>
                </div>
              </div>
              <div class="flex mt-6 justify-end">
                <UButton
                  size="small"
                  class="mr-4 w-40"
                  onClick={() => (this.voteInfoVisible = false)}
                >
                  Cancel
                </UButton>
                <UButton
                  type="primary"
                  size="small"
                  class="w-40"
                  onClick={this.confirmVote}
                  disabled={
                    !Number(this.votePower) ||
                    (!this.proposalInfo?.allowMember &&
                      this.votePower < Number(this.govSetting?.proposalThreshold))
                  }
                >
                  Vote
                </UButton>
              </div>
            </div>
          </UModal>
          <UModal show={this.strategyVisible} class="bg-white rounded-sm p-7 w-150">
            <div>
              <div class="flex mb-6 justify-between">
                <span class="text-primary2 u-h3">Strategies</span>
                <CloseOutlined
                  class="cursor-pointer h-6 text-primary w-6"
                  onClick={() => (this.strategyVisible = false)}
                />
              </div>
              <div class="border border-color-border rounded-sm grid py-4 px-6 gap-y-4 grid-cols-2">
                <div class="text-colo1 u-h4">{this.strategyInfo?.strategyName}</div>
                <div class="text-right text-color3 u-h5"></div>
                <div class="text-colo1 u-h5">Symbol</div>
                <div class="text-right text-color3 u-h5">
                  {this.strategyInfo.voteSymbol || '--'}
                </div>
                <div class="text-color1 u-h5">Address</div>
                <div class="flex text-color2 items-center justify-end u-h5">
                  {shortenAddress(this.strategyInfo?.tokenContractAddress) || '--'}{' '}
                  <a
                    href={`${this.blockExploreUrl}/address/${this.strategyInfo?.tokenContractAddress}`}
                    target="__blank"
                    class="outline-none ml-2 leading-4 "
                  >
                    <UrlOutlined class="text-primary" />
                  </a>
                </div>
                <div class="text-color1 u-h5">Decimals</div>
                <div class="text-right text-color3 u-h5">{this.strategyInfo?.voteDecimals}</div>
              </div>
            </div>
          </UModal>
          {/* this.ipfsDetail.visible */}
          <UModal show={this.ipfsDetail.visible} class="bg-white rounded-sm py-7 px-8 w-150">
            <div>
              <div class="flex text-primary mb-6 justify-between u-h5">
                <span class="text-color1 u-h5">Receipt</span>
                <CloseOutlined
                  class="cursor-pointer h-6 text-primary w-6"
                  onClick={this.closeIPFSDetail}
                />
              </div>
              <div class="border border-color-border rounded-sm flex text-center p-5 justify-between">
                <span class="u-h5">Author</span>
                <span class="flex text-primary items-center">
                  <span class="text-primary mr-4 u-body4">
                    #{this.ipfsDetail.hash.substring(0, 8)}
                  </span>
                  <ShareOutlined
                    class="cursor-pointer"
                    onClick={() => this.toIPFSRaw(this.ipfsDetail.hash)}
                  />
                </span>
              </div>
              <div
                class="border border-color-border rounded-full cursor-pointer flex mt-5 text-primary py-4 px-6 group justify-center items-center hover:border-[#5331F4]"
                onClick={() =>
                  this.toVerify({
                    ipfs: this.ipfsDetail.hash
                  })
                }
              >
                <span class="mr-2 text-color2 u-h5 group-hover:text-primary">
                  Verify on Signator.io
                </span>
                <ShareOutlined />
              </div>
            </div>
          </UModal>
          <UModal v-model:show={this.delProposalVisible} maskClosable={false} autoFocus={false}>
            <UCard
              style={{ width: '540px' }}
              closable={true}
              onClose={() => (this.delProposalVisible = false)}
              v-slots={{
                header: () => {
                  return (
                    <div class="flex relative items-center">
                      <WarningFilled class="mr-4" />{' '}
                      <span class="text-color1 u-h3">Are you sure delete proposal?</span>
                    </div>
                  )
                }
              }}
            >
              <div class="min-h-20 p-4 text-color2 u-h6">
                This action cannot be undone, the proposal will be permanently deleted
              </div>

              <div class="flex mt-20 justify-end">
                <UButton
                  type="primary"
                  ghost
                  class="h-9 mr-4 w-41"
                  onClick={() => (this.delProposalVisible = false)}
                >
                  Cancel
                </UButton>
                <UButton type="primary" class="h-9 w-41" onClick={this.deleteProposal}>
                  Yes
                </UButton>
              </div>
            </UCard>
          </UModal>
          <CreateProposalBlock ref={(ref: any) => (this.createProposalRef = ref)} />
        </div>
      </USpin>
    )
  }
})

export default ProposalDetail
