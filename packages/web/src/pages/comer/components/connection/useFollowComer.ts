import { ref } from 'vue'
import { useComer } from '../../hooks/comer'
import { ServiceReturn, services } from '@/services'

type AttrType<T> = T extends { rows: infer M } ? M : T
type ListType = AttrType<ServiceReturn<'account@followers-of-comer'>>

export function useFollowComer(comerId: number) {
  console.warn('useFollowComer comerId=', comerId)
  const list = ref<NonNullable<ListType>>([])
  const total = ref<number>(0)
  const page = ref<number>(1)
  const limit = 5

  const getFollowList = async () => {
    services['account@followed-by-comer']({
      page: page.value,
      limit,
      comerID: comerId
    }).then(response => {
      const { error, data } = response
      if (!error) {
        if (data.rows) {
          if (list.value) {
            list.value.push(...data.rows)
          } else {
            list.value = (data.rows || []) as NonNullable<ListType>
          }
        } else {
          list.value = []
        }
      }
      total.value = data?.totalRows || 0
    })
  }

  const connect = async (id: string, cb: () => void) => {
    const comerService = useComer(id)
    const { error } = await comerService.follow()
    if (!error) {
      cb()
    }
  }

  const unconnect = async (id: string, cb: () => void) => {
    const comerService = useComer(id)
    const { error } = await comerService.unfollow()
    if (!error) {
      cb()
    }
  }

  const reset = () => {
    total.value = 0
    list.value = []
  }

  return {
    list,
    total,
    reset,
    getFollowList,
    connect,
    unconnect,
    page
  }
}
