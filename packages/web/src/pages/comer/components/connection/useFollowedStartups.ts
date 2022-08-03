import { ref } from 'vue'
import { ServiceReturn, services } from '@/services'

type AttrType<T> = T extends { list: infer M } ? M : T

type ListType = AttrType<ServiceReturn<'startup@startup-list-followed'>>

export function useFollowedStartups() {
  const list = ref<ListType>([])
  const total = ref<number>(0)
  const offset = ref<number>(0)
  const getFollowList = async (offset: number) => {
    const { error, data } = await services['startup@startup-list-followed']({
      limit: offset + 5,
      offset,
      keyword: null,
      mode: null
    })
    if (!error) {
      if (data.list) {
        if (list.value) {
          list.value.push(...data.list)
        } else {
          list.value = data.list
        }
      } else {
        list.value = []
      }
      total.value = data.total
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

  return {
    list: list.value,
    total: total.value,
    offset,
    getFollowList,
    connect,
    unconnect
  }
}
