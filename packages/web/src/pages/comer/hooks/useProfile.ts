import { computed, ref } from 'vue'
import { services } from '@/services'
import { useUserStore } from '@/stores'
import type { UserProfileState } from '@/types'

const userStore = useUserStore()

export function useProfile(comerId?: string) {
  const currentComerProfile = ref<UserProfileState | null>(null)

  userStore.getComerProfile().then(res => {
    currentComerProfile.value = res
  })

  const viewMode = computed(
    () => !!comerId && String(currentComerProfile.value?.comerID) !== comerId
  )
  const loading = ref<boolean>(false)

  const profile = ref<UserProfileState | null>(null)

  async function getProfileData(reload = false) {
    if (!reload && profile.value) {
      return profile.value
    }
    profile.value = null
    if (viewMode.value) {
      const { error, data } = await services['account@comer-info-get']({ comerId })
      if (!error) {
        profile.value = data.comerProfile || null
      }
    } else {
      profile.value = await userStore.getComerProfile(reload)
    }
    return profile.value
  }

  // init
  // viewMode need reload
  getProfileData(viewMode.value)

  return {
    getProfileData,
    profile,
    viewMode,
    loading
  }
}
