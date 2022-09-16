import { UCard } from '@comunion/components'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { defineComponent, PropType, ref, computed } from 'vue'
import { CoinType } from '../[id]'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn } from '@/services'
import { useWalletStore } from '@/stores'
import { getChainInfoByChainId } from '@/utils/etherscan'

export const CrowdfundingInfo = defineComponent({
  name: 'CrowdfundingInfo',
  props: {
    info: {
      type: Object as PropType<NonNullable<ServiceReturn<'crowdfunding@detail'>>>,
      required: true
    }
  },
  setup(props) {
    const { chainId } = useWalletStore()
    const networkInfo = getChainInfoByChainId(chainId!)
    const buyCoinInfo = ref<CoinType>({})
    const sellCoinInfo = ref<CoinType>({})

    const tokenContract = useErc20Contract()

    const buyIsMainCoin = computed(() => {
      return props.info.sellTokenContract === props.info.buyTokenContract
    })

    const getTokenInfo = async (sellTokenContract: string) => {
      const sellRes = await tokenContract(sellTokenContract)
      // const [name, decimal, supply, symbol] = await Promise.all([
      return await Promise.all([
        sellRes.name(),
        sellRes.decimals(),
        sellRes.totalSupply(),
        sellRes.symbol()
      ])
    }

    const getSellTokenInfo = async () => {
      const [name, decimal, supply, symbol] = await getTokenInfo(props.info.sellTokenContract!)
      sellCoinInfo.value.name = name
      sellCoinInfo.value.decimal = decimal
      sellCoinInfo.value.supply = ethers.utils.formatEther(supply.toString()).toString()
      sellCoinInfo.value.symbol = symbol
    }

    const getBuyTokenInfo = async () => {
      if (buyIsMainCoin) {
        buyCoinInfo.value.symbol = getChainInfoByChainId(props.info.chainId)?.currencySymbol
      } else {
        const [name, decimal, supply, symbol] = await getTokenInfo(props.info.buyTokenContract!)
        buyCoinInfo.value.name = name
        buyCoinInfo.value.decimal = decimal
        buyCoinInfo.value.supply = ethers.utils.formatEther(supply.toString()).toString()
        buyCoinInfo.value.symbol = symbol
      }
    }

    const youtubeId = computed(() => {
      if (props.info.youtube) {
        const { search } = new URL(props.info.youtube)
        return search.replace('?v=', '')
      }
      return ''
    })

    getBuyTokenInfo()
    getSellTokenInfo()

    return () => (
      <UCard title="INFO">
        {props.info.youtube && (
          <div class="mb-6">
            <iframe
              class="rounded-lg"
              width="100%"
              height="320"
              src={`https://www.youtube.com/embed/${youtubeId.value}`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        )}
        {props.info.detail && (
          <div class="mb-6">
            <div class="mb-1 u-title2">dCrowdfunding detail：</div>
            <a class="text-primary u-body2" target="__blank" href={props.info.detail}>
              {props.info.detail}
            </a>
          </div>
        )}
        <div class="mt-6 mb-10 break-all u-body2" v-html={props.info.description}></div>
        <div class="grid gap-y-6 grid-cols-[220px,1fr] u-body2">
          <div class="text-grey3">dCrowdfunding Address :</div>
          <div class="text-primary">
            <a
              target="_blank"
              href={
                networkInfo?.explorerUrl
                  ? `${networkInfo?.explorerUrl}/address/${props.info.crowdfundingContract}`
                  : '#'
              }
            >
              {props.info.crowdfundingContract}
            </a>
          </div>
          <div class="text-grey3">Team Wallet Address :</div>
          <div class="text-primary">
            <a
              target="_blank"
              href={
                networkInfo?.explorerUrl
                  ? `${networkInfo?.explorerUrl}/address/${props.info.teamWallet}`
                  : '#'
              }
            >
              {props.info.teamWallet}
            </a>
          </div>
          <div class="text-grey3">Token Contract :</div>
          <div class="text-primary">
            <a
              target="_blank"
              href={
                networkInfo?.explorerUrl
                  ? `${networkInfo?.explorerUrl}/address/${props.info.sellTokenContract}`
                  : '#'
              }
            >
              {props.info.sellTokenContract}
            </a>
          </div>
          <div class="text-grey3 u-body2">Token Name :</div>
          <div>{sellCoinInfo.value.name}</div>
          <div class="text-grey3 u-body2">Token Symbol :</div>
          <div>{sellCoinInfo.value.symbol}</div>
          <div class="text-grey3 u-body2">Token Decimals :</div>
          <div>{sellCoinInfo.value.decimal}</div>
          <div class="text-grey3 u-body2">Total Supply :</div>
          <div>
            {sellCoinInfo.value.supply} {sellCoinInfo.value.symbol}
          </div>
          <div class="text-grey3 u-body2">Token For dCrowdfunding :</div>
          <div>
            {props.info.raiseGoal * props.info.buyPrice} {sellCoinInfo.value.symbol}
          </div>
          <div class="text-grey3 u-body2">Rate :</div>
          <div>
            1 {buyCoinInfo.value.symbol} = {props.info.buyPrice} {sellCoinInfo.value.symbol}
          </div>
          <div class="text-grey3 u-body2">Swap :</div>
          <div>{props.info.swapPercent} %</div>
          <div class="text-grey3 u-body2">Sell Tax :</div>
          <div>{props.info.sellTax} %</div>
          <div class="text-grey3 u-body2">Maximum Sell :</div>
          <div>{props.info.maxSellPercent} % of the bought token amount</div>
          <div class="text-grey3 u-body2">dCrowdfunding Start Time (UTC) :</div>
          <div>{dayjs.utc(props.info.startTime).format('YYYY-MM-DD HH:mm')}</div>
          <div class="text-grey3 u-body2">dCrowdfunding End Time (UTC) :</div>
          <div>{dayjs.utc(props.info.endTime).format('YYYY-MM-DD HH:mm')}</div>
        </div>
      </UCard>
    )
  }
})
