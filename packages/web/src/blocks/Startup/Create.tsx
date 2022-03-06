import { UDrawer, createFormFields, UForm } from '@comunion/components'
import { TipOutlined } from '@comunion/icons'
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

    const infoForm = createFormFields(
      [
        {
          t: 'string',
          title: 'Name',
          name: 'name',
          required: true,
          placeholder: 'Please enter your startup name',
          maxlength: 24
        },
        {
          t: 'select',
          title: 'type',
          name: 'type',
          required: true,
          placeholder: 'Startup type',
          options: [
            {
              label: 'ESG',
              value: 'ESG'
            },
            {
              label: 'NGO',
              value: 'NGO'
            },
            {
              label: 'DAO',
              value: 'DAO'
            },
            {
              label: 'COM',
              value: 'COM'
            }
          ]
        },
        {
          t: 'hashInput',
          required: true,
          title: 'Hashtag',
          category: 'startup',
          name: 'hashtag',
          placeholder: '#Enter you startup tag'
        },
        {
          t: 'string',
          title: 'Mission',
          name: 'mission',
          placeholder: 'Please enter your startup mission',
          maxlength: 100,
          required: true
        },
        {
          t: 'string',
          title: 'Overview',
          name: 'overview',
          placeholder: 'Describe your startup',
          minlength: 100,
          required: true,
          type: 'textarea',
          rules: [
            {
              required: true,
              message: 'Please enter a description of at least 100 letters'
            }
          ]
        }
      ],
      model
    )
    return () => (
      <>
        {props.trigger}
        <UDrawer title="Create startup" v-model:show={show.value}>
          <UForm rules={{ ...infoForm.rules.value }}>
            <p class="mb-7 u-card-title1">INFO SETTING</p>
            {infoForm.items}
            <div class="bg-purple h-13px my-8"></div>
            <p class="mb-7 uppercase u-card-title1">Finance Setting</p>
            <ul class="bg-white border rounded-lg border-grey5 m-4 text-body1 relative">
              <li>Firstly，the token must be bound to the Start-Up as Proof-of-Stake.</li>
              <li>A token can only be bound to one Startup and can’t be changed after bound.</li>
              <li>If you have not a token yet， use Erc20-Generator to create your token.</li>
              <div class="flex text-primary right-4 bottom-4 absolute items-center">
                How to Set?
                <TipOutlined class="ml-2px" />
              </div>
            </ul>
          </UForm>
        </UDrawer>
      </>
    )
  }
})

export default CreateStartupBlock
