import { message } from '@comunion/components'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOnLoggedIn } from '@/hooks'
import type { ServiceKeys } from '@/services'
import { services } from '@/services'
import type { UserResponse } from '@/types'

/**
 * return true when is local and false when is not, undefined for invalid
 */
export default function useCommonCallback(
  localCallbackPath: string,
  service: ServiceKeys | ((code: string) => Promise<UserResponse>)
) {
  const { push } = useRouter()
  const { query } = useRoute()
  const errMsg = ref<string | undefined>()
  const onLogin = useOnLoggedIn()

  onMounted(async () => {
    if (query.code && query.state) {
      const isLocal = (query.state as string).match(/^u([01])/)?.[1] === '0'
      if (isLocal && !window.location.origin.match(/http:\/\/localhost/)) {
        window.location.href = `http://localhost:9001/auth/callback/${localCallbackPath}?code=${query.code}&state=${query.state}`
      } else {
        let user: UserResponse | undefined
        if (typeof service === 'function') {
          user = await service(query.code as string)
        } else {
          const response = await services[service]({
            code: query.code as string,
            state: query.state as string,
            skipMessage: true
          })
          if (!response.error) {
            user = response.data
          } else if (response.error && response.code === 400) {
            message.error('The social account has been connected')
            push('/auth/association?type=account')
            return
          }
        }
        if (!user) {
          errMsg.value = 'Error when get user'
        } else {
          onLogin(user)
        }
      }
    } else {
      errMsg.value = 'Invalid url'
    }
  })
  return errMsg
}
