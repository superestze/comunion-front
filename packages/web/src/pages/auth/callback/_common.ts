import { useRoute } from 'vue-router'
import { useOnLoggedIn } from '@/hooks'
import type { ServiceKeys } from '@/services'
import { services } from '@/services'
import type { UserResponse } from '@/types'

/**
 * return true when is local and false when is not, undefined for invalid
 */
export default async function useCommonCallback(
  localCallbackPath: string,
  service: ServiceKeys | ((code: string) => Promise<UserResponse>)
) {
  const { query } = useRoute()
  const onLogin = useOnLoggedIn()
  if (query.code && query.state) {
    const isLocal = (query.state as string).match(/^u([01])/)?.[1] === '0'
    if (isLocal && !window.location.origin.match(/http:\/\/localhost/)) {
      window.location.href = `http://localhost:3000/auth/callback/${localCallbackPath}?code=${query.code}&state=${query.state}`
    } else {
      let user: UserResponse | undefined
      if (typeof service === 'function') {
        user = await service(query.code as string)
      } else {
        const { error, data } = await services[service]({ code: query.code as string })
        if (!error) {
          user = data
        }
      }
      if (!user) {
        return 'Error when get user'
      }
      onLogin(user)
    }
  }
  return 'Invalid url'
}
