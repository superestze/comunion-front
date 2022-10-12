import { services } from '@/services'

export function useComer(comerId: string) {
  const follow = () => {
    return services['account@comer-follow']({
      comerId
    })
  }

  const unfollow = () => {
    return services['account@comer-unfollow']({
      comerId
    })
  }

  const followByMe = () =>
    services['account@comer-followed-by-me']({
      comerId
    })

  return {
    follow,
    unfollow,
    followByMe
  }
}
