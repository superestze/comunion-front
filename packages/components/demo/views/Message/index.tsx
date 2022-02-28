import UButton from '@/comps/UButton'
import message from '@/comps/UMessage'
import { defineComponent } from 'vue'

const MessageDemoPage = defineComponent({
  name: 'MessageDemoPage',
  setup() {
    const showMsg = () => {
      message.success('This is a success message')
    }
    return () => (
      <div>
        <UButton type="primary" onClick={showMsg}>
          show
        </UButton>
      </div>
    )
  }
})

export default MessageDemoPage
