import { UTag } from '@comunion/components'
import { ethers } from 'ethers'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UStartupLogo from '@/components/UStartupLogo'
import { CROWDFUNDING_TYPES } from '@/constants'
import { useErc20Contract, useCrowdfundingContract } from '@/contracts'
import { useWalletStore } from '@/stores'
import { CrowdfundingItem } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { formatToFloor } from '@/utils/numberFormat'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  name: 'CrowdfundingMiniCard',
  props: {
    info: {
      type: Object as PropType<CrowdfundingItem>,
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
      const isSupport = await checkSupportNetwork(chainId, () => {
        router.push('/crowdfunding/' + crowdfundingId)
      })
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
        raiseState.value.raisePercent = Number(
          formatToFloor((raiseState.value.raiseAmount / raiseState.value.raiseGoal) * 100, 4)
        )
        raiseState.value.swapAmount = Number(ethers.utils.formatEther(fundingContractState[2]))
      } else {
        raiseState.value.raiseGoal = Number(formatToFloor(Number(props.info.raiseGoal), 8))
        raiseState.value.raiseAmount = Number(formatToFloor(Number(props.info.raiseBalance), 8))
        raiseState.value.raisePercent = Number(
          formatToFloor(Number(props.info.raisedPercent) * 100, 4)
        )
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
        class="rounded-sm cursor-pointer flex py-4 px-4 items-center hover:bg-color-hover"
        onClick={() => toDetail(props.info.crowdfundingId, props.info.chainId)}
      >
        <UStartupLogo src={props.info.poster} class="h-15 mr-4 w-15" />

        <div class="flex-1 overflow-hidden">
          <div class="flex mb-2 items-center">
            <div class="text-color1 truncate u-h4">{props.info.startupName}</div>
            <UTag class="ml-4 text-color2">{CROWDFUNDING_TYPES[props.info.status - 1]}</UTag>
          </div>
          <div class="text-color3 u-h6">
            <span>Raise Goal：</span>
            <span class="text-primary">
              <span class="u-num1">{raiseState.value.raiseGoal}</span>
              <span>{buyTokenSymbol.value}</span>
            </span>
            <strong class=" mx-2">·</strong>
            <span>Progress：</span>
            <span class=" text-primary">
              <span class="u-num1">{raiseState.value.raiseAmount}</span>
              <span>{buyTokenSymbol.value}</span>({raiseState.value.raisePercent} %)
            </span>
          </div>
        </div>
      </div>
    )
  }
})
