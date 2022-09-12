import {
  message,
  UButton,
  UCard,
  ULazyImage,
  UModal,
  UPagination,
  UPopover,
  UStartupLogo,
  UTable
} from '@comunion/components'
import { CloseOutlined, MoreFilled, SignOutlined, ShareOutlined } from '@comunion/icons'
import { shortenAddress } from '@comunion/utils'
import dayjs from 'dayjs'
import jsonurl from 'json-url'
import { defineComponent, ref, reactive, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CurrentResult } from './components/CurrentResult'
import StartupCard from './components/StartupCard'
import { StrategyInformation } from './components/StrategyInfo'
import { GOVERNANCE_KEY, GOVERNANCE_STATUS_STYLE, signerVoteTypes } from './utils'
import CreateProposalBlock, { CreateProposalRef } from '@/blocks/Proposal/Create'
import { infuraKey } from '@/constants'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useWalletStore } from '@/stores'
import { StartupDetail } from '@/types'
import { getClient } from '@/utils/ipfs'

const codec = jsonurl('lzw')

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
    const voteRecords = ref<NonNullable<ServiceReturn<'governance@proposal-vote-record-list'>>>()
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
    const selectedChoice =
      ref<NonNullable<ServiceReturn<'governance@get-proposal-detail'>>['choices'][number]>()
    const votePower = ref<number>(0)
    const strategyInfo = ref()
    const voteInfoVisible = ref(false)
    const strategyVisible = ref(false)
    const ipfsDetail = ref({
      visible: false,
      hash: '',
      address: '',
      choice: ''
    })

    watch(
      () => pagination.page,
      () => {
        getVoteRecords()
      }
    )

    const getStartupInfo = async (startupId: number) => {
      try {
        pageLoading.value = true
        const { error, data } = await services['startup@startup-get']({ startupId })
        if (!error) {
          console.log('data===>', data)

          startupInfo.value = data
        }
        pageLoading.value = false
      } catch (error) {
        pageLoading.value = false
        console.error('error===>', error)
      }
    }

    const getVotePower = async (strategy: {
      dictValue?: string
      tokenContractAddress?: string
    }) => {
      switch (strategy?.dictValue) {
        case 'ticket': {
          votePower.value = 1
          break
        }
        case 'erc20-balance-of': {
          if (strategy.tokenContractAddress) {
            const userAddress = walletStore.address
            const rpcProvider = walletStore.getRpcProvider(43113, infuraKey)
            const tokenRes = tokenContract(strategy.tokenContractAddress, rpcProvider)
            const userBalance = await tokenRes.balanceOf(userAddress, {
              blockTag: proposalInfo.value?.blockNumber
            })
            votePower.value = userBalance
          }
          break
        }
        default:
          votePower.value = 1
      }
    }

    const getProposalDetail = async () => {
      pageLoading.value = true
      const { error, data } = await services['governance@get-proposal-detail']({
        proposalID: route.params.id
      })
      if (!error) {
        console.log('data===>', data)
        proposalInfo.value = data
        const strategy = proposalInfo.value?.strategies[proposalInfo.value?.strategies.length - 1]
        strategyInfo.value = strategy
        getStartupInfo(data.startupId)
        getVotePower(strategy)
      }
    }

    const getVoteRecords = async () => {
      try {
        const { error, data } = await services['governance@proposal-vote-record-list']({
          limit: pagination.pageSize,
          page: pagination.page,
          proposalID: route.params.id
        })
        if (!error) {
          voteRecords.value = data
        }
      } catch (error) {
        console.error('error===>', error)
      }
    }

    const choiceVote = async (
      voteInfo: NonNullable<ServiceReturn<'governance@get-proposal-detail'>>['choices'][number]
    ) => {
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
            console.log('cid==>', cid.toString())
            const { error } = await services['governance@vote-proposal']({
              proposalID: route.params.id,
              voterWalletAddress: walletStore.address!,
              choiceItemId: id,
              votes: votePower.value,
              ipfsHash: cid.toString()
            })
            if (!error) {
              getVoteRecords()
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

    const toVerify = async ({
      ipfs,
      address,
      choice
    }: {
      ipfs: string
      address: string
      choice: string
    }) => {
      const saveContent = {
        From: walletStore.address,
        Startup: proposalInfo.value?.startupName,
        timestamp: dayjs().valueOf(),
        proposal: proposalInfo.value?.title,
        choice
      }
      console.log('saveContent===>', saveContent)

      const message = await codec.compress(saveContent)
      console.log('message===>', message)

      window.open(`https://signator.io/view?ipfs=${ipfs}`)
    }

    const duplicateProposal = () => {
      createProposalRef.value?.show({
        current: 1,
        startupId: proposalInfo.value?.startupId,
        vote: proposalInfo.value?.voteSystem,
        voteChoices: proposalInfo.value?.choices.map(choice => ({ value: choice.itemName })),
        startTime: dayjs(proposalInfo.value?.startTime).valueOf(),
        endTime: dayjs(proposalInfo.value?.endTime).valueOf()
      })
    }

    const deleteProposal = async () => {
      const { error } = await services['governance@delete-proposal']({
        proposalID: route.params.id
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

    onMounted(() => {
      getProposalDetail()
      getVoteRecords()
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
      voteInfoVisible,
      strategyVisible,
      createProposalRef,
      strategyInfo,
      ipfsDetail,
      showVoteInfo,
      choiceVote,
      confirmVote,
      toVerify,
      duplicateProposal,
      deleteProposal,
      showVerifyModal,
      toIPFSRaw,
      closeIPFSDetail
    }
  },
  render() {
    return (
      <div class="flex gap-x-6 mb-20">
        <div class="w-228 bg-white rounded-lg border border-grey5 p-10">
          <div class="mb-5 flex justify-between">
            <span class="u-title1 truncate max-w-200">{this.proposalInfo?.title}</span>
            <span class={this.statusStyle}>
              {GOVERNANCE_KEY[this.proposalInfo?.status as keyof typeof GOVERNANCE_KEY]}
            </span>
          </div>
          <div class="flex items-center">
            <UStartupLogo
              width="8"
              height="8"
              src={this.proposalInfo?.startupLogo || ''}
              class="rounded-full"
            />
            <div class="text-primary mx-4">
              {shortenAddress(this.proposalInfo?.authorWalletAddress || '')}
            </div>
            <UPopover
              trigger="click"
              placement="bottom"
              v-slots={{
                trigger: () => <MoreFilled class="cursor-pointer" />,
                default: () => (
                  <div class="flex flex-col">
                    <UButton size="small" quaternary onClick={this.duplicateProposal}>
                      Duplicate proposal
                    </UButton>
                    <UButton size="small" quaternary onClick={this.deleteProposal}>
                      Delete proposal
                    </UButton>
                  </div>
                )
              }}
            ></UPopover>
          </div>
          {this.proposalInfo?.description && (
            <div class="u-body2 mt-4" v-html={this.proposalInfo?.description} />
          )}
          {this.proposalInfo?.discussionLink && (
            <div class="mt-8">
              <div class="u-title3">Discussion：</div>
              <a href={this.proposalInfo.discussionLink} class="text-primary" target="__blank">
                {this.proposalInfo.discussionLink}
              </a>
            </div>
          )}
          <div class="border border-grey5 rounded-lg my-10">
            <header class="bg-purple u-title3 py-4 px-10">Cast your vote</header>
            <section class="p-8">
              {this.proposalInfo?.choices?.map(voteInfo => (
                <div
                  class={[
                    'border border-primary-10 text-primary text-center py-3 mb-4 rounded-lg cursor-pointer',
                    { 'border-primary': this.selectedChoice?.id === voteInfo.id }
                  ]}
                  onClick={() => this.choiceVote(voteInfo)}
                >
                  {voteInfo.itemName}
                </div>
              ))}
              <div
                class={[
                  'text-white text-center py-3 rounded-lg ',
                  // this.selectedChoice ? 'bg-primary1 cursor-pointer' : 'bg-grey5 cursor-not-allowed'
                  this.selectedChoice ? 'bg-primary1 cursor-pointer' : 'bg-grey5'
                ]}
                // onClick={() => (this.selectedChoice ? this.showVoteInfo() : null)}
                onClick={() => this.showVoteInfo()}
              >
                Vote
              </div>
            </section>
          </div>
          <UTable>
            <thead>
              <tr>
                <th>Votes({this.pagination.total})</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.voteRecords?.map(record => (
                <tr>
                  <td class="flex items-center">
                    <ULazyImage src={record.voterComerAvatar} class="w-7 h-7 mr-3" />
                    <span class="u-body4 text-primary">
                      {shortenAddress(record.voterWalletAddress)}
                    </span>
                  </td>
                  <td>{record.choiceItemName}</td>
                  <td class="flex justify-end items-center">
                    <span>{record.votes}</span>
                    <span class="mx-3">{this.proposalInfo?.voteSystem}</span>
                    <SignOutlined
                      class="cursor-pointer"
                      onClick={() =>
                        this.showVerifyModal(
                          record.ipfsHash,
                          record.voterWalletAddress,
                          record.choiceItemName
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </UTable>
          <UPagination
            class="mt-4 flex justify-end"
            page={this.pagination.page}
            pageCount={this.pagination.pageSize}
            itemCount={this.pagination.total}
            onUpdatePage={page => {
              this.pagination.page = page
            }}
          />
        </div>
        <div class="flex-1 min-w-111">
          {this.startupInfo && (
            <UCard class="mb-6">
              <StartupCard startup={this.startupInfo} />
            </UCard>
          )}
          {this.proposalInfo && (
            <StrategyInformation class="mb-6" proposalInfo={this.proposalInfo} />
          )}
          {this.proposalInfo && <CurrentResult proposalInfo={this.proposalInfo} />}
        </div>
        <UModal show={this.voteInfoVisible} class="bg-white p-10 w-150 rounded-lg">
          <div>
            <div class="u-title1 mb-6">Vote overview</div>
            <div class="border border-grey5 grid grid-cols-2 py-4 px-6 rounded-lg gap-y-4">
              <div class="u-body2 text-grey3">Option(s)</div>
              <div class="u-body2 text-grey1 text-right">{this.selectedChoice?.itemName}</div>
              <div class="u-body2 text-grey3">Block height</div>
              <div class="u-body2 text-grey1 text-right">{this.proposalInfo?.blockNumber}</div>
              <div class="u-body2 text-grey3">Your voting power</div>
              <div class="u-body2 text-grey1 text-right">{this.votePower}</div>
            </div>
            <div class="flex justify-end mt-6">
              <UButton
                size="small"
                class="w-40 mr-4"
                onClick={() => (this.voteInfoVisible = false)}
              >
                Cancel
              </UButton>
              <UButton type="primary" size="small" class="w-40" onClick={this.confirmVote}>
                Vote
              </UButton>
            </div>
          </div>
        </UModal>
        <UModal show={this.strategyVisible} class="bg-white p-10 w-150 rounded-lg">
          <div>
            <div class="u-title1 mb-6 flex justify-between">
              <span>Startegies</span>
              <CloseOutlined class="text-primary" />
            </div>
            <div class="border border-grey5 grid grid-cols-2 py-4 px-6 rounded-lg gap-y-4">
              <div class="u-body2 text-grey3">Symbol</div>
              <div class="u-body2 text-grey1 text-right">{this.strategyInfo}</div>
              <div class="u-body2 text-grey3">Address</div>
              <div class="u-body2 text-grey1 text-right">{this.proposalInfo?.blockNumber}</div>
              <div class="u-body2 text-grey3">Decimals</div>
              <div class="u-body2 text-grey1 text-right">{this.votePower}</div>
            </div>
          </div>
        </UModal>
        <UModal show={this.ipfsDetail.visible} class="bg-white px-8 py-7 w-150 rounded-lg">
          <div>
            <div class="u-title1 mb-6 flex justify-between text-primary">
              <span class="u-card-title2 text-primary">Receipt</span>
              <CloseOutlined
                class="text-primary w-6 h-6 cursor-pointer"
                onClick={this.closeIPFSDetail}
              />
            </div>
            <div class="border border-grey5 p-5 text-center flex justify-between rounded-lg">
              <span>Author</span>
              <span class="text-primary flex items-center">
                <span class="u-body4 text-primary mr-4">
                  #{this.ipfsDetail.hash.substring(0, 8)}
                </span>
                <ShareOutlined
                  class="cursor-pointer"
                  onClick={() => this.toIPFSRaw(this.ipfsDetail.hash)}
                />
              </span>
            </div>
            <div
              class="border border-grey5 py-4 px-6 rounded-full text-primary flex justify-center items-center mt-5 cursor-pointer"
              onClick={() =>
                this.toVerify({
                  ipfs: this.ipfsDetail.hash,
                  address: this.ipfsDetail.address,
                  choice: this.ipfsDetail.choice
                })
              }
            >
              <span class="mr-2">Verify on Signator.io</span>
              <ShareOutlined />
            </div>
          </div>
        </UModal>
        <CreateProposalBlock ref={(ref: any) => (this.createProposalRef = ref)} />
      </div>
    )
  }
})

export default ProposalDetail
