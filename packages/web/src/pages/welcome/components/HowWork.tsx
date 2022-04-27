import { UGuideStep, UButton } from '@comunion/components'
import { defineComponent } from 'vue'

const HowWork = defineComponent({
  name: 'HowWork',
  setup(props, ctx) {
    const steps = [
      {
        index: 1,
        title: 'Look for a comeup',
        desc: 'Browse and find a comeup that interest you.'
      },
      {
        index: 2,
        title: 'Sign up for a bounty',
        desc: 'Apply and sign up for a bounty to contribute to the comeup’s growth.'
      },
      {
        index: 3,
        title: 'Select a contract',
        desc: 'Choose a contract for your bounty duty and establish your relationship with the comeup on the blockchain. '
      },
      {
        index: 4,
        title: 'Get paid',
        desc: 'Complete the bounty to get paid by the company token, and you will become a new comer for the comeup.'
      }
    ]
    return () => (
      <>
        <div class="w-full p-10 bg-white">
          <div class="font-orbitron font-normal font-700 text-[18px] leading-6 tracking-2px uppercase text-primary mb-10">
            How it works
          </div>
          <UGuideStep steps={steps} class="u-label2" />
        </div>
        <div class="w-full p-10 bg-white mt-10 flex flex-col justify-center">
          <div class="u-headline3 font-orbitron font-normal font-700 text-[24px] leading-8 text-center tracking-2px text-primary">
            Want to become a founder?
          </div>
          <div class="u-body1 font-opensans font-normal font-400 text-[16px] leading-5 text-grey1 text-center mt-6 mb-6">
            Create your own comeup portfolio on Comunion and recruite for talents.
          </div>
          <UButton class="bg-primary1 rounded-6px h-48px text-white text-bold text-16px leading-40px w-180px self-center">
            Create
          </UButton>
        </div>
      </>
    )
  }
})

export default HowWork
