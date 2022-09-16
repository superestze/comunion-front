import { UStartupLogo } from '@comunion/components'
import { ethers } from 'ethers'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CROWDFUNDING_TYPES } from '@/constants'
import { useErc20Contract, useCrowdfundingContract } from '@/contracts'
import { ServiceReturn } from '@/services'
import { useWalletStore } from '@/stores'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { formatToFloor } from '@/utils/numberFormat'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  name: 'CrowdfundingMiniCard',
  props: {
    info: {
      type: Object as PropType<
        NonNullable<ServiceReturn<'crowdfunding@public-crowdfunding-list'>>['rows'][number]
      >,
      required: true
    }
  },
  setup(props) {
    const sellTokenSymbol = ref()
    const buyTokenSymbol = ref()
    const tokenContract = useErc20Contract()
    const raiseState = ref({
      raiseAmount: 0,
      raiseGoal: 0,
      raisePercent: 0,
      swapAmount: 0
    })

    const router = useRouter()

    const toDetail = async (crowdfundingId: number, chainId: number) => {
      const isSupport = await checkSupportNetwork(chainId)
      if (isSupport) {
        router.push('/crowdfunding/' + crowdfundingId)
      }
    }

    // console.log(props.info.chainId, props.info.crowdfundingContract)
    const fundingContract = useCrowdfundingContract({
      chainId: props.info.chainId!,
      addresses: { [props.info.chainId!]: props.info.crowdfundingContract }
    })

    const walletStore = useWalletStore()
    const chainID = walletStore.chainId
    const getFundingState = async () => {
      // console.log('props.info', props.info)
      if (props.info.chainId == chainID) {
        const fundingContractState = await fundingContract.state('', '')
        raiseState.value.raiseGoal = Number(ethers.utils.formatEther(fundingContractState[0]))
        raiseState.value.raiseAmount = Number(ethers.utils.formatEther(fundingContractState[1]))
        raiseState.value.raisePercent =
          Number(formatToFloor(raiseState.value.raiseAmount / raiseState.value.raiseGoal, 4)) * 100
        raiseState.value.swapAmount = Number(ethers.utils.formatEther(fundingContractState[2]))
      } else {
        raiseState.value.raiseGoal = Number(props.info.raiseGoal)
        raiseState.value.raiseAmount = Number(props.info.raiseBalance)
        raiseState.value.raisePercent = Number(props.info.raisedPercent)
        raiseState.value.swapAmount = Number(props.info.swapPercent)
      }
    }

    const buyIsMainCoin = computed(() => {
      return props.info.sellTokenAddress === props.info.buyTokenAddress
    })
    // get buy token and sell token
    const getTokenName = async () => {
      if (props.info.chainId == chainID) {
        const sellRes = await tokenContract(props.info.sellTokenAddress)
        sellTokenSymbol.value = await sellRes.symbol()

        if (buyIsMainCoin.value) {
          buyTokenSymbol.value = getChainInfoByChainId(props.info.chainId)?.currencySymbol
        } else {
          const buyTokenRes = await tokenContract(props.info.buyTokenAddress)
          buyTokenSymbol.value = await buyTokenRes.symbol()
        }
      } else {
        sellTokenSymbol.value = props.info.sellTokenSymbol
        buyTokenSymbol.value = props.info.buyTokenSymbol
      }
    }

    onMounted(() => {
      getTokenName()
      getFundingState()
    })

    return () => (
      <div
        class="rounded-sm cursor-pointer py-4 px-4 hover:bg-color-hover"
        style="transition:background ease .3s"
        onClick={() => toDetail(props.info.crowdfundingId, props.info.chainId)}
      >
        <div class="flex overflow-hidden">
          <UStartupLogo src={props.info.poster} width="10" height="10" class="h-15 mr-3 w-15" />

          <div class="flex-1 overflow-hidden">
            <div class="flex mb-2 items-center">
              <div class="text-[#000] leading-7 truncate u-h3">{props.info.startupName}</div>

              <span
                class={[
                  'rounded-sm h-5 font-primary text-color2 ml-4 px-2 text-xs leading-1.25rem inline-block border-1 border-[#DADCE0]'
                ]}
              >
                {CROWDFUNDING_TYPES[props.info.status - 1]}
              </span>
            </div>
            <div class="border-b border-grey5">
              <div class="u-body2">
                <span class="text-color2 text-[14px]">Raise Goal：</span>
                <span class="font-primary text-xs text-primary">
                  <span class="font-semibold">{raiseState.value.raiseGoal}</span>
                  <span>{buyTokenSymbol.value}</span>
                </span>
                <span class="font-700 mx-2 text-color2">·</span>
                <span class="text-color2 text-[14px]">Progress：</span>
                <span class="font-primary text-xs text-primary">
                  <span class="text-primary">{raiseState.value.raiseAmount}</span>
                  <span>{buyTokenSymbol.value}</span>
                </span>
                <span class="font-primary text-xs text-primary">
                  ({raiseState.value.raisePercent} %)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
