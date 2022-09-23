import { computed, reactive } from 'vue'
import { services } from '@/services'

export function useTabs(comerId: number) {
  const converset = (numeric: number) => {
    const result = numeric % 10000
    if (result === numeric) {
      return numeric
    }
    return `${(numeric / 10000).toFixed(1)}w`
  }

  const count = reactive({
    startupCnt: 0,
    comerCnt: 0,
    followerCnt: 0
  })

  services['account@connected-count']({
    comerID: comerId
  }).then(response => {
    const { error, data } = response
    if (!error) {
      count.startupCnt = data.startupCnt
      count.comerCnt = data.comerCnt
      count.followerCnt = data.followerCnt
    }
  })

  const tabs = computed(() => [
    {
      id: '0',
      title: 'Startup',
      totalRows: converset(count.startupCnt)
    },
    {
      id: '1',
      title: 'Comer',
      totalRows: converset(count.comerCnt)
    },
    {
      id: '2',
      title: 'Connector',
      totalRows: converset(count.followerCnt)
    }
  ])
  return {
    tabs
  }
}
