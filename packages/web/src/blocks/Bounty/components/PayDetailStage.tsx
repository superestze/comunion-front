import { FormInst, UForm, UFormItem, UInput } from '@comunion/components'
import { MinusCircleOutlined, AddCircleOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref, computed } from 'vue'
import { BountyInfo } from '../typing'
import { MAX_AMOUNT, renderUnit } from './BasicInfo'
import InputNumberGroup from '@/components/UInputNumberGroup'

export interface PayDetailStageRef {
  payStageForm: FormInst | null
}

const PayDetailStage = defineComponent({
  name: 'PayDetailStage',
  props: {
    bountyInfo: {
      type: Object as PropType<BountyInfo>,
      required: true
    }
  },
  emits: ['delStage', 'addStage', 'showLeaveTipModal'],
  setup(props, ctx) {
    const payStageForm = ref<FormInst | null>(null)
    const payStagesTotal = computed(() => {
      const usdcTotal = props.bountyInfo.stages.reduce(
        (total, stage) => total + stage.token1Amount,
        0
      )
      const tokenTotal = props.bountyInfo.stages.reduce(
        (total, stage) => total + stage.token2Amount,
        0
      )
      return {
        usdcTotal,
        tokenTotal
      }
    })
    const delStage = (stageIndex: number) => {
      ctx.emit('delStage', stageIndex)
    }
    const addStage = () => {
      ctx.emit('addStage')
    }
    const showLeaveTipModal = () => {
      ctx.emit('showLeaveTipModal')
    }
    ctx.expose({
      payStageForm
    })
    return {
      payStageForm,
      payStagesTotal,
      delStage,
      addStage,
      showLeaveTipModal
    }
  },
  render() {
    return (
      <UForm
        model={this.bountyInfo.stages}
        ref={(ref: any) => (this.payStageForm = ref)}
        class="mt-7"
      >
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
                    max: MAX_AMOUNT,
                    parse: (value: string) => {
                      if (value === null) return 0
                      return Number(value)
                    }
                  }}
                  v-model:value={stage.token1Amount}
                  renderUnit={() => renderUnit(this.bountyInfo.token1Symbol)}
                ></InputNumberGroup>
                <div class="text-grey2 text-3xl px-5">+</div>
                <InputNumberGroup
                  class="flex-1"
                  type="withUnit"
                  inputProps={{
                    precision: 0,
                    min: 0,
                    max: MAX_AMOUNT,
                    parse: (value: string) => {
                      if (value === null) return 0
                      return Number(value)
                    }
                  }}
                  v-model:value={stage.token2Amount}
                  renderUnit={() => renderUnit(this.bountyInfo.token2Symbol)}
                ></InputNumberGroup>
              </div>
              <div class="grid grid-cols-[1fr,56px,1fr]">
                {!this.bountyInfo.token2Symbol && (
                  <div class="text-grey4 text-xs col-start-3 mt-2">
                    Not setup token yet, go to{' '}
                    <span
                      class="text-primary cursor-pointer"
                      onClick={() => this.showLeaveTipModal()}
                    >
                      Finance Setting
                    </span>
                  </div>
                )}
              </div>
              <UFormItem
                path={`${stageIndex}.terms`}
                rule={{
                  required: true,
                  message: 'please input the payment term',
                  trigger: 'blur'
                }}
              >
                <UInput
                  placeholder="The payment after applicant complete some tasks"
                  type="textarea"
                  rows={1}
                  class="-mt-1"
                  v-model:value={stage.terms}
                  maxlength={200}
                />
              </UFormItem>
            </div>

            <div
              class={[
                'flex items-center ',
                {
                  invisible: this.bountyInfo.stages.length <= 1,
                  'cursor-pointer': this.bountyInfo.stages.length > 1
                }
              ]}
              onClick={() => (this.bountyInfo.stages.length > 1 ? this.delStage(stageIndex) : null)}
            >
              <MinusCircleOutlined class="w-5 h-5 ml-5" />
            </div>

            <div
              class={[
                'flex items-center cursor-pointer',
                {
                  invisible: stageIndex + 1 < this.bountyInfo.stages.length,
                  'cursor-pointer': stageIndex + 1 === this.bountyInfo.stages.length
                }
              ]}
              onClick={stageIndex + 1 === this.bountyInfo.stages.length ? this.addStage : undefined}
            >
              <AddCircleOutlined class="w-5 h-5 ml-5" />
            </div>
          </div>
        ))}
        <div class="bg-purple py-5.5 px-6 mr-20 rounded-lg">
          The current total rewards as{' '}
          <span class="text-primary">
            {this.payStagesTotal.usdcTotal}
            {this.bountyInfo.token1Symbol}
            {this.bountyInfo.token2Symbol && (
              <span>
                {' '}
                + {this.payStagesTotal.tokenTotal}
                {this.bountyInfo.token2Symbol}
              </span>
            )}
          </span>
        </div>
      </UForm>
    )
  }
})

export default PayDetailStage
