import { UCard, UTabPane, UTabs, UDeveloping } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import CreateBountyBlock from '@/blocks/Bounty/Create'
import { CreateCrowdfundingRef } from '@/blocks/Crowdfunding/Create'
import CreateStartupBlock, { CreateStartupRef } from '@/blocks/Startup/Create'
import NoStartupTip from '@/layouts/default/blocks/Create/components/NoStartupTip'

const Bookmarks = defineComponent({
  name: 'Proposal',
  props: {
    userHasStartup: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const createStartupRef = ref<CreateStartupRef>()
    const createRef = ref<CreateCrowdfundingRef>()
    const noStartupRef = ref()
    // const createNewCrowdfunding = () => {
    //   if (props.userHasStartup) {
    //     createRef.value?.show()
    //   } else {
    //     noStartupRef.value?.show()
    //   }
    // }

    const onCreateStartup = () => {
      createStartupRef.value?.show()
    }
    return () => (
      <UCard
        title="Crowdfunding"
        // v-slots={{
        //   'header-extra': () => (
        //     <span
        //       class="cursor-pointer flex flex-row text-primary items-center u-label2"
        //       onClick={createNewCrowdfunding}
        //     >
        //       <PlusOutlined class="h-4 mr-3 w-4" />
        //       CREATE NEW
        //     </span>
        //   )
        // }}
      >
        <CreateStartupBlock ref={createStartupRef} />
        <CreateBountyBlock ref={createRef} />
        <NoStartupTip ref={noStartupRef} onToCreate={onCreateStartup} />
        <UTabs>
          <UTabPane name="STARTUPS" tab="STARTUPS">
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

export default Bookmarks
