import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory,
  UInput,
  UInputGroup,
  USelect,
  UInputNumberGroup
} from '@comunion/components'
import { SelectOption } from '@comunion/components/src/constants'
import { MinusCircleOutlined, AddCircleOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, ref, computed, Ref, h, onMounted } from 'vue'
import { BountyInfo, ContactType } from '../typing'
import RichEditor from '@/components/Editor'
import { services } from '@/services'
import { useUserStore } from '@/stores'

export const MAX_AMOUNT = 9999

export const renderUnit = (name: string) => (
  <div
    class={[
      'flex justify-center items-center border rounded-r-lg bg-white w-30',
      { 'text-grey1': name, 'text-grey4': !name }
    ]}
  >
    {name || 'Token'}
  </div>
)

export interface BountyBasicInfoRef {
  bountyDetailForm: FormInst | null
}

const BountyBasicInfo = defineComponent({
  name: 'BountyBasicInfo',
  props: {
    bountyInfo: {
      type: Object as PropType<BountyInfo>,
      required: true
    }
  },
  emits: ['delContact', 'addContact'],
  setup(props, ctx) {
    const contactOptions = ref([
      { label: 'Email', value: 'email' },
      { label: 'Discord', value: 'discord' },
      { label: 'Telegram', value: 'telegram' }
    ])
    const startupOptions = ref<SelectOption[]>([])
    const userStore = useUserStore()
    const bountyDetailForm = ref<FormInst | null>(null)

    const bountyBasicInfoFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'select',
        title: 'Startup',
        name: 'startupID',
        placeholder: 'Select a startup',
        rules: [
          { required: true, message: ' Please select a startup', type: 'number', trigger: 'blur' }
        ],
        options: startupOptions.value
      },
      {
        t: 'string',
        title: 'Title',
        name: 'title',
        rules: [{ required: true, message: 'Please enter the title', trigger: 'blur' }],
        placeholder: 'Title',
        maxlength: 200
      },
      {
        t: 'date',
        class: 'w-full',
        type: 'datetime',
        title: 'Expires In',
        name: 'expiresIn',
        rules: [
          { required: true, message: 'Please set the apply cutoff date' },
          {
            validator: (rule, value) => {
              if (!value) return true
              return dayjs(value) > dayjs().hour(23).minute(59).second(59)
            },
            message: 'Please set the reasonable cutoff date'
          }
        ],
        placeholder: 'Apply Cutoff Date',
        isDateDisabled: (current: number) => {
          return dayjs(current) <= dayjs().hour(23).minute(59).second(59)
        }
      },
      {
        t: 'custom',
        title: 'Contact',
        name: 'contact',
        rules: [
          {
            required: true,
            validator: (rule, value: ContactType[]) => {
              const hasValue = value.find(item => !!item.value)

              return !!hasValue
            },
            message: 'Please enter at least one contact information',
            trigger: 'blur'
          }
        ],
        render(value) {
          return (
            <div class="w-full">
              {props.bountyInfo.contact.map((item: ContactType, itemIndex: number) => (
                <UInputGroup class={{ 'mb-4': itemIndex < props.bountyInfo.contact.length - 1 }}>
                  <USelect options={contactOptions.value} value={item.type} class="w-50"></USelect>
                  <UInput class="flex-1" v-model:value={item.value}></UInput>

                  {props.bountyInfo.contact.length > 1 && (
                    <div
                      class="flex items-center cursor-pointer"
                      onClick={() => ctx.emit('delContact', itemIndex)}
                    >
                      <MinusCircleOutlined class="w-5 h-5 ml-4.5" />
                    </div>
                  )}

                  {itemIndex + 1 === props.bountyInfo.contact.length && itemIndex < 5 && (
                    <div
                      class="flex items-center cursor-pointer"
                      onClick={() => ctx.emit('addContact')}
                    >
                      <AddCircleOutlined class="w-5 h-5 ml-4.5" />
                    </div>
                  )}
                </UInputGroup>
              ))}
            </div>
          )
        }
      },
      {
        t: 'website',
        title: 'Discussion link',
        name: 'discussionLink',
        maxlength: 200,
        placeholder: 'Discussion link'
      },
      {
        t: 'skillTags',
        title: 'Applicants skills',
        name: 'applicantsSkills',
        placeholder: 'Applicants skills',
        rules: [{ required: true, message: 'Select at least one category' }]
      },
      {
        t: 'custom',
        name: 'applicantsDeposit',
        title: 'Applicants deposit',
        formItemProps: {
          feedback: 'The maximal deposit amount is 9999USDC',
          themeOverrides: {
            feedbackTextColor: 'var(--u-grey-4-color)',
            feedbackFontSizeMedium: '12px'
          }
        },
        slots: {
          label: () => [
            h(
              <div>
                Applicants deposit
                <span class="text-xs text-grey4 ml-4">
                  Applicant must deposit usdc for applying the bounty
                </span>
              </div>
            )
          ]
        },
        render(value) {
          return (
            <UInputNumberGroup
              v-model:value={props.bountyInfo.applicantsDeposit}
              type="withUnit"
              class="w-full"
              inputProps={{
                precision: 0,
                min: 0,
                max: MAX_AMOUNT,
                class: 'flex-1',
                parse: (value: string) => {
                  if (value === null) return 0
                  return Number(value)
                }
              }}
              renderUnit={() => renderUnit('USDC')}
            />
          )
        }
      },
      {
        t: 'custom',
        title: 'Description',
        name: 'description',
        required: true,
        render() {
          return (
            <RichEditor
              placeholder="Describe the details of the bounty"
              class="w-full"
              v-model:value={props.bountyInfo.description}
            />
          )
        }
      }
    ])
    const bountyBasicInfoRules = getFieldsRules(bountyBasicInfoFields.value)
    const getStartupByComerId = async () => {
      const comerID = userStore.profile?.comerID

      try {
        const { error, data } = await services['bounty@bounty-startups']({
          comerID
        })
        if (!error) {
          startupOptions.value = (data.list || []).map(startup => ({
            label: startup.name!,
            value: startup.startupID!
          }))
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    onMounted(() => {
      getStartupByComerId()
    })
    ctx.expose({
      bountyDetailForm
    })
    return {
      bountyDetailForm,
      bountyBasicInfoRules,
      bountyBasicInfoFields
    }
  },
  render() {
    return (
      <UForm
        ref={(ref: any) => (this.bountyDetailForm = ref)}
        rules={this.bountyBasicInfoRules}
        model={this.bountyInfo}
      >
        <UFormItemsFactory fields={this.bountyBasicInfoFields} values={this.bountyInfo} />
      </UForm>
    )
  }
})

export default BountyBasicInfo
