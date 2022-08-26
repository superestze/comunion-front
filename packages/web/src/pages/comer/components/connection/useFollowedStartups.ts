import { ref } from 'vue'
import { ServiceReturn, services } from '@/services'

type AttrType<T> = T extends { rows: infer M } ? M : T

type ListType = AttrType<ServiceReturn<'account@followed-startups-by-comer'>>

export function useFollowedStartups(comerId: number) {
  const list = ref<NonNullable<ListType>>([])
  const total = ref<number>(0)
  const page = ref<number>(1)
  const limit = 5
  const getFollowList = async () => {
    const { error, data } = await services['account@followed-startups-by-comer']({
      limit,
      page: page.value,
      comerID: comerId
    })
    if (!error) {
      if (data.rows) {
        if (list.value) {
          list.value.push(...data.rows)
        } else {
          list.value = data.rows || []
        }
      } else {
        list.value = []
      }
      total.value = data.totalRows
    }
  }

  const connect = async (id: string, cb: () => void) => {
    const { error } = await services['startup@startup-follow']({ startupId: id })
    if (!error) {
      cb()
    }
  }

  const unconnect = async (id: string, cb: () => void) => {
    const { error } = await services['startup@startup-unfollow']({ startupId: id })
    if (!error) {
      cb()
    }
  }

  const reset = () => {
    list.value = []
    total.value = 0
  }

  return {
    list,
    total,
    page,
    getFollowList,
    connect,
    unconnect,
    reset
  }
}
