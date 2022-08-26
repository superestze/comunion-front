import { USkeleton } from '@comunion/components'
import { defineComponent } from 'vue'

const StartupSkeleton = defineComponent({
  name: 'StartupSkeleton',
  setup(props) {
    return () => (
      <div class="bg-white rounded h-80 relative cursor-pointer">
        <div class="p-6">
          <div class="overflow-hidden mb-2rem">
            <USkeleton class="float-left rounded-md" width="4rem" height="4rem" />
            <USkeleton
              class="float-right rounded-tr-md rounded-bl-md"
              width="3rem"
              height="1.6rem"
            />
            <USkeleton
              class="float-right rounded-tl-md rounded-br-md clear-right mt-0.8rem"
              width="5rem"
              height="1.6rem"
            />
          </div>
          <USkeleton class=" mb-1rem" height="1.25rem" />
          <USkeleton class=" mb-1rem" height="1.25rem" />
          <USkeleton class=" mb-1rem" height="1.25rem" />
          <USkeleton
            class="float-left rounded-tl-md rounded-br-md clear-right mt-2rem"
            width="5rem"
            height="1.6rem"
          />
        </div>
      </div>
    )
  }
})

export default StartupSkeleton
