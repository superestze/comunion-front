import { UButton, UScrollbar } from '@comunion/components'
import { defineComponent } from 'vue'
import Text from '../Text'

export default defineComponent({
  setup() {
    return () => (
      <div class="flex flex-col relative items-center h-362px w-242px bg-purple border-purple border-1 border-solid rounded-8px mt-10px ml-10px pl-24px pr-24px">
        <div
          class="absolute bg-purple1 rounded-8px flex justify-center items-center inset-0 z-9"
          style={{ backgroundColor: '#5331F4', opacity: 0.4 }}
        />
        <div class="z-10 absolute top-1/2 left-1/2 -ml-35px -mt-16px text-warning transform -rotate-15 rounded-4px w-70px h-32px bg-white flex justify-center items-center">
          PAID
        </div>
        <div class="font-orbitron font-bold text-primary text-18px absolute -left-10px -top-10px bg-purple z-1 text-primary w-72px h-40px flex justify-center items-center rounded-4px">
          1ST
        </div>
        {/* <div class="absolute -left-10px -top-10px bg-purple-light z-10 text-primary w-72px h-40px flex justify-center items-center rounded-4px">
          1ST
        </div> */}
        <Text class="mt-24px" />
        <Text class="mt-12px" />
        <UScrollbar style={{ maxHeight: `${120}px` }} class="mt-26px">
          <p class="text-primary2">
            123123 123123 123 123sdklfjasldf 1fasdfjasf sdklfjasldf sadklfjasf oiweurow
            sdfklsadjfwer dsfjksajdflsa
          </p>
        </UScrollbar>
        <UButton class="w-100px mt-30px bg-white" type="default" size="small">
          Pay
        </UButton>
      </div>
    )
  }
})
