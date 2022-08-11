import { UButton, UScrollbar } from '@comunion/components'
import { format } from 'timeago.js'
import { defineComponent, PropType, ref, computed } from 'vue'
import Basic from '../Dialog/basic'
import Bubble from './core'
import { ItemType } from './getItemType'
import { ServiceReturn } from '@/services'
import { useBountyStore, useUserStore } from '@/stores'

export default defineComponent({
  props: {
    applicant: {
      type: Object as PropType<ItemType<ServiceReturn<'bounty@bounty-list-applicants'>>>,
      required: true
    },
    stageNum: {
      type: Number,
      require: true
    }
  },
  setup(props) {
    const visible = ref<boolean>(false)
    const userStore = useUserStore()
    const bountyStore = useBountyStore()

    const { getApprovedPeople, getBountyPayment, get } = bountyStore

    const formatDate = computed(() => {
      return format(props.applicant?.applyAt || '', 'comunionTimeAgo')
    })

    const approveDisabled = computed(() => {
      return bountyStore.bountyStatus?.role !== 1
    })
    return {
      visible,
      profile: userStore.profile,
      formatDate,
      getApprovedPeople,
      getBountyPayment,
      approveDisabled,
      get
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }

    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        triggerDialog()
        return
      }

      // const { error } = await services['bounty@bounty-founder-approve']({
      //   bountyID: parseInt(this.$route.query.bountyId as string),
      //   applicantComerID: this.profile?.comerID
      // })
      // if (!error) {
      //   this.get(this.$route.query.bountyId as string)
      //   this.getApprovedPeople(this.$route.query.bountyId as string)
      //   this.getBountyPayment(this.$route.query.bountyId as string)
      //   triggerDialog()
      //   return
      // }
    }
    return (
      <>
        <Basic
          title="Approve the applicant？"
          content="Other applicants's deposits will be released once you do approve the applicant "
          visible={this.visible}
          onTriggerDialog={triggerDialog}
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
        <Bubble
          class="mt-40px"
          avatar={this.applicant?.image}
          comerId={this.applicant?.comerID as unknown as string}
          v-slots={{
            default: () => (
              <div class="flex flex-col flex-grow ml-5">
                <div class="flex justify-between">
                  <p class="mb-2 u-title1">{this.applicant?.name}</p>
                  <div class="flex items-center">
                    <p class="text-14px text-grey3 mr-16px">{this.formatDate}</p>
                    <UButton
                      disabled={this.approveDisabled || (this.stageNum || 0) >= 2}
                      class="w-120px"
                      type="primary"
                      size="small"
                      onClick={triggerDialog}
                    >
                      Approve
                    </UButton>
                  </div>
                </div>
                <UScrollbar
                  style={{ maxHeight: '120px' }}
                  class="bg-purple rounded-8px text-black mt-12px py-16px px-24px overflow-hidden"
                >
                  {/* <p>{this.applicant?.desription}</p> */}
                </UScrollbar>
              </div>
            )
          }}
        />
      </>
    )
  }
})