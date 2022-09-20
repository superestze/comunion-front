import { UBreadcrumb, UCard, USpin } from '@comunion/components'
import { ethers } from 'ethers'
import { defineComponent, onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CrowdfundingInfo } from './components/CrowdfundingInfo'
import { IBORateHistory } from './components/IBORateHistory'
import { Invest } from './components/Invest'
import { InvestmentRecords, InvestmentsRecordsExpose } from './components/InvestmentRecords'
import StartupCard from '@/components/StartupCard'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useWalletStore } from '@/stores'
import { getChainInfoByChainId } from '@/utils/etherscan'

export type CoinType = {
  name?: string
  symbol?: string
  address?: string
  balance?: string
  decimal?: number
  supply?: string
}

const CrowdfundingDetail = defineComponent({
  name: 'CrowdfundingDetail',
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const walletStore = useWalletStore()

    const investRecordsRef = ref<InvestmentsRecordsExpose>()
    const crowdfundingInfo = ref<ServiceReturn<'crowdfunding@detail'>>()
    const startupInfo = ref()
    const buyCoinInfo = ref<CoinType>({ name: '', address: '' })
    const sellCoinInfo = ref<CoinType>({ name: '', address: '' })
    const pageLoading = ref(false)
    const tokenContract = useErc20Contract()
    computed(() => {
      if (
        crowdfundingInfo.value?.chainId &&
        walletStore.chainId !== crowdfundingInfo.value?.chainId
      ) {
        walletStore.wallet?.switchNetwork(crowdfundingInfo.value?.chainId)
      }
    })
    const getStartupInfo = async (startupId: number) => {
      try {
        pageLoading.value = true
        const { error, data } = await services['startup@startup-get']({ startupId })
        if (!error) {
          // The wallet switching chain operation on the details page will return to the list page
          if (data.chainID != walletStore.chainId) {
            router.push('/crowdfunding/list')
            return
          }

          startupInfo.value = {
            ...data,
            title: data.name,
            tag: data.hashTags.map(e => e.name)
          }
        }
        pageLoading.value = false
      } catch (error) {
        pageLoading.value = false
        console.error('error===>', error)
      }
    }

    const getCrowdfundingInfo = async (crowdfundingId: number) => {
      try {
        pageLoading.value = true
        const { error, data } = await services['crowdfunding@detail']({ crowdfundingId })
        if (!error) {
          crowdfundingInfo.value = data
          if (data?.comerId) {
            getStartupInfo(data?.startupId)
            getTokenName()
          }
        }
        pageLoading.value = false
      } catch (error) {
        pageLoading.value = false
        console.error('getCrowdfundingInfo', error)
      }
    }

    const buyIsMainCoin = computed(() => {
      return crowdfundingInfo.value!.sellTokenContract === crowdfundingInfo.value!.buyTokenContract
    })

    const getTokenName = async () => {
      const sellRes = await tokenContract(crowdfundingInfo.value!.sellTokenContract!)
      const [name, decimal, supply, symbol, balance] = await Promise.all([
        sellRes.name(),
        sellRes.decimals(),
        sellRes.totalSupply(),
        sellRes.symbol(),
        sellRes.balanceOf(walletStore.address)
      ])

      sellCoinInfo.value.name = name
      sellCoinInfo.value.decimal = decimal
      sellCoinInfo.value.supply = ethers.utils.formatEther(supply.toString()).toString()
      sellCoinInfo.value.symbol = symbol
      sellCoinInfo.value.balance = ethers.utils.formatUnits(balance, decimal)

      if (buyIsMainCoin.value) {
        buyCoinInfo.value.symbol = getChainInfoByChainId(
          crowdfundingInfo.value!.chainId
        )?.currencySymbol
        buyCoinInfo.value.balance = await walletStore.getBalance(walletStore.address!)
      } else {
        const buyTokenRes = await tokenContract(crowdfundingInfo.value!.buyTokenContract)
        const [buyName, buyDecimal, buySymbol, buyBalance] = await Promise.all([
          await buyTokenRes.name(),
          await buyTokenRes.decimals(),
          await buyTokenRes.symbol(),
          await buyTokenRes.balanceOf(walletStore.address)
        ])
        buyCoinInfo.value.name = buyName
        buyCoinInfo.value.decimal = buyDecimal
        buyCoinInfo.value.symbol = buySymbol
        buyCoinInfo.value.balance = ethers.utils.formatUnits(buyBalance, decimal)
      }
    }

    const initPage = async () => {
      getTokenName()
      investRecordsRef.value?.getInvestRecord()
    }

    onMounted(() => {
      getCrowdfundingInfo(Number(route.params.id))
    })

    return () => (
      <USpin show={pageLoading.value}>
        <UBreadcrumb class="mt-10 mb-10"></UBreadcrumb>
        <div class="flex mb-20 gap-6">
          <div style="flex:2" class="overflow-hidden">
            {crowdfundingInfo.value && (
              <Invest
                class="mb-6"
                buyCoinInfo={buyCoinInfo.value}
                sellCoinInfo={sellCoinInfo.value}
                info={crowdfundingInfo.value}
                onRefreshCoin={initPage}
              />
            )}

            {crowdfundingInfo.value && <CrowdfundingInfo info={crowdfundingInfo.value} />}
          </div>

          <div class="flex-1 overflow-hidden">
            {startupInfo.value && (
              <UCard class="mb-6">
                <StartupCard startup={startupInfo.value} />
              </UCard>
            )}

            <InvestmentRecords
              class="mb-6"
              ref={(ref: any) => (investRecordsRef.value = ref)}
              buyTokenName={buyCoinInfo.value.symbol}
              sellTokenName={sellCoinInfo.value.symbol}
            />

            <IBORateHistory />
          </div>
        </div>
      </USpin>
    )
  }
})

export default CrowdfundingDetail
