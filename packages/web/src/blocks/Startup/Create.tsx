import { UDrawer } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import type { PropType, VNode } from 'vue'
import CreateStartupForm from './CreateForm'
import { useWallet } from '@/providers'

const CreateStartupBlock = defineComponent({
  name: 'CreateStartupBlock',
  props: {
    trigger: {
      type: Object as PropType<VNode>
    }
  },
  setup(props, ctx) {
    const show = ref(false)
    const { ensureWalletConnected } = useWallet()

    // add trigger action
    if (props.trigger) {
      props.trigger.props.onClick = async () => {
        await ensureWalletConnected()
        show.value = true
      }
    }

    return () => (
      <>
        {props.trigger}
        <UDrawer title="Create startup" v-model:show={show.value}>
          {show.value && <CreateStartupForm onCancel={() => (show.value = false)} />}
        </UDrawer>
      </>
    )
  }
})

export default CreateStartupBlock
