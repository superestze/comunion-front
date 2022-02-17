import { defineComponent } from 'vue'

import { UInput, UInputGroup, UButton } from '@/comps/index'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="h-full">
          <div class="p-20px rounded-xl">
            <div class="text-16px mb-16px">基础</div>
            <div class="flex flex-row">
              <UInput />
            </div>
            <div class="text-16px my-16px">Search</div>
            <div class="flex flex-row">
              <UInputGroup>
                <UInput />
                <UButton type="primary">搜索</UButton>
              </UInputGroup>
            </div>
          </div>
        </div>
      )
    }
  }
})
