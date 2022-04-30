import { UForm, UFormItemsFactory, UButton, FormFactoryField, UAddress } from '@comunion/components'
import { defineComponent, PropType, h, reactive, ref } from 'vue'
import { getStartupTypeFromNumber, STARTUP_TYPES } from '@/constants'
import { services } from '@/services'
import { StartupItem } from '@/types'

const EditStartupForm = defineComponent({
  name: 'EditStartupForm',
  props: {
    onCancel: {
      type: Function as PropType<() => void>
    },
    startup: {
      type: Object as PropType<StartupItem>,
      required: true
    }
  },
  setup(props, ctx) {
    const infoModel = reactive({
      logo: props.startup!.logo || '',
      name: props.startup!.name || '',
      type: getStartupTypeFromNumber(props.startup!.mode) || '',
      // tags: (props.startup!.hashTags || []).map(t => t.name) as string[],
      mission: props.startup!.mission || '',
      overview: props.startup!.overview || ''
    })

    const securityModel = reactive({
      kyc: props.startup!.kyc || '',
      contractAudit: props.startup!.contractAudit || ''
    })

    const socialModel = reactive({
      tags: (props.startup!.hashTags || []).map(t => t.name) as string[],
      website: props.startup!.website || '',
      discord: props.startup!.discord || '',
      twitter: props.startup!.twitter || '',
      telegram: props.startup!.telegram || '',
      docs: props.startup!.docs || ''
    })
    const loading = ref(false)

    function onCancel() {
      props.onCancel?.()
    }

    /**
     * @description: submit to backend , not recorded by block-chain now
     */
    async function onSubmit() {
      loading.value = true
      const { error } = await services['startup@startup-basic-setting-update']({
        startupId: props.startup!.id,
        kyc: securityModel.kyc,
        contractAudit: securityModel.contractAudit,
        hashTags: socialModel.tags,
        website: socialModel.website,
        discord: socialModel.discord,
        twitter: socialModel.twitter,
        telegram: socialModel.telegram,
        docs: socialModel.docs
      })
      if (!error) {
        onCancel()
      }
      loading.value = false
    }
    const infoFields: FormFactoryField[] = [
      {
        t: 'singleImageUpload',
        title: '',
        name: 'logo',
        text: 'Upload new picture'
      },
      {
        t: 'custom',
        title: 'BlockChainAddress',
        name: 'blockChainAddress',
        required: true,
        render: () => {
          return h(<UAddress autoSlice={true} address={props.startup!.contractAudit} />, {})
        }
      },
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
    const securityInfo: FormFactoryField[] = [
      {
        t: 'string',
        title: 'KYC',
        name: 'kyc',
        placeholder: 'Input startup KYC'
      },

      {
        t: 'string',
        title: 'Contract Audit',
        name: 'contractAudit',
        placeholder: 'Input startup contract audit'
      }
    ]
    const socialInfo: FormFactoryField[] = [
      {
        t: 'hashInput',
        title: 'Hashtag',
        category: 'startup',
        name: 'tags',
        placeholder: '#Input your startup tag'
      },
      {
        t: 'string',
        title: 'Website',
        name: 'website',
        placeholder: 'Input startup website'
      },
      {
        t: 'string',
        title: 'Discord',
        name: 'discord',
        placeholder: 'Input startup discord'
      },

      {
        t: 'string',
        title: 'Twitter',
        name: 'twitter',
        placeholder: 'Input twitter link'
      },
      {
        t: 'string',
        title: 'Telegram',
        name: 'telegram',
        placeholder: 'Input telegram link'
      },
      {
        t: 'string',
        title: 'Docs',
        name: 'docs',
        placeholder: 'Input docs link'
      }
    ]

    return () => (
      <>
        <UForm model={infoModel} class="bg-white p-10">
          <p class="mb-7 text-primary1 u-card-title1">INFO SETTING</p>
          {/* startup */}
          <UFormItemsFactory fields={infoFields} values={infoModel} />
        </UForm>
        <div class="bg-purple h-10"></div>

        <UForm model={securityModel} class="bg-white p-10">
          <p class="mb-7 text-primary1 u-card-title1">SECURITY SETTING</p>
          {/* security setting */}
          <UFormItemsFactory fields={securityInfo} values={securityModel} />
        </UForm>
        <div class="bg-purple h-10"></div>

        <UForm model={socialModel} class="bg-white p-10">
          <p class="mb-7 text-primary1 u-card-title1">SOCIAL SETTING</p>
          {/* social setting */}
          <UFormItemsFactory fields={socialInfo} values={socialModel} />
        </UForm>

        <div class="flex mt-16 items-center justify-end">
          <UButton type="default" size="large" class="mr-4 w-41 u-title2" onClick={onCancel}>
            Cancel
          </UButton>
          <UButton
            type="primary"
            size="large"
            class="bg-primary1 text-white w-41 u-title2"
            loading={loading.value}
            onClick={onSubmit}
          >
            Submit
          </UButton>
        </div>
      </>
    )
  }
})

export default EditStartupForm
