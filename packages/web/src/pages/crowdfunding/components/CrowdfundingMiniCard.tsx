import { UStartupLogo } from '@comunion/components'
import { ethers } from 'ethers'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CROWDFUNDING_TYPES } from '@/constants'
import { useErc20Contract, useCrowdfundingContract } from '@/contracts'
import { CrowdfundingStatus } from '@/pages/crowdfunding/utils'
import { ServiceReturn } from '@/services'
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

    const getFundingState = async () => {
      const fundingContractState = await fundingContract.state('', '')
      raiseState.value.raiseGoal = Number(ethers.utils.formatEther(fundingContractState[0]))
      raiseState.value.raiseAmount = Number(ethers.utils.formatEther(fundingContractState[1]))
      raiseState.value.raisePercent =
        Number(formatToFloor(raiseState.value.raiseAmount / raiseState.value.raiseGoal, 4)) * 100
      raiseState.value.swapAmount = Number(ethers.utils.formatEther(fundingContractState[2]))
    }

    const buyIsMainCoin = computed(() => {
      return props.info.sellTokenAddress === props.info.buyTokenAddress
    })
    // get buy token and sell token
    const getTokenName = async () => {
      const sellRes = await tokenContract(props.info.sellTokenAddress)
      sellTokenSymbol.value = await sellRes.symbol()

      if (buyIsMainCoin.value) {
        buyTokenSymbol.value = getChainInfoByChainId(props.info.chainId)?.currencySymbol
      } else {
        const buyTokenRes = await tokenContract(props.info.buyTokenAddress)
        buyTokenSymbol.value = await buyTokenRes.symbol()
      }
    }

    const getStatusLabelStyle = computed(() => {
      const statusClassMap = {
        [CrowdfundingStatus.UPCOMING]: 'bg-success ',
        [CrowdfundingStatus.LIVE]: 'bg-[#00BFA5] ',
        [CrowdfundingStatus.ENDED]: 'bg-warning',
        [CrowdfundingStatus.CANCELED]: 'bg-grey5'
      }
      return statusClassMap[props.info.status as keyof typeof statusClassMap]
    })

    onMounted(() => {
      getTokenName()
      getFundingState()
    })

    return () => (
      <div
        class="py-4 hover:bg-[#F0F0F0]  hover:w-[102%] hover:ml-[-1%] hover:pl-[1%] hover:pr-[1%]"
        style="transition:background ease .3s"
        onClick={() => toDetail(props.info.crowdfundingId, props.info.chainId)}
      >
        <div class="flex overflow-hidden">
          <UStartupLogo
            src={props.info.poster}
            width="10"
            height="10"
            class="rounded-lg h-15 mr-3 w-15"
          />

          <div class="flex-1 overflow-hidden">
            <div class="flex mb-2 items-center">
              <div class="u-h3 text-[#000] leading-7 truncate">{props.info.startupName}</div>

              <span
                class={[
                  'rounded-lg h-5 font-primary text-color2 ml-4 px-2 text-xs leading-1.25rem inline-block border-1 border-[#DADCE0]'
                ]}
              >
                {CROWDFUNDING_TYPES[props.info.status - 1]}
              </span>
            </div>
            <div class="border-b border-grey5">
              <div class="u-body2">
                <span class="text-color2 text-[14px]">Raise Goal：</span>
                <span class="text-xs text-primary font-primary">
                  <span class="font-semibold">{raiseState.value.raiseGoal}</span>
                  <span>{buyTokenSymbol.value}</span>
                </span>
                <span class="font-700 mx-2 text-color2">·</span>
                <span class="text-color2 text-[14px]">Progress：</span>
                <span class="text-xs text-primary font-primary">
                  <span class="text-primary">{raiseState.value.raiseAmount}</span>
                  <span>{buyTokenSymbol.value}</span>
                </span>
                <span class="text-xs text-primary font-primary">
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
