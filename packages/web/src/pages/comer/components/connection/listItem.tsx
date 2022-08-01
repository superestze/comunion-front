import { UButton } from '@comunion/components'
import { CheckFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  render() {
    const connect = true
    return (
      <div class="flex w-full items-center h-17 border-grey5 border-b">
        <div class="w-28 flex flex-shrink-0 items-center justify-center h-full border-b border-white mt-2px">
          {typeof this.$slots.avatar === 'function' && this.$slots.avatar()}
        </div>
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
    )
  }
})
