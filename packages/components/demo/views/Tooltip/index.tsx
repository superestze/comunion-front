import { UTooltip, UButton } from '@/comps/index'
import { defineComponent } from 'vue'

const TooltipDemoPage = defineComponent({
  name: 'TooltipDemoPage',
  setup() {
    return () => (
      <UTooltip>
        {{
          trigger: () => <UButton>Trigger</UButton>,
          default: () => 'Content'
        }}
      </UTooltip>
    )
  }
})

export default TooltipDemoPage
