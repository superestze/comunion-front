import { UCard, UStartupLogo, UTable } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { CurrentResult } from './components/CurrentResult'
import StartupCard from './components/StartupCard'
import { StrategyInformation } from './components/StrategyInfo'
import { services } from '@/services'

const ProposalDetail = defineComponent({
  name: 'ProposalDetail',
  setup() {
    const startupInfo = ref()
    const pageLoading = ref(false)
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
    return {
      startupInfo,
      pageLoading
    }
  },
  render() {
    return (
      <div class="flex gap-x-6 mb-20">
        <div class="w-228 bg-white rounded-lg border border-grey5 p-10">
          <div></div>
          <div class="flex items-center">
            <UStartupLogo width="7" height="7" src="" />
          </div>
          <div></div>
          <div>
            <div class="u-title3">Discussion：</div>
            <div></div>
          </div>
          <div></div>
          <UTable>
            <thead>
              <tr>
                <th>Votes</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>123</td>
                <td>123</td>
                <td>123</td>
              </tr>
            </tbody>
          </UTable>
        </div>
        <div class="flex-1 min-w-111">
          {this.startupInfo && (
            <UCard class="mb-6">
              <StartupCard startup={this.startupInfo} />
            </UCard>
          )}
          <StrategyInformation class="mb-6" />
          <CurrentResult />
        </div>
      </div>
    )
  }
})

export default ProposalDetail
