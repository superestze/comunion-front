import { reactive, readonly } from 'vue'
import type { ServiceArg, ServiceKeys, ServiceReturn } from '@/services'
import { services } from '@/services'

export function useRequest(key: ServiceKeys) {
  const response = reactive<{
    error: boolean
    loading: boolean
    data: ServiceReturn<typeof key>
  }>({
    error: false,
    loading: false,
    data: null
  })
  const readonlyResp = readonly(response)

  async function run(args: ServiceArg<typeof key>) {
    response.loading = true
    const { error, data } = await services[key](args)
    response.error = error
    response.data = data
    return { error, data }
  }

  return {
    run,
    loading: readonlyResp.loading,
    error: readonlyResp.error,
    data: readonlyResp.data
  }
}
