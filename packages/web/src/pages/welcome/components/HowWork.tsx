import { UGuideStep, UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import CreateStartupBlock, { CreateStartupRef } from '@/blocks/Startup/Create'

const HowWork = defineComponent({
  name: 'HowWork',
  setup(props, ctx) {
    const steps = [
      {
        index: 1,
        title: 'CREATE NEW STARTUP',
        desc: 'The next unicorn will be created with your dream.'
      },
      {
        index: 2,
        title: 'POST BOUNTY FOR BUILDING',
        desc: 'Work to build-earn-invest startup with your skills.'
      },
      {
        index: 3,
        title: 'LAUNCHPAD PROTOCOL',
        desc: 'A suite of protocols and tools to help you launch your startup under safe and fair.'
      },
      {
        index: 4,
        title: 'NCO GOVERNANCE',
        desc: 'Protocols for your NCO governance needs.'
      }
    ]
    const createRef = ref<CreateStartupRef>()
    const createNewStartup = () => {
      createRef.value?.show()
    }

    return () => (
      <>
        <CreateStartupBlock ref={createRef} />

        <div class=" w-full p-10 bg-white">
          <div class="u-card-title1 text-primary1 leading-6 tracking-2px uppercase mb-10">
            How it works
          </div>
          <UGuideStep steps={steps} class="u-label2" />
        </div>
        <div class="h-74 w-full p-10 bg-white mt-10 flex flex-col justify-center">
          <div class="u-h3 text-[24px] leading-8 text-center tracking-2px text-primary1">
            Want to become a founder?
          </div>
          <div class="u-body1 font-opensans font-normal font-400 text-[16px] leading-5 text-grey1 text-center mt-6 mb-6">
            Create a startup with your brilliant idea.
          </div>
          <UButton
            type="primary"
            size="large"
            class="bg-primary1 rounded-2 h-12 w-45 text-white text-bold text-16px self-center"
            onClick={createNewStartup}
          >
            Create
          </UButton>
        </div>
      </>
    )
  }
})

export default HowWork
