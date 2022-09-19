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
import { MinusCircleOutlined, AddCircleOutlined, ArrowLineRightOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, ref, computed, Ref, h, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { BountyInfo, ContactType, chainInfoType } from '../typing'
import RichEditor from '@/components/Editor'
import { services } from '@/services'
import { useUserStore } from '@/stores'
import { validateEmail } from '@/utils/type'

export const MAX_AMOUNT = 9999

export const renderUnit = (name: string) => (
  <div
    class={[
      'flex justify-center items-center border rounded-r-lg bg-white w-30',
      { 'text-color1': name, 'text-color3': !name }
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
    },
    chainInfo: {
      type: Object as PropType<chainInfoType>,
      required: true,
      defualt: {
        onChain: false
      }
    }
  },
  emits: ['delContact', 'addContact', 'closeDrawer'],
  setup(props, ctx) {
    const router = useRouter()
    const contactOptions = ref([
      { label: 'Email', value: 1 },
      { label: 'Discord', value: 2 },
      { label: 'Telegram', value: 3 }
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
          {
            required: true,
            message: 'Startup cannot be blank',
            type: 'number',
            trigger: ['blur']
          },
          {
            validator: (rule, value) => {
              if (value) {
                return props.chainInfo.onChain
              }
              return true
            },
            renderMessage: () => {
              return (
                <div class="flex items-center">
                  <span>The startup cannot create a bounty without being on the blockchain,</span>
                  <span
                    onClick={() => goSetting()}
                    class="cursor-pointer flex ml-2 items-center !text-primary"
                  >
                    <span>Go to setting</span>
                    <ArrowLineRightOutlined class="h-[16px] ml-2 w-[16px]" />
                  </span>
                </div>
              )
            },
            trigger: ['blur']
          }
        ],
        options: startupOptions.value
      },
      {
        t: 'string',
        title: 'Title',
        name: 'title',
        placeholder: 'Bounty title',
        maxlength: 200,
        rules: [
          { required: true, message: 'Title cannot be blank', type: 'string', trigger: 'blur' },
          {
            validator: (rule, value) => !value.length || value.length > 11,
            message: 'Bounty title must be 12 characters or more',
            trigger: 'blur'
          }
        ]
      },
      {
        t: 'date',
        class: 'w-full',
        type: 'datetime',
        title: 'Apply Cutoff Date',
        name: 'expiresIn',
        placeholder: 'Select date',
        actions: ['clear', 'confirm'],
        rules: [
          {
            required: true,
            message: 'Apply Cutoff Date cannot be blank',
            type: 'date',
            trigger: 'blur'
          },
          {
            validator: (rule, value) => {
              if (!value) return true
              return dayjs(value) > dayjs()
            },
            message: 'Please set the reasonable cutoff date',
            trigger: 'blur'
          }
        ],
        isDateDisabled: (current: number) => {
          return dayjs(current) < dayjs()
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
          },
          {
            validator: (rule, value: ContactType[]) => {
              for (const item of value) {
                if (item.type === 1 && !validateEmail(item.value)) {
                  return false
                } else {
                  return true
                }
              }
              return true
            },
            message: '',
            trigger: 'blur'
          }
        ],
        render(value) {
          return (
            <div class="w-full">
              {props.bountyInfo.contact.map((item: ContactType, itemIndex: number) => (
                <>
                  <div
                    class={`flex items-center ${
                      itemIndex < props.bountyInfo.contact.length - 1 ? 'mb-4' : ''
                    }`}
                  >
                    <UInputGroup>
                      <USelect
                        options={contactOptions.value}
                        v-model:value={item.type}
                        class="w-50"
                      ></USelect>
                      <UInput
                        class="rounded-r-lg flex-1"
                        v-model:value={item.value}
                        inputProps={{ type: item.type === 1 ? 'email' : 'text' }}
                        status={
                          item.type === 1 && item.value && !validateEmail(item.value)
                            ? 'error'
                            : undefined
                        }
                      ></UInput>
                    </UInputGroup>
                    {/* buttons */}
                    <div class="flex ml-4 w-22 items-center">
                      {props.bountyInfo.contact.length > 1 && (
                        <div
                          class="cursor-pointer flex items-center"
                          onClick={() => ctx.emit('delContact', itemIndex)}
                        >
                          <MinusCircleOutlined class="h-5 mr-4 text-error w-5" />
                        </div>
                      )}

                      {itemIndex + 1 === props.bountyInfo.contact.length && itemIndex < 5 && (
                        <div
                          class="cursor-pointer flex items-center"
                          onClick={() => ctx.emit('addContact')}
                        >
                          <AddCircleOutlined class="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* tips */}
                  {item.type === 1 && item.value && !validateEmail(item.value) && (
                    <div class="text-error ml-50">Please enter the correct email address</div>
                  )}
                  {item.type === 2 &&
                    item.value &&
                    !item.value.includes('http://') &&
                    !item.value.includes('https://') && (
                      <div class="text-error ml-50">Please enter the correct email Discord</div>
                    )}
                  {item.type === 3 &&
                    item.value &&
                    !item.value.includes('http://') &&
                    !item.value.includes('https://') && (
                      <div class="text-error ml-50">Please enter the correct email Telegram</div>
                    )}
                </>
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
        title: 'Applicant skills',
        name: 'applicantsSkills',
        placeholder: 'Applicant skills',
        required: true
      },
      {
        t: 'custom',
        name: 'applicantsDeposit',
        title: 'Applicants deposit',
        formItemProps: {
          feedback: `The maximal deposit amount is 9999 ${props.bountyInfo.token1Symbol}`,
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
                <span class="font-normal text-xs ml-4 text-color3">
                  Applicant must deposit {props.bountyInfo.token1Symbol} for applying the bounty
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
              renderUnit={() => renderUnit(props.bountyInfo.token1Symbol)}
            />
          )
        }
      },
      {
        t: 'custom',
        title: 'Description',
        name: 'description',
        rules: [
          { required: true, message: 'Description cannot be blank', trigger: 'blur' },
          {
            validator: (rule, value) => {
              return !value || (value && value.replace(/<.>|<\/.>/g, '').length > 30)
            },
            message: 'Description must be 30 characters or more',
            trigger: 'blur'
          }
        ],
        render() {
          return (
            <RichEditor
              placeholder="Describe what you offering is about"
              class="w-full"
              v-model:value={props.bountyInfo.description}
            />
          )
        }
      }
    ])
    const bountyBasicInfoRules = getFieldsRules(bountyBasicInfoFields.value)
    watch(
      () => props.bountyInfo,
      data => {
        console.log(data)
      }
    )
    const getStartupByComerId = async () => {
      const comerID = userStore.profile?.comerID
      try {
        const { error, data } = await services['bounty@bounty-startups']({
          comerID
        })
        if (!error) {
          startupOptions.value = (data.list || [])
            .map(startup => ({
              label: startup.name!,
              value: startup.startupID!
            }))
            .sort(function compareFunction(param1, param2) {
              return param1.label.localeCompare(param2.label, 'zh-Hans-CN', {
                sensitivity: 'accent'
              })
            })
        }
      } catch (error) {
        console.error('error', error)
      }
    }
    const goSetting = async () => {
      router.push({ path: `/startup/setting/${props.bountyInfo.startupID}` })
      ctx.emit('closeDrawer')
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
