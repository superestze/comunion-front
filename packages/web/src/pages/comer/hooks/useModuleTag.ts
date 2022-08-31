import { reactive } from 'vue'
import { services } from '@/services'

export function useModuleTag() {
  const tagCount = reactive<Record<string, number>>({
    startupCnt: 0,
    bountyCnt: 0,
    crowdfundingCnt: 0,
    proposalCnt: 0
  })

  const getData = async (comerId: number, type: number) => {
    const { error, data } = await services['account@data-count']({
      comerID: comerId,
      type
    })
    if (!error) {
      tagCount.startupCnt = data.startupCnt
      tagCount.bountyCnt = data.bountyCnt
      tagCount.crowdfundingCnt = data.crowdfundingCnt
      tagCount.proposalCnt = data.proposalCnt
    }
  }

  return {
    tagCount,
    getData
  }
}
