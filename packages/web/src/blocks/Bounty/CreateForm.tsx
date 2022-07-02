import './style.css'
import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UCheckbox,
  UForm,
  UFormItemsFactory,
  UInput,
  UInputGroup,
  UModal,
  USelect,
  UTabPane,
  UTabs,
  message,
  UFormItem
} from '@comunion/components'
import { SelectOption } from '@comunion/components/src/constants'
import {
  AddCircleOutlined,
  MinusCircleOutlined,
  PeriodOutlined,
  StageOutlined,
  WarningFilled
} from '@comunion/icons'
import dayjs from 'dayjs'

import { defineComponent, ref, reactive, onMounted, h, computed, Ref } from 'vue'
import { useRouter } from 'vue-router'
// import CreateStartupForm from './CreateForm'
import { BountyInfo } from './typing'
import RichEditor from '@/components/Editor'
import Steps from '@/components/Step'
import InputNumberGroup from '@/components/UInputNumberGroup'
import { useBountyContract } from '@/contracts'
import { services } from '@/services'
import { useUserStore } from '@/stores'

interface ContactType {
  type: number
  value: string
}

const CreateBountyForm = defineComponent({
  // name: 'CreateBountyForm',
  emits: ['cancel'],
  setup(props, ctx) {
    const userStore = useUserStore()
    const stepOptions = ref([{ name: 'Bounty' }, { name: 'Payment' }, { name: 'Deposit' }])
    const contactOptions = ref([
      { label: 'Email', value: 1 },
      { label: 'Discord', value: 2 },
      { label: 'Telegram', value: 3 }
    ])
    const periodOptions = ref([
      { label: 'days', value: 'days' },
      { label: 'weeks', value: 'weeks' },
      { label: 'months', value: 'months' }
    ])
    const bountyContract = useBountyContract()
    const startupOptions = ref<SelectOption[]>([])
    const modalVisibleState = ref(false)
    const router = useRouter()
    const bountyDetailForm = ref<FormInst | null>(null)
    const payStageForm = ref<FormInst | null>(null)
    const payPeriodForm = ref<FormInst | null>(null)
    const bountyInfo = reactive<BountyInfo>({
      current: 1,
      startupID: undefined,
      title: '',
      expiresIn: undefined,
      contact: [{ type: 1, value: '' }],
      discussionLink: '',
      applicantsSkills: [],
      applicantsDeposit: 0,
      description: '',
      payDetailType: 'stage',
      token1Symbol: 'USDC',
      token2Symbol: '',
      stages: [{ token1Amount: 0, token2Amount: 0, terms: '' }],
      period: {
        periodType: 'weeks',
        periodAmount: 2,
        hoursPerDay: 1,
        target: '',
        token1Amount: 0,
        token2Amount: 0
      },
      deposit: 0,
      agreement: false
    })

    const addContact = () => {
      bountyInfo.contact.push({ type: 1, value: '' })
    }

    const delContact = (index: number) => {
      bountyInfo.contact.splice(index, 1)
    }

    const renderUnit = (name: string) => (
      <div class="flex justify-center items-center border rounded-r-lg px-10 bg-white w-30">
        {name}
      </div>
    )

    const addStage = () => {
      bountyInfo.stages.push({ token1Amount: 0, token2Amount: 0, terms: '' })
    }

    const delStage = (stageIndex: number) => {
      bountyInfo.stages.splice(stageIndex, 1)
    }

    const toFinanceSetting = () => {
      props.onCancel?.()
      const url = `/financesetting?startupId=${bountyInfo.startupID}`
      router.push(url)
    }

    const renderSelect = () => (
      <USelect
        class="w-30 text-center"
        options={periodOptions.value}
        value={bountyInfo.period.periodType}
      />
    )

    const payStagesTotal = computed(() => {
      const usdcTotal = bountyInfo.stages.reduce((total, stage) => total + stage.token1Amount, 0)
      const tokenTotal = bountyInfo.stages.reduce((total, stage) => total + stage.token2Amount, 0)
      return {
        usdcTotal,
        tokenTotal
      }
    })

    const onSubmit = async () => {
      try {
        await bountyContract.createBounty(
          [bountyInfo.deposit],
          'Waiting to submit all contents to blockchain for creating bounty',
          `Bounty "${bountyInfo.title}" is Creating`
        )
        message.success('Success send transaction to the chain, please wait for the confirmation')
        await services['bounty@bounty-create']({
          bountyDetail: {
            startupID: bountyInfo.startupID as number,
            title: bountyInfo.title,
            expiresIn: dayjs(bountyInfo.expiresIn).format('YYYY-MM-DD HH:mm:ss'),
            contact: bountyInfo.contact.map(item => ({})),
            discussionLink: bountyInfo.discussionLink,
            applicantsSkills: bountyInfo.applicantsSkills,
            applicantsDeposit: bountyInfo.applicantsDeposit,
            description: bountyInfo.description
          },
          payDetail: {
            stages:
              bountyInfo.payDetailType === 'stage'
                ? bountyInfo.stages.map((stage, stageIndex) => ({
                    seqNum: stageIndex + 1,
                    token1Amount: stage.token1Amount,
                    token1Symbol: bountyInfo.token1Symbol,
                    token2Amount: stage.token2Amount,
                    token2Symbol: bountyInfo.token2Symbol,
                    terms: stage.terms
                  }))
                : [],
            period:
              bountyInfo.payDetailType === 'period'
                ? {
                    periodAmount: bountyInfo.period.periodAmount,
                    periodType: bountyInfo.period.periodType,
                    hoursPerDay: bountyInfo.period.hoursPerDay,
                    token1Amount: bountyInfo.period.token1Amount,
                    token1Symbol: bountyInfo.token1Symbol,
                    token2Amount: bountyInfo.period.token2Amount,
                    token2Symbol: bountyInfo.token2Symbol,
                    target: bountyInfo.period.target
                  }
                : {
                    periodAmount: bountyInfo.period.periodAmount
                  }
          },
          deposit: {
            tokenSymbol: bountyInfo.token1Symbol,
            tokenAmount: bountyInfo.deposit
          }
        })
      } catch (error) {
        console.error('error===>', error)
      }
    }

    const bountyBasicInfoFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'select',
        title: 'Startup',
        name: 'startupID',
        placeholder: 'Select a startup',
        rules: [{ required: true, message: ' Please select a startup', type: 'number' }],
        options: startupOptions.value
      },
      {
        t: 'string',
        title: 'Title',
        name: 'title',
        rules: [{ required: true, message: 'Please enter the title' }],
        placeholder: 'Title',
        maxlength: 200
      },
      {
        t: 'date',
        class: 'w-full',
        type: 'datetime',
        title: 'Expires In',
        name: 'expiresIn',
        rules: [{ required: true, message: 'Please set the apply cutoff date' }],
        placeholder: 'Apply Cutoff Date'
      },
      {
        t: 'custom',
        title: 'Contact',
        name: 'contact',
        rules: [
          {
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
              {bountyInfo.contact.map((item: ContactType, itemIndex: number) => (
                <UInputGroup class={{ 'mb-4': itemIndex < bountyInfo.contact.length - 1 }}>
                  <USelect options={contactOptions.value} value={item.type} class="w-50"></USelect>
                  <UInput class="flex-1" v-model:value={item.value}></UInput>

                  {bountyInfo.contact.length > 1 && (
                    <div
                      class="flex items-center cursor-pointer"
                      onClick={() => delContact(itemIndex)}
                    >
                      <MinusCircleOutlined class="w-5 h-5 ml-4.5" />
                    </div>
                  )}

                  {itemIndex + 1 === bountyInfo.contact.length && itemIndex < 5 && (
                    <div class="flex items-center cursor-pointer" onClick={addContact}>
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
        rules: [
          {
            validator: (rule, value) => {
              console.log('value===>', value)

              return value < 9999
            },
            message: 'The maximal deposit amount is 9999USDC'
          }
        ],
        render(value) {
          return (
            <InputNumberGroup
              value={bountyInfo.applicantsDeposit}
              type="withUnit"
              class="w-full"
              inputProps={{
                precision: 0,
                min: 0,
                max: 9998,
                class: 'flex-1',
                onUpdateValue(value: number | null) {
                  console.log('value===>', value)

                  if (!value) return
                  if (value < 0) bountyInfo.applicantsDeposit = 0
                  if (value >= 9999) bountyInfo.applicantsDeposit = 9998
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
              v-model:value={bountyInfo.description}
            />
          )
        }
      }
    ])

    const payDetailPeriodFields: FormFactoryField[] = [
      {
        t: 'custom',
        title: 'Work time planning',
        name: 'period',
        render(value) {
          return (
            <div class="w-full">
              <div class="flex items-center">
                <InputNumberGroup
                  inputProps={{
                    precision: 0,
                    min: 2
                  }}
                  v-model:value={bountyInfo.period.periodAmount}
                  class="flex-1"
                  type="withSelect"
                  renderSelect={() => renderSelect()}
                ></InputNumberGroup>
                <div class="text-grey2 text-3xl px-5 invisible">+</div>
                <InputNumberGroup
                  inputProps={{
                    precision: 0,
                    min: 1,
                    max: 24
                  }}
                  v-model:value={bountyInfo.period.hoursPerDay}
                  class="flex-1"
                  type="withUnit"
                  renderUnit={() => renderUnit('hours/Day')}
                ></InputNumberGroup>
              </div>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: 'Rewards (once)',
        name: 'rewards',
        render(value) {
          return (
            <div class="flex items-center w-full">
              <InputNumberGroup
                class="flex-1"
                type="withUnit"
                v-model:value={bountyInfo.period.token1Amount}
                renderUnit={() => renderUnit(bountyInfo.token1Symbol)}
              ></InputNumberGroup>
              <div class="text-grey2 text-3xl px-5">+</div>
              <InputNumberGroup
                class="flex-1"
                type="withUnit"
                v-model:value={bountyInfo.period.token2Amount}
                renderUnit={() => renderUnit(bountyInfo.token2Symbol)}
              ></InputNumberGroup>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: '',
        name: 'summary',
        render() {
          return (
            <div class="bg-purple py-5.5 px-6 w-full">
              The current total rewards as{' '}
              <span class="text-primary">
                {bountyInfo.period.token1Amount}
                {bountyInfo.token1Symbol}{' '}
                {bountyInfo.token2Symbol &&
                  `+ ${bountyInfo.period.token2Amount}${bountyInfo.token2Symbol}`}
              </span>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: 'Target',
        name: 'period.target',
        // required: true,
        rules: [
          { required: true, message: 'Please input description and target of bounty for applicant' }
        ],
        render() {
          return (
            <RichEditor
              placeholder="Set up description and target of bounty for applicant"
              class="w-full"
              v-model:value={bountyInfo.period.target}
            />
          )
        }
      }
    ]

    const depositFields: FormFactoryField[] = [
      {
        t: 'custom',
        name: 'deposit',
        title: 'Deposit',
        slots: {
          label: () => [
            h(
              <div>
                Deposit
                <span class="text-xs text-grey4 ml-4">
                  Depoist usdc into bounty contract which can enhance credit in order to attract
                  much more applicants
                </span>
              </div>
            )
          ]
        },
        render(value) {
          return (
            <InputNumberGroup
              v-model:value={bountyInfo.deposit}
              class="flex-1"
              inputProps={{
                precision: 0,
                class: 'flex-1'
              }}
              type="withUnit"
              renderUnit={() => renderUnit(bountyInfo.token1Symbol)}
            ></InputNumberGroup>
          )
        }
      },
      {
        t: 'custom',
        name: 'agreement',
        title: '',
        render(value) {
          return (
            <div class="flex items-center mt-4.5">
              <UCheckbox
                label="I have read, understand, and agree to, "
                v-model:checked={bountyInfo.agreement}
              />
              <span class="text-primary">the Terms of Service.</span>
            </div>
          )
        }
      }
    ]

    const getFinanceSymbol = async (startupId?: number) => {
      if (!startupId) {
        bountyInfo.token2Symbol = ''
        return
      }
      const { error, data } = await services['startup@startup-get']({
        startupId
      })
      if (!error) {
        bountyInfo.token2Symbol = data.tokenSymbol
      }
    }

    computed(() => {
      getFinanceSymbol(bountyInfo.startupID)
    })

    const getStartupByComerId = async () => {
      const comerID = userStore.profile?.comerID

      try {
        const { error, data } = await services['bounty@bounty-startups']({
          comerID
        })
        if (!error) {
          console.log('data===>', data)
          startupOptions.value = (data.startups || []).map(startup => ({
            label: startup.name!,
            value: startup.startupID!
          }))
          console.log('startupOptions.value==>', startupOptions.value)
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    onMounted(() => {
      getStartupByComerId()
    })

    const toNext = () => {
      console.log('bountyInfo===>', bountyInfo)

      if (bountyInfo.current === 1) {
        console.log('bountyDetailForm==>', bountyDetailForm.value)

        bountyDetailForm.value?.validate(error => {
          if (!error) {
            bountyInfo.current += 1
          }
        })
      } else if (bountyInfo.current === 2 && bountyInfo.payDetailType === 'stage') {
        payStageForm.value?.validate(error => {
          if (!error) {
            bountyInfo.current += 1
          }
        })
      } else if (bountyInfo.current === 2 && bountyInfo.payDetailType === 'period') {
        payPeriodForm.value?.validate(error => {
          if (!error) {
            bountyInfo.current += 1
          }
        })
      }
    }

    const toPreviousStep = () => {
      bountyInfo.current -= 1
    }

    const bountyBasicInfoRules = getFieldsRules(bountyBasicInfoFields.value)
    const payPeriodRules = getFieldsRules(payDetailPeriodFields)

    ctx.expose({
      bountyInfo,
      toNext,
      toPreviousStep,
      onSubmit
    })

    return {
      stepOptions,
      bountyInfo,
      modalVisibleState,
      bountyBasicInfoFields,
      bountyBasicInfoRules,
      payDetailPeriodFields,
      payPeriodRules,
      depositFields,
      toFinanceSetting,
      bountyDetailForm,
      payStageForm,
      payPeriodForm,
      renderUnit,
      renderSelect,
      delStage,
      addStage,
      payStagesTotal
    }
  },

  render() {
    return (
      <div>
        <div class="mb-15 mx-35">
          <Steps steps={this.stepOptions} current={this.bountyInfo.current} />
        </div>
        {this.bountyInfo.current === 1 && (
          <UForm
            ref={(ref: any) => (this.bountyDetailForm = ref)}
            rules={this.bountyBasicInfoRules}
            model={this.bountyInfo}
          >
            <UFormItemsFactory fields={this.bountyBasicInfoFields} values={this.bountyInfo} />
          </UForm>
        )}
        {this.bountyInfo.current === 2 && (
          <UTabs v-model:value={this.bountyInfo.payDetailType} class="mt-10">
            <UTabPane
              name="stage"
              v-slots={{
                tab: () => (
                  <div class="flex items-center">
                    <StageOutlined class="mr-4" /> Stage
                  </div>
                )
              }}
            >
              <UForm model={this.bountyInfo.stages} ref={(ref: any) => (this.payStageForm = ref)}>
                {/* <UFormItemsFactory fields={this.payDetailStageFields} values={this.bountyInfo} /> */}
                {this.bountyInfo.stages.map((stage: any, stageIndex: number) => (
                  <div class="mb-6 flex items-center">
                    <div class="bg-purple rounded-lg p-4">
                      <div class="text-grey1">Rewards</div>
                      {/* <div class="flex items-center"> */}
                      <div class="grid grid-cols-[1fr,56px,1fr]">
                        <InputNumberGroup
                          class="flex-1"
                          type="withUnit"
                          inputProps={{
                            precision: 0,
                            min: 0,
                            max: 9998
                          }}
                          v-model:value={stage.token1Amount}
                          renderUnit={() => this.renderUnit(this.bountyInfo.token1Symbol)}
                        ></InputNumberGroup>
                        <div class="text-grey2 text-3xl px-5">+</div>
                        <InputNumberGroup
                          class="flex-1"
                          type="withUnit"
                          inputProps={{
                            precision: 0,
                            min: 0,
                            max: 9998
                          }}
                          v-model:value={stage.token2Amount}
                          renderUnit={() => this.renderUnit(this.bountyInfo.token2Symbol)}
                        ></InputNumberGroup>
                      </div>
                      <div class="grid grid-cols-[1fr,56px,1fr]">
                        {!this.bountyInfo.token2Symbol && (
                          <div class="text-grey4 text-xs col-start-3 mt-2">
                            Not setup token yet, go to{' '}
                            <span
                              class="text-primary cursor-pointer"
                              onClick={() => (this.modalVisibleState = true)}
                            >
                              Finance Setting
                            </span>
                          </div>
                        )}
                      </div>
                      <UFormItem
                        path={`${stageIndex}.terms`}
                        rule={{ required: true, message: 'please input the payment term' }}
                      >
                        <UInput
                          placeholder="The payment after applicant complete some tasks"
                          type="textarea"
                          rows={1}
                          class="mt-6"
                          v-model:value={stage.terms}
                          maxlength={200}
                        />
                      </UFormItem>
                    </div>

                    <div
                      class={[
                        'flex items-center cursor-pointer',
                        { hidden: this.bountyInfo.stages.length <= 1 }
                      ]}
                      onClick={() => this.delStage(stageIndex)}
                    >
                      <MinusCircleOutlined class="w-5 h-5 ml-4.5" />
                    </div>

                    <div
                      class={[
                        'flex items-center cursor-pointer',
                        { invisible: stageIndex + 1 < this.bountyInfo.stages.length }
                      ]}
                      onClick={this.addStage}
                    >
                      <AddCircleOutlined class="w-5 h-5 ml-5" />
                    </div>
                  </div>
                ))}
                <div class="bg-purple py-5.5 px-6">
                  The current total rewards as{' '}
                  <span class="text-primary">
                    {this.payStagesTotal.usdcTotal}
                    {this.bountyInfo.token1Symbol}
                    {this.bountyInfo.token2Symbol && this.payStagesTotal.tokenTotal && (
                      <span>
                        {' '}
                        + {this.payStagesTotal.tokenTotal} {this.bountyInfo.token2Symbol}
                      </span>
                    )}
                  </span>
                </div>
              </UForm>
            </UTabPane>
            <UTabPane
              name="period"
              v-slots={{
                tab: () => (
                  <div class="flex items-center">
                    <PeriodOutlined class="mr-4" />
                    Period
                  </div>
                )
              }}
            >
              <UForm
                class="mt-9"
                model={this.bountyInfo}
                rules={this.payPeriodRules}
                ref={(ref: any) => (this.payPeriodForm = ref)}
              >
                <UFormItemsFactory fields={this.payDetailPeriodFields} values={this.bountyInfo} />
              </UForm>
            </UTabPane>
          </UTabs>
        )}
        {this.bountyInfo.current === 3 && (
          <UForm model={this.bountyInfo} class="deposit-form">
            <UFormItemsFactory fields={this.depositFields} values={this.bountyInfo} />
          </UForm>
        )}
        {/* {this.visible && <CreateStartupForm onCancel={this.close} />} */}
        {/* {this.footer()} */}
        <UModal v-model:show={this.modalVisibleState} maskClosable={false}>
          <UCard
            style={{ width: '540px' }}
            closable={true}
            class="!p-7"
            onClose={() => (this.modalVisibleState = false)}
          >
            <div class="relative -top-3 flex items-center">
              <WarningFilled /> <span class="u-title1 ml-4">Discard changes?</span>
            </div>
            <div class="mt-3 ml-12 u-body2">
              This can’t be undone and you’ll lose your changes.{' '}
            </div>
            <div class="flex justify-end mt-20">
              <UButton
                size="large"
                type="primary"
                ghost
                class="w-41 mr-4"
                onClick={() => (this.modalVisibleState = false)}
              >
                Cancel
              </UButton>
              <UButton size="large" type="primary" class="w-41" onClick={this.toFinanceSetting}>
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </div>
    )
  }
})

export default CreateBountyForm
