import { USkeleton } from '@comunion/components'
import { defineComponent } from 'vue'

const StartupSkeleton = defineComponent({
  name: 'StartupSkeleton',
  setup(props) {
    return () => (
      <div class="h-36 bg-white rounded-md px-10 mb-1.5rem pt-2rem">
        <div class="flex ">
          <USkeleton class="rounded-md mr-3" width="3.75rem" height="3.75rem" />
          <div class="flex-1">
            <div class="flex">
              <div class="flex-1 mb-2">
                <USkeleton height="1.25rem" width="9rem" />
              </div>
              <USkeleton height="1.25rem" width="3.75rem" />
            </div>
            <USkeleton class="mb-2" height="1.25rem" width="54rem" />
            <USkeleton height="2.6rem" width="75rem" />
          </div>
        </div>
      </div>
    )
  }
})

export default StartupSkeleton
