import { UButton } from '@comunion/components'
import {
  CreateStartupNewFilled,
  CreateBountyNewFilled,
  CreateCrowdfundingNewFilled,
  CreateProposalNewFilled
} from '@comunion/icons'
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import HeaderDropdown from '../../components/HeaderDropdown'
import NoFollowedStartupTip from './components/NoFollowedStartupTip'
import NoStartupTip from './components/NoStartupTip'
import CreateBountyBlock, { CreateBountyRef } from '@/blocks/Bounty/Create'
import CreateCrowdfundingBlock, { CreateCrowdfundingRef } from '@/blocks/Crowdfunding/Create'
import CreateProposalBlock, { CreateProposalRef } from '@/blocks/Proposal/Create'
import CreateStartupBlock, { CreateStartupRef } from '@/blocks/Startup/Create'
import { services } from '@/services'
import { useUserStore } from '@/stores'

const CreateBlock = defineComponent({
  name: 'CreateBlock',
  setup(props, ctx) {
    const router = useRouter()
    const userStore = useUserStore()
    const createStartupRef = ref<CreateStartupRef>()
    const createBountyRef = ref<CreateBountyRef>()
    const createCrowdfundingRef = ref<CreateCrowdfundingRef>()
    const createProposalRef = ref<CreateProposalRef>()
    const hasStartup = ref(false)
    const NoStartupTipRef = ref()
    const hasFollowedStartup = ref(false)
    const NoFollowedStartupTipRef = ref()

    const getStartupByComerId = async (comerID: number | undefined) => {
      // const comerID = userStore.profile?.comerID
      try {
        const { error, data } = await services['bounty@bounty-startups']({
          comerID
        })
        if (!error) {
          hasStartup.value = !!(data.list || []).length
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    const getFollowedStartupByComerId = async (comerID: number | undefined) => {
      try {
        const { error, data } = await services['account@related-statups']()
        if (!error) {
          hasFollowedStartup.value = !!(data || []).length
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    const onCreateStartup = () => {
      createStartupRef.value?.show()
    }

    const onCreateBounty = () => {
      if (hasStartup.value) {
        createBountyRef.value?.show()
      } else {
        NoStartupTipRef.value?.show()
      }
    }

    const onCreateCrowdfunding = () => {
      if (hasStartup.value) {
        createCrowdfundingRef.value?.show()
      } else {
        NoStartupTipRef.value?.show()
      }
    }

    const toStartupList = () => {
      router.push('/startup/list')
    }

    const onCreateProposal = () => {
      if (hasFollowedStartup.value) {
        createProposalRef.value?.show()
      } else {
        NoFollowedStartupTipRef.value?.show()
      }
    }

    watch(
      () => userStore.profile?.comerID,
      () => {
        if (userStore.profile?.comerID) {
          getStartupByComerId(userStore.profile?.comerID)
          getFollowedStartupByComerId(userStore.profile?.comerID)
        }
      },
      {
        immediate: true
      }
    )

    return () => (
      <>
        <CreateStartupBlock ref={createStartupRef} />
        <CreateBountyBlock ref={createBountyRef} />
        <CreateCrowdfundingBlock ref={createCrowdfundingRef} />
        <CreateProposalBlock ref={createProposalRef} />
        <NoStartupTip ref={NoStartupTipRef} onToCreate={onCreateStartup} />
        <NoFollowedStartupTip ref={NoFollowedStartupTipRef} onToCreate={toStartupList} />
        <HeaderDropdown
          options={[
            {
              key: 'startup',
              label: () => (
                <div class="flex items-center" onClick={onCreateStartup}>
                  <div class="rounded flex h-full mr-4 w-8 items-center justify-center">
                    <CreateStartupNewFilled />
                  </div>
                  <div>
                    <div class="text-[#000000] u-h4">Startup</div>
                    {/* <div class="font-semibold mt-1 text-xs text-grey2">
                      Create your Startup, initial your dream
                    </div> */}
                  </div>
                </div>
              )
            },
            {
              key: 'bounty',
              label: () => (
                <div class="flex items-center" onClick={onCreateBounty}>
                  <div class="rounded flex h-full mr-4 w-8 items-center justify-center">
                    <CreateBountyNewFilled class="text-primary" />
                  </div>
                  <div>
                    <div class="text-[#000000] u-h4">Bounty</div>
                    {/* <div class="font-semibold mt-1 text-xs text-grey2">
                      Post your bounty to expand your startup
                    </div> */}
                  </div>
                </div>
              )
            },
            {
              key: 'Crowdfunding',
              label: () => (
                <div class="flex items-center" onClick={onCreateCrowdfunding}>
                  <div class="rounded flex h-full mr-4 w-8 items-center justify-center">
                    <CreateCrowdfundingNewFilled class="text-primary" />
                  </div>
                  <div>
                    <div class="text-[#000000] u-h4">dCrowdfunding</div>
                    {/* <div class="font-semibold mt-1 text-xs text-grey2">
                      Post your crowdfunding for start-up capital
                    </div> */}
                  </div>
                </div>
              )
            },
            {
              key: 'Proposal',
              label: () => (
                <div class="flex items-center" onClick={onCreateProposal}>
                  <div class="rounded flex h-full mr-4 w-8 items-center justify-center">
                    <CreateProposalNewFilled class="text-primary" />
                  </div>
                  <div>
                    <div class="text-[#000000] u-h4">Proposal</div>
                    {/* <div class="font-semibold mt-1 text-xs text-grey2">
                      Create a proposal about startup governance
                    </div> */}
                  </div>
                </div>
              )
            }
          ]}
        >
          <UButton type="primary" size="small" class="h-8 w-19.25 !font-normal">
            Create
          </UButton>
          {/* <button class={[styles.btn, ctx.attrs.class]}></button> */}
        </HeaderDropdown>
      </>
    )
  }
})

export default CreateBlock
