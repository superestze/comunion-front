import { UCard } from '@comunion/components'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { defineComponent, PropType, ref, computed } from 'vue'
import { CoinType } from '../[id]'
import { getChainInfoByChainId } from '../utils'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn } from '@/services'
import { useWalletStore } from '@/stores'

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
      <UCard title="info">
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
            <div class="u-title2 mb-1">Crowdfunding detail：</div>
            <a class="u-body2 text-primary" target="__blank" href={props.info.detail}>
              {props.info.detail}
            </a>
          </div>
        )}
        <div class="u-body2 break-all mt-6 mb-10" v-html={props.info.description}></div>
        <div class="grid grid-cols-[220px,1fr] gap-y-6 u-body2">
          <div class="text-grey3">Crowdfunding Address :</div>
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
          <div class="u-body2 text-grey3">Token Name :</div>
          <div>{sellCoinInfo.value.name}</div>
          <div class="u-body2 text-grey3">Token Symbol :</div>
          <div>{sellCoinInfo.value.symbol}</div>
          <div class="u-body2 text-grey3">Token Decimals :</div>
          <div>{sellCoinInfo.value.decimal}</div>
          <div class="u-body2 text-grey3">Total Supply :</div>
          <div>
            {sellCoinInfo.value.supply} {sellCoinInfo.value.symbol}
          </div>
          <div class="u-body2 text-grey3">Token For Crowdfunding :</div>
          <div>
            {props.info.raiseGoal * props.info.buyPrice} {sellCoinInfo.value.symbol}
          </div>
          <div class="u-body2 text-grey3">IBO Rate :</div>
          <div>
            1 {buyCoinInfo.value.symbol} = {props.info.buyPrice} {sellCoinInfo.value.symbol}
          </div>
          <div class="u-body2 text-grey3">Swap :</div>
          <div>{props.info.swapPercent} %</div>
          <div class="u-body2 text-grey3">Sell Tax :</div>
          <div>{props.info.sellTax} %</div>
          <div class="u-body2 text-grey3">Maximum Sell :</div>
          <div>{props.info.maxSellPercent} % of the bought token amount</div>
          <div class="u-body2 text-grey3">Crowdfunding Start Time (UTC) :</div>
          <div>{dayjs.utc(props.info.startTime).format('YYYY-MM-DD HH:mm')}</div>
          <div class="u-body2 text-grey3">Crowdfunding End Time (UTC) :</div>
          <div>{dayjs.utc(props.info.endTime).format('YYYY-MM-DD HH:mm')}</div>
        </div>
      </UCard>
    )
  }
})
