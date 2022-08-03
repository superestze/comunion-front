import { UButton } from '@comunion/components'
import { CheckFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  render() {
    const connect = false
    return (
      <div class="flex w-full items-center px-4">
        <div class="flex flex-shrink-0 items-center justify-center h-full mt-2px">
          {typeof this.$slots.avatar === 'function' && this.$slots.avatar()}
        </div>
        <div class="flex flex-grow border-grey5 border-b h-17 items-center ml-4 justify-between">
          <div class="w-full text-16px font-600 text-grey1 items-center">dkfjslkfjklsjdfkjsfd</div>
          {connect ? (
            <UButton class="w-111px flex-shrink-0 h-7 flex" size="tiny" ghost type="primary">
              <PlusOutlined class="mr-2 w-4 h-4" />
              Connect
            </UButton>
          ) : (
            <UButton class="w-111px flex-shrink-0 h-7 flex" size="tiny" secondary type="tertiary">
              <CheckFilled class="mr-2" />
              Unconnect
            </UButton>
          )}
        </div>
      </div>
    )
  }
})
