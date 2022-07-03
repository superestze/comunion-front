import { Options, useRequest } from 'vue-request'
import type { ServiceArg, ServiceKeys, ServiceReturn } from '@/services'
import { services } from '@/services'

export function useService<T extends ServiceKeys>(
  key: T,
  args: ServiceArg<T>,
  options?: Options<T, ServiceArg<T>>
): ReturnType<typeof useRequest> {
  return useRequest<ServiceReturn<T>, ServiceArg<T>>(() => services[key](args), options)
}
