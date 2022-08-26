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

  const profile = computed<ServiceReturn<'account@comer-profile-get'>>(() => {
    if (view.value) {
      return profileStore.someone
        ?.comerProfile as unknown as ServiceReturn<'account@comer-profile-get'>
    }
    return profileStore.value
  })

  return {
    getProfileData,
    profile,
    view,
    loading
  }
}
