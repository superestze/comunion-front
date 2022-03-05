import { UDrawer, createFormFields, UForm } from '@comunion/components'
import { defineComponent, ref, reactive } from 'vue'
import type { PropType, VNode } from 'vue'

const CreateStartupBlock = defineComponent({
  name: 'CreateStartupBlock',
  props: {
    trigger: {
      type: Object as PropType<VNode>
    }
  },
  setup(props, ctx) {
    const show = ref(false)
    const model = reactive({
      logo: '',
      name: '',
      type: '',
      tags: [],
      mission: '',
      overview: '',
      tokenContract: '',
      composes: []
    })
    if (props.trigger) {
      props.trigger.props.onClick = () => {
        show.value = true
      }
    }

    const infoForm = createFormFields([], model)
    return () => (
      <>
        {props.trigger}
        <UDrawer title="Create startup" v-model:show={show.value}>
          <UForm rules={{ ...infoForm.rules.value }}>
            <p class="u-card-title1">INFO SETTING</p>
            {infoForm.items}
          </UForm>
        </UDrawer>
      </>
    )
  }
})

export default CreateStartupBlock
