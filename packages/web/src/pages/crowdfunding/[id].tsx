import { UCard } from '@comunion/components'
import { defineComponent, onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import StartupCard from '../bounty/detail/components/StartupCard'
import { CrowdfundingInfo } from './components/CrowdfundingInfo'
import { IBORateHistory } from './components/IBORateHistory'
import { Invest } from './components/Invest'
import { InvestmentRecords } from './components/InvestmentRecords'
import { ServiceReturn, services } from '@/services'
import { useWalletStore } from '@/stores'

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
    const route = useRoute()
    const crowdfundingInfo = ref<ServiceReturn<'crowdfunding@detail'>>()
    const startupInfo = ref()
    const walletStore = useWalletStore()
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
        const { error, data } = await services['startup@startup-get']({ startupId })
        console.log('startupInfo==>', error, data)
        if (!error) {
          console.log('执行-----')
          startupInfo.value = data
        }
      } catch (error) {
        console.error('error===>', error)
      }
    }

    const getCrowdfundingInfo = async (crowdfundingId: number) => {
      try {
        const { error, data } = await services['crowdfunding@detail']({ crowdfundingId })
        if (!error) {
          crowdfundingInfo.value = data
          if (data?.comerId) {
            getStartupInfo(data?.startupId)
          }
        }
      } catch (error) {
        console.error('getCrowdfundingInfo', error)
      }
    }

    onMounted(() => {
      getCrowdfundingInfo(Number(route.params.id))
    })

    return () => (
      <div class="flex mb-20 gap-6">
        <div class="w-228">
          {crowdfundingInfo.value && <Invest info={crowdfundingInfo.value} />}
          {crowdfundingInfo.value && <CrowdfundingInfo info={crowdfundingInfo.value} />}
        </div>
        <div class="flex-1">
          {startupInfo.value && (
            <UCard class="mb-6">
              <StartupCard startup={startupInfo.value} />
            </UCard>
          )}
          <IBORateHistory
            class="mb-6"
            historyRecords={
              [
                // {
                //   buyPrice: '60',
                //   buyTokenName: 'USDC',
                //   sellTokenName: 'UVU',
                //   swapPercent: '80',
                //   createdTime: +new Date()
                // },
                // {
                //   buyPrice: '60',
                //   buyTokenName: 'USDC',
                //   sellTokenName: 'UVU',
                //   swapPercent: '80',
                //   createdTime: +new Date()
                // }
              ]
            }
          />
          <InvestmentRecords
            records={
              [
                // {
                //   avatar: '',
                //   comerName: '12',
                //   amount: '22',
                //   buyTokenName: 'USDC',
                //   sellTokenName: 'NSEL',
                //   recordType: '',
                //   createdTime: +new Date().toString()
                // }
              ]
            }
          />
        </div>
      </div>
    )
  }
})

export default CrowdfundingDetail
