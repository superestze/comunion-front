import { ref } from 'vue'
import { services } from '@/services'

export interface GroupItem {
  id: number
  name: string
  startupId?: number
  comerId?: number
  delete?: boolean
}

export function useGroup() {
  const group = ref<GroupItem[]>([])

  const get = async (startupID: string) => {
    if (startupID) {
      const { error, data } = await services['startup@startup-group-list']({
        startupID
      })
      if (!error) {
        group.value = data
      }
    }
  }

  return {
    get,
    group
  }
}
