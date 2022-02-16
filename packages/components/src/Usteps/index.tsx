import { NSteps } from 'naive-ui'
import type { StepsProps } from 'naive-ui'
import { defineComponent } from 'vue'

type UStepsProps = StepsProps

export default defineComponent<UStepsProps>({
  name: 'USteps',
  setup(props, { slots }) {
    return () => <NSteps {...props}> {slots.default?.()} </NSteps>
  }
})
