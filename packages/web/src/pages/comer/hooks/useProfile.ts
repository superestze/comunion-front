import { computed, ref } from 'vue'
import { ServiceReturn } from '@/services'
import { useProfileStore } from '@/stores/profile'

export function useProfile(id?: string) {
  const profileStore = useProfileStore()
  const view = computed(() => typeof id === 'string' && id.length === 15)
  const loading = ref<boolean>(false)
  const getProfileData = () => {
    loading.value = true
    if (view.value) {
      profileStore.get(() => {
        loading.value = false
      }, id)
    } else {
      profileStore.get(() => {
        loading.value = false
      })
    }
  }

  const profile = computed<any>(() => {
    // when run getProfileData(), 'profile' should be null！
    if (loading.value) {
      return null
    }
    if (view.value) {
      return profileStore.someone?.comerProfile as unknown as NonNullable<
        ServiceReturn<'account@comer-profile-get'>
      >
    }
    return profileStore.detail as unknown as NonNullable<ServiceReturn<'account@comer-profile-get'>>
  })

  const socials = computed(() => {
    const result = []
    if (profile.value) {
      if (profile.value.website) {
        result.push(profile.value.website)
      }
      if (profile.value.discord) {
        result.push(profile.value.discord)
      }
      if (profile.value.facebook) {
        result.push(profile.value.facebook)
      }
      if (profile.value.linktree) {
        result.push(profile.value.linktree)
      }
      if (profile.value.telegram) {
        result.push(profile.value.telegram)
      }
      if (profile.value.twitter) {
        result.push(profile.value.twitter)
      }
      if (profile.value.email) {
        result.push(profile.value.email)
      }
      if (profile.value.medium) {
        result.push(profile.value.medium)
      }
    }
    return result
  })

  const socialsObj = computed(() => {
    return {
      website: profile.value?.website,
      discord: profile.value?.discord,
      facebook: profile.value?.facebook,
      linktree: profile.value?.linktree,
      telegram: profile.value?.telegram,
      twitter: profile.value?.twitter,
      email: profile.value?.email,
      medium: profile.value?.medium
    }
  })

  return {
    getProfileData,
    profile,
    view,
    loading,
    socials,
    socialsObj
  }
}
