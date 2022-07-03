import { UCard, UDeveloping, UTabPane, UTabs } from '@comunion/components'
import { EmptyFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, ref, watch } from 'vue'
import CreateBountyBlock, { CreateBountyRef } from '@/blocks/Bounty/Create'
import NoStartupTip from '@/layouts/default/blocks/Create/components/NoStartupTip'
import { services } from '@/services'
import { useUserStore } from '@/stores'

const Bounties = defineComponent({
  name: 'Bounties',
  setup(prop, ctx) {
    const userHasStartup = ref(false)
    const createRef = ref<CreateBountyRef>()
    const noStartupRef = ref()
    const userStore = useUserStore()

    const getStartupByComerId = async (comerID: number | undefined) => {
      try {
        const { error, data } = await services['bounty@bounty-startups']({
          comerID
        })
        if (!error) {
          userHasStartup.value = !!(data.list || []).length
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    watch(
      () => userStore.profile?.comerID,
      () => {
        if (userStore.profile?.comerID) {
          getStartupByComerId(userStore.profile?.comerID)
        }
      },
      {
        immediate: true
      }
    )

    const createNewBounty = () => {
      if (userHasStartup.value) {
        createRef.value?.show()
      } else {
        noStartupRef.value?.show()
      }
    }
    return () => (
      <UCard
        title="BOUNTIES"
        v-slots={{
          'header-extra': () => (
            <span
              class="cursor-pointer flex flex-row text-primary items-center u-label2"
              onClick={createNewBounty}
            >
              <PlusOutlined class="h-4 mr-3 w-4" />
              CREATE NEW
            </span>
          )
        }}
      >
        <CreateBountyBlock ref={createRef} />
        <NoStartupTip ref={noStartupRef} />
        <UTabs>
          <UTabPane name="APPROVED" tab="APPROVED">
            <UDeveloping>
              <EmptyFilled class="mt-34" />
            </UDeveloping>
          </UTabPane>
          <UTabPane name="POSTED BY ME" tab="POSTED BY ME">
            <UDeveloping>
              <EmptyFilled class="mt-34" />
            </UDeveloping>
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default Bounties
