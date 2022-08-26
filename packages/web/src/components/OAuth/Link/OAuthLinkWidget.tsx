import { UButton, UModal } from '@comunion/components'
import { GithubFilled, GoogleFilled } from '@comunion/icons'
import { storage } from '@comunion/utils'
import { defineComponent, ref, PropType, computed } from 'vue'
import CardContent from '../CardContent'
import useOAuth from '../Hooks/useOAuth'
import OAuthLinkBtn from './OAuthLinkBtn'
import { services } from '@/services'
import { useUserStore } from '@/stores'
import { useProfileStore } from '@/stores/profile'
import { UserResponse } from '@/types'

export type ComerAccount = {
  linked: boolean
  accountType: number
  accountId: number
}

type Linked = {
  github: {
    linked: boolean
    accountId: number
  }
  google: {
    linked: boolean
    accountId: number
  }
}

// type AccountMap = {
//   [key: number]: string
// }

// const accountMap: AccountMap = {
//   1: 'Github',
//   2: 'Google'
// }

export default defineComponent({
  name: 'OAuthLinkWidget',
  props: {
    comerAccounts: {
      type: Array as PropType<ComerAccount[]>,
      required: true
    }
  },
  setup(props) {
    const loading = ref<boolean>(false)
    const profileStore = useProfileStore()
    const { googleLogin, githubLogin } = useOAuth()
    const cantUnbind = ref<boolean>(false)
    const userStore = useUserStore()
    const linked = computed(() => {
      const obj: Linked = {
        google: {
          linked: false,
          accountId: 0
        },
        github: {
          linked: false,
          accountId: 0
        }
      }
      props.comerAccounts.forEach(item => {
        if (item.accountType === 1) {
          obj.github = {
            linked: item.linked,
            accountId: item.accountId
          }
        }
        if (item.accountType === 2) {
          obj.google = {
            linked: item.linked,
            accountId: item.accountId
          }
        }
      })
      return obj
    })

    const onlyOneBound = computed(() => {
      let count = 0
      const profile = userStore.profile as UserResponse
      props.comerAccounts.forEach(item => {
        if (item.linked) {
          count += 1
        }
      })
      return count === 1 && profile.address === ''
    })

    const unBindVisible = ref<boolean>(false)
    const currentUnbindAccountId = ref<number>(-1)

    const handleGoogleLink = (accountId: number) => () => {
      if (linked.value.google.linked) {
        if (onlyOneBound.value) {
          cantUnbind.value = true
          return
        }
        unBindVisible.value = true
        currentUnbindAccountId.value = accountId
        return
      }
      storage('session').set('link:btn', 'google')
      googleLogin()
    }

    const handleGithubLink = (accountId: number) => () => {
      if (linked.value.github.linked) {
        if (onlyOneBound.value) {
          cantUnbind.value = true
          return
        }
        unBindVisible.value = true
        currentUnbindAccountId.value = accountId
        return
      }
      storage('session').set('link:btn', 'github')
      githubLogin()
    }

    const triggerUnbindDialog = () => {
      unBindVisible.value = !unBindVisible.value
    }

    const triggerCantUnbindDialog = () => {
      cantUnbind.value = !cantUnbind.value
    }

    const unBindAccount = () => {
      loading.value = true
      services['account@oauth-account-unlink']({ accountID: currentUnbindAccountId.value })
        .then(() => {
          profileStore.get(() => {
            unBindVisible.value = false
          })
        })
        .finally(() => {
          loading.value = false
        })
    }

    return () => (
      <>
        <UModal show={unBindVisible.value}>
          <CardContent
            title="Unbind Account"
            config={{ width: 524 }}
            v-slots={{
              content: () => (
                <p>
                  After unbinding, you will not be able to sign in to the Comunion account with this
                  social account.
                </p>
              ),
              footer: () => (
                <div class="flex justify-end mt-40px">
                  <UButton onClick={triggerUnbindDialog} disabled={loading.value} class="w-160px">
                    Cancel
                  </UButton>
                  <UButton
                    type="primary"
                    class="ml-10px w-160px"
                    onClick={unBindAccount}
                    disabled={loading.value}
                  >
                    Sure
                  </UButton>
                </div>
              )
            }}
          />
        </UModal>
        <UModal show={cantUnbind.value}>
          <CardContent
            title="Tips"
            config={{ width: 524 }}
            v-slots={{
              content: () => (
                <p>
                  Please connect your wallet account before canceling the social account Association
                  ！
                </p>
              ),
              footer: () => (
                <div class="flex justify-end mt-40px">
                  <UButton
                    type="primary"
                    class="ml-10px w-160px"
                    onClick={triggerCantUnbindDialog}
                    disabled={false}
                  >
                    Sure
                  </UButton>
                </div>
              )
            }}
          />
        </UModal>
        <div class="mr-4">
          <OAuthLinkBtn
            onTriggerClick={handleGoogleLink(linked.value?.google.accountId)}
            disabled={false}
          >
            <GoogleFilled class="w-5 h-5 mr-3.5 text-primary" />
            <span class="u-title2 text-primary">
              {linked.value?.google.linked ? 'Linked' : 'Link'}
            </span>
          </OAuthLinkBtn>
        </div>
        <div class="mr-4">
          <OAuthLinkBtn
            onTriggerClick={handleGithubLink(linked.value?.github.accountId)}
            disabled={false}
          >
            <GithubFilled class="w-5 h-5 mr-3.5 text-primary" />
            <span class="u-title2 text-primary">
              {linked.value?.github.linked ? 'Linked' : 'Link'}
            </span>
          </OAuthLinkBtn>
        </div>
      </>
    )
  }
})
