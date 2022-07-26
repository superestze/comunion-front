import { UButton } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import Basic from './basic'
import { services } from '@/services'
import { useUserStore } from '@/stores'

export type VisibleMap = {
  visibleUnapproveConfirm: boolean
  visibleUnapproveFail: boolean
}

export const UnapprovePromptSet = defineComponent({
  props: {
    visibleMap: {
      type: Object as PropType<VisibleMap>,
      require: true
    }
  },
  setup() {
    const userStore = useUserStore()
    const profile = computed(() => {
      return userStore.profile
    })
    return {
      profile
    }
  },
  render() {
    const closeUnapproveConfirm = () => {
      this.visibleMap!.visibleUnapproveConfirm = false
    }
    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        closeUnapproveConfirm()
        return
      }

      const { error } = await services['bounty@bounty-founder-unapprove']({
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
                  cancel
                </UButton>
                <UButton class="w-164px" type="primary" onClick={userBehavier('submit')}>
                  submit
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
