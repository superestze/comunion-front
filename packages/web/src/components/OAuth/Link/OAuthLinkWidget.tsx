import { UButton, UModal } from '@comunion/components'
import { GithubFilled, GoogleFilled } from '@comunion/icons'
import { defineComponent, ref, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import CardContent from '../CardContent'
import OAuthLinkBtn from './OAuthLinkBtn'
import { services } from '@/services'
import { useProfileStore } from '@/stores/profile'

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

type AccountMap = {
  [key: number]: string
}

const accountMap: AccountMap = {
  1: 'Github',
  2: 'Google'
}

export default defineComponent({
  name: 'OAuthLinkWidget',
  props: {
    comerAccounts: {
      type: Array as PropType<ComerAccount[]>,
      required: true
    }
  },
  setup(props) {
    const { push } = useRouter()
    const loading = ref<boolean>(false)
    const profileStore = useProfileStore()
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

    const unBindVisible = ref<boolean>(false)
    const currentUnbindAccountId = ref<number>(-1)

    const handleGoogleLink = (accountId: number) => () => {
      if (linked.value.google.linked) {
        unBindVisible.value = true
        currentUnbindAccountId.value = accountId
        return
      }
      push('/auth/association?type=account')
    }

    const handleGithubLink = (accountId: number) => () => {
      unBindVisible.value = true
      if (linked.value.github.linked) {
        unBindVisible.value = true
        currentUnbindAccountId.value = accountId
        return
      }
      push('/auth/association?type=account')
    }

    const triggerUnbindDialog = () => {
      unBindVisible.value = !unBindVisible.value
    }

    const unBindAccount = () => {
      loading.value = true
      services['account@account-unlink']({ accountID: currentUnbindAccountId.value })
        .then(() => {
          profileStore.get().then(() => {
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
            title="Associating existing accounts"
            config={{ width: 524 }}
            v-slots={{
              content: () => (
                <p>
                  Do you want split association with {accountMap[currentUnbindAccountId.value]}{' '}
                  Account?
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
