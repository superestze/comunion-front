import { UButton } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBountyContractWrapper } from '../../hooks/useBountyContractWrapper'
import useBountyDetail from '../../hooks/useBountyDetail'
import Basic from './basic'
import { services } from '@/services'
import { useUserStore } from '@/stores'
import { checkSupportNetwork } from '@/utils/wallet'

export type VisibleMap = {
  visibleUnapproveConfirm: boolean
  visibleUnapproveFail: boolean
}

export const UnapprovePromptSet = defineComponent({
  props: {
    visibleMap: {
      type: Object as PropType<VisibleMap>,
      require: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  setup() {
    const route = useRoute()
    const userStore = useUserStore()
    const { bountyContract } = useBountyContractWrapper()
    const { unapproveApplicant } = bountyContract
    const bountySection = useBountyDetail(String(route.params.id))

    const profile = computed(() => {
      return userStore.profile
    })

    return {
      profile,
      unapproveApplicant,
      bountySection,
      route
    }
  },
  render() {
    const address = this.bountySection.approvedPeople.value?.address
    const closeUnapproveConfirm = () => {
      this.visibleMap!.visibleUnapproveConfirm = false
    }
    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        closeUnapproveConfirm()
        return
      }

      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      if (!address) {
        return
      }
      await this.unapproveApplicant(address, '', '')
      const { error } = await services['bounty@bounty-founder-unapprove']({
        bountyID: this.route.params.id as string,
        applicantComerID: this.profile?.comerID
      })
      if (!error) {
        closeUnapproveConfirm()
        return
      }
      this.visibleMap!.visibleUnapproveFail = true
    }

    const closeUnapproveFail = () => {
      this.visibleMap!.visibleUnapproveFail = false
    }

    return (
      <>
        <Basic
          title="Unapprove the applicant ？"
          content="You will stop to cooperate with the applicant, meanwhile the bounty will be closed"
          visible={this.visibleMap?.visibleUnapproveConfirm}
          onTriggerDialog={closeUnapproveConfirm}
          v-slots={{
            btns: () => (
              <div class="flex justify-end">
                <UButton class="mr-16px w-164px" type="default" onClick={userBehavier('cancel')}>
                  Cancel
                </UButton>
                <UButton class="w-164px" type="primary" onClick={userBehavier('submit')}>
                  Submit
                </UButton>
              </div>
            )
          }}
        />
        <Basic
          title="Unapprove failed"
          content=" You have to release all deposits before you do unapprove"
          visible={this.visibleMap?.visibleUnapproveFail}
          onTriggerDialog={closeUnapproveFail}
          v-slots={{
            btns: () => (
              <div class="flex justify-end">
                <UButton class="w-164px" type="primary" onClick={closeUnapproveFail}>
                  OK
                </UButton>
              </div>
            )
          }}
        />
      </>
    )
  }
})
