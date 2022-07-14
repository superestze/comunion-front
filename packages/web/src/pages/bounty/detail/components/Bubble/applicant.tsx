import { UButton, UScrollbar } from '@comunion/components'
import { defineComponent } from 'vue'
import Bubble from './core'

export default defineComponent({
  render() {
    return (
      <Bubble
        v-slots={{
          default: (obj: any) => (
            <div class="flex flex-col flex-grow ml-5">
              <div class="flex justify-between">
                <p class="mb-2 u-title1">{obj.name}</p>
                <div class="flex items-center">
                  <p class="text-14px text-grey3 mr-16px">{obj.time}</p>
                  <UButton class="w-120px" type="primary" size="small">
                    Approve
                  </UButton>
                </div>
              </div>
              <UScrollbar
                style={{ maxHeight: '120px' }}
                class="bg-purple rounded-8px text-black mt-12px py-16px px-24px overflow-hidden"
              >
                <p>
                  Would like to help, I have a experience with frontend development.Would like to
                  help, I have a experience with frontend development.Would like to help, I have a
                  experience . I have a experience with frontend development.Would like to help, I
                  have a experience I have a experience with frontend development...
                </p>
              </UScrollbar>
            </div>
          )
        }}
      />
    )
  }
})
