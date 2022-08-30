import { USkeleton } from '@comunion/components'
import { defineComponent } from 'vue'

const StartupSkeleton = defineComponent({
  name: 'StartupSkeleton',
  setup(props) {
    return () => (
      <div class="bg-white rounded cursor-pointer h-96 relative">
        <div class="p-6">
          <div class="mb-2rem overflow-hidden">
            <USkeleton class="rounded-md float-left" width="4rem" height="4rem" />
            <USkeleton
              class="rounded-tr-md rounded-bl-md float-right"
              width="3rem"
              height="1.6rem"
            />
            <USkeleton
              class="rounded-tl-md rounded-br-md mt-0.8rem float-right clear-right"
              width="5rem"
              height="1.6rem"
            />
          </div>
          <USkeleton class="mb-1 h5" />
          <USkeleton class="mb-1 h5" />
          <USkeleton class="mb-1 h5" />
          <USkeleton
            class="rounded-tl-md rounded-br-md mt-2rem float-left clear-right"
            width="5rem"
            height="1.6rem"
          />
        </div>
      </div>
    )
  }
})

export default StartupSkeleton
