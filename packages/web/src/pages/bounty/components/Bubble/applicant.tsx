import { UButton } from '@comunion/components'
import { format } from 'timeago.js'
import { defineComponent, PropType, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  useBountyContractWrapper,
  BountyContractReturnType
} from '../../hooks/useBountyContractWrapper'
import Basic from '../Dialog/basic'
import Bubble from './core'
import { ItemType } from './getItemType'
import { BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { ServiceReturn, services } from '@/services'
import { useBountyStore, useUserStore } from '@/stores'
import { useBountyContractStore } from '@/stores/bountyContract'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  name: 'ApplicantBubble',
  props: {
    applicant: {
      type: Object as PropType<ItemType<ServiceReturn<'bounty@bounty-list-applicants'>>>,
      required: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  setup(props) {
    const route = useRoute()
    const visible = ref<boolean>(false)
    const userStore = useUserStore()
    // const bountyStore = useBountyStore()

    // const { getApprovedPeople, get } = bountyStore

    const bountyContractStore = useBountyContractStore()
    const { bountyContract } = useBountyContractWrapper()
    const { approveApplicant } = bountyContract

    const formatDate = computed(() => {
      return format(props.applicant?.applyAt || '', 'comunionTimeAgo')
    })

    const approveDisabled = computed(() => {
      return (
        bountyContractStore.bountyContractInfo.role !== USER_ROLE.FOUNDER ||
        bountyContractStore.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED ||
        props.applicant?.status !== 1
      )
    })

    const bountyStatus = computed(() => bountyContractStore.bountyContractInfo.bountyStatus)
    const bountyRole = computed(() => bountyContractStore.bountyContractInfo.role)
    return {
      bountyRole,
      visible,
      profile: userStore.profile,
      formatDate,
      // getApprovedPeople,
      approveDisabled,
      // get,
      approveApplicant,
      bountyStatus,
      route
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

      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      const response = (await this.approveApplicant(
        this.applicant?.address || '',
        'Approve for the applicant to work for this bounty.',
        `Successfully approve ${this.applicant?.name || 'applicant'}.`
      )) as unknown as BountyContractReturnType
      const { error } = await services['bounty@bounty-founder-approve']({
        bountyID: parseInt(this.route.params.id as string),
        applicantComerID: this.applicant?.comerID,
        txHash: response?.hash || ''
      })

      const bountyStore = useBountyStore()
      bountyStore.initialize(this.route.params.id as string)
      if (!error) {
        // this.get(this.route.params.id as string)
        // this.getApprovedPeople(this.route.params.id as string)
        triggerDialog()
        return
      }
    }
    return (
      <>
        <Basic
          title="Approve the applicant？"
          content="Note: Other applicant's deposits will be released at once you approve the applicant"
          visible={this.visible}
          onTriggerDialog={triggerDialog}
          v-slots={{
            btns: () => (
              <div class="flex justify-end">
                <UButton class="mr-16px w-164px" type="default" onClick={userBehavier('cancel')}>
                  Cancel
                </UButton>
                <UButton class="w-164px" type="primary" onClick={userBehavier('submit')}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />

        <Bubble
          class="mb-10"
          avatar={this.applicant?.image}
          comerId={this.applicant?.comerID as unknown as string}
          v-slots={{
            default: () => (
              <div class="flex-1 ml-4">
                <div class="flex items-center">
                  <div class="flex-1">
                    <p class="mb-2 text-color1 u-h4">{this.applicant?.name}</p>
                    <p class="text-color3 u-h7">{this.formatDate}</p>
                  </div>
                  {this.bountyRole === USER_ROLE.FOUNDER && (
                    <UButton
                      disabled={
                        this.approveDisabled || this.bountyStatus >= BOUNTY_STATUS.WORKSTARTED
                      }
                      color={
                        this.approveDisabled || this.bountyStatus >= BOUNTY_STATUS.WORKSTARTED
                          ? 'rgba(0,0,0,0.1)'
                          : ''
                      }
                      class="w-30"
                      type="primary"
                      size="small"
                      onClick={triggerDialog}
                    >
                      Approve
                    </UButton>
                  )}
                </div>
                <div class="bg-purple rounded mt-2 p-4">
                  <div class="max-h-20 text-color2 overflow-auto u-h5">
                    {this.applicant?.description}
                  </div>
                </div>
              </div>
            )
          }}
        />
      </>
    )
  }
})
