import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { defineComponent, ref, reactive, PropType, watch } from 'vue'
import { RectDraggerUpload } from '@/components/Upload/inde'
import { getStartupTypeFromNumber, STARTUP_TYPES } from '@/constants'
import { useWalletStore } from '@/stores'

type InfoPropType = {
  logo: string
  name: string
  mode: number
  mission: string
  overview: string
  blockChainAddress: string
}

type onlyType = {
  type: string
}

type InfoType = Omit<InfoPropType, 'mode' | 'blockChainAddress'> & onlyType

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<InfoPropType>,
      required: true
    }
  },
  setup(props) {
    const info = reactive<InfoType>({
      logo: props.data.logo || '',
      name: props.data.name || '',
      type: getStartupTypeFromNumber(props.data.mode) || '',
      mission: props.data.mission || '',
      overview: props.data.overview || ''
    })
    watch(
      () => props.data,
      data => {
        info.logo = data.logo
        info.name = data.name
        info.type = getStartupTypeFromNumber(data.mode)
        info.mission = data.mission
        info.overview = data.overview
      }
    )

    const walletStore = useWalletStore()
    const fields: FormFactoryField[] = [
      // {
      //   t: 'custom',
      //   title: 'BlockChainAddress',
      //   name: 'blockChainAddress',
      //   required: true,
      //   render: () => {
      //     return h(
      //       <UAddress
      //         autoSlice={true}
      //         blockchainExplorerUrl={walletStore.blockchainExplorerUrl}
      //         address={props.data.blockChainAddress}
      //       />,
      //       {}
      //     )
      //   }
      // },
      {
        t: 'string',
        title: 'Name',
        name: 'name',
        required: true,
        placeholder: 'Please enter your startup name',
        maxlength: 24,
        disabled: true
      },
      {
        t: 'select',
        title: 'Type',
        name: 'type',
        required: true,
        placeholder: 'Startup type',
        options: STARTUP_TYPES.map(item => ({ label: item, value: item })),
        disabled: true
      },
      {
        t: 'string',
        title: 'Mission',
        name: 'mission',
        placeholder: 'Please enter your startup mission',
        maxlength: 100,
        disabled: true,
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
        disabled: true,
        rules: [
          {
            required: true,
            message: 'Please enter a description of at least 100 letters'
          }
        ]
      }
    ]
    const form = ref<FormInst>()
    return {
      form,
      fields,
      info
    }
  },
  render() {
    const handleSubmit = () => {
      this.form?.validate(err => {
        console.log(err)
      })
    }

    const rules = getFieldsRules(this.fields)
    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden min-h-205.5">
        <div class="mx-10 my-9.5">
          <div class="flex mb-14">
            <RectDraggerUpload tip={{ text: 'Startup logo', tip: '123' }} />
            <RectDraggerUpload class="ml-16" tip={{ text: 'Startup Banner', tip: '123' }} />
          </div>
          <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
            <UFormItemsFactory fields={this.fields} values={this.info} />
          </UForm>
          <UButton class="w-30" type="primary" size="small" onClick={handleSubmit}>
            Save
          </UButton>
        </div>
      </div>
    )
  }
})
