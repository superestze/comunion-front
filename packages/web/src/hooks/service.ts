import {
  useRequest as useRequestService,
  usePagination as usePaginationService,
  useLoadMore as useLoadMoreService
} from 'vue-request'
import type { ServiceArg, ServiceKeys, ServiceReturn } from '@/services'
import { services } from '@/services'

export function useRequest<T extends ServiceKeys>(
  key: T,
  args: ServiceArg<T>,
  options?: object
): ReturnType<typeof useRequestService> {
  return useRequestService<ServiceReturn<T>, any>(() => services[key](args), {
    debounceInterval: 300,
    loadingDelay: 400,
    loadingKeep: 1000,
    ...options
  })
}

export function usePagination<T extends ServiceKeys>(
  key: T,
  args: ServiceArg<T>,
  options?: object
): ReturnType<typeof usePaginationService> {
  return usePaginationService<ServiceReturn<T>, any>(() => services[key](args), {
    debounceInterval: 300,
    loadingDelay: 400,
    loadingKeep: 1000,
    defaultParams: [
      {
        limit: 10
      }
    ],
    pagination: {
      currentKey: 'page',
      pageSizeKey: 'size',
      totalKey: 'data.total'
    },
    ...options
  })
}

type DataType = { list: any[]; [key: string]: any }
export function useLoadMore<T extends ServiceKeys>(
  key: T,
  args: ServiceArg<T>,
  options?: object
): ReturnType<typeof useLoadMoreService> {
  return useLoadMoreService<DataType>(
    async (params?: DataType) => {
      const _page = params?.page ? params.page + 1 : 1
      const { data } = await services[key]({ ...(args || {}), page: _page })
      if (!Array.isArray(data.list)) {
        console.warn(`Illegal interface return value: ${key}`)
      }
      return {
        ...data,
        list: Array.isArray(data.list) ? data.list : []
      }
    },
    {
      debounceInterval: 300,
      isNoMore: (res?: DataType) => {
        return res?.list?.length || 0 + res?.page || 0 * res?.size || 0 === res?.total || 0
      },
      ...options
    }
  )
}
