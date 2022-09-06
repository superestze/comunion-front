import { ref } from 'vue'
import { services } from '@/services'
import { StartupDetail } from '@/types'

export function useStartup() {
  const startup = ref<StartupDetail>()

  const get = async (startupId: string) => {
    if (startupId) {
      const { error, data } = await services['startup@startup-get']({
        startupId
      })
      if (!error) {
        startup.value = data
      }
      console.log(data)
    }
  }

  return {
    get,
    detail: startup
  }
}
