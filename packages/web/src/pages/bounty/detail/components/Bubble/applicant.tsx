import { UButton } from '@comunion/components'
import { format } from 'timeago.js'
import { defineComponent, PropType, ref, computed } from 'vue'
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
      bountyStatus
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
        'Waiting to submit all contents to blockchain for approve applicant',
        `Approve ${this.applicant?.name || 'applicant'} succeedes`
      )) as unknown as BountyContractReturnType
      const { error } = await services['bounty@bounty-founder-approve']({
        bountyID: parseInt(this.$route.query.bountyId as string),
        applicantComerID: this.applicant?.comerID,
        txHash: response?.hash || ''
      })

      const bountyStore = useBountyStore()
      bountyStore.initialize(this.$route.query.bountyId as string)
      if (!error) {
        // this.get(this.$route.query.bountyId as string)
        // this.getApprovedPeople(this.$route.query.bountyId as string)
        triggerDialog()
        return
      }
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
          class="mt-10"
          avatar={this.applicant?.image}
          comerId={this.applicant?.comerID as unknown as string}
          v-slots={{
            default: () => (
              <div class="flex-1 ml-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="mb-2 font-primary font-semibold text-color1">
                      {this.applicant?.name}
                    </p>
                    <p class="mr-16px text-color3 u-h7">{this.formatDate}</p>
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
                <div class="bg-purple rounded-[8px] mt-3 py-4 px-6 ">
                  <div class="text-black max-h-20 overflow-auto u-body2">
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
