import { services } from '@/services'

export function useStartupProfile() {
  const getUserIsFollow = async (startupId: string) => {
    return new Promise((resolve, reject) => {
      services['startup@startup-followed-by-me']({
        startupId
      }).then(res => {
        const { error, data } = res
        if (!error) {
          if (data.isFollowed) {
            resolve('ok')
          } else {
            reject()
            return
          }
          resolve('ok')
          return
          // userIsFollow.value = data!.isFollowed
        }
        reject()
      })
    })
  }

  const toggleFollowStartup = (type: string, startupId: string) => {
    return new Promise<any>((resolve, reject) => {
      services[type === 'follow' ? 'startup@startup-follow' : 'startup@startup-unfollow']({
        startupId
      }).then(res => {
        const { error } = res
        if (!error) {
          resolve(getUserIsFollow(startupId))
          return
        }
        reject()
      })
    })
  }
  return {
    toggleFollowStartup,
    getUserIsFollow
  }
}
