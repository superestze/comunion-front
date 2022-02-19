import { defineComponent } from 'vue'

import { UButton } from '@/comps/index'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="h-full">
          <div class="p-20px rounded-xl">
            <div class="text-16px mb-16px">基础</div>
            <div class="flex flex-row">
              <UButton className="mr-16px mb-16px" type="primary">
                Primary
              </UButton>
              <UButton className="mr-16px mb-16px" type="success">
                Success
              </UButton>
              <UButton className="mr-16px mb-16px" type="tertiary">
                Tertiary
              </UButton>
              <UButton className="mr-16px mb-16px" type="warning">
                Warning
              </UButton>
              <UButton className="mr-16px mb-16px" type="error">
                Error
              </UButton>
              <UButton className="mr-16px mb-16px" type="info">
                Info
              </UButton>
              <UButton className="mb-16px" type="default">
                Default
              </UButton>
            </div>
          </div>
        </div>
      )
    }
  }
})
