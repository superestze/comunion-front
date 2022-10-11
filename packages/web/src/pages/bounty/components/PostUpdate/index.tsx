import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { PostUpdateDialog } from '../Dialog'
import { APPLICANT_STATUS, BOUNTY_STATUS, USER_ROLE } from '@/constants'

export default defineComponent({
  name: 'PostUpdate',
  props: {
    disabled: {
      type: Boolean,
      require: true,
      default: () => false
    },
    gapValue: {
      type: Number,
      required: true,
      default: 0
    },
    bountyContractInfo: {
      type: Object,
      required: true
    },
    postUpdate: {
      type: Function,
      require: true,
      default: () => false
    },
    bountySection: {
      type: Object,
      required: true,
      default: () => null
    }
  },
  emits: ['updateStatus'],
  setup(props, ctx) {
    const visible = ref<boolean>(false)
    const disabled = computed(() => {
      // if (props.bountyContractInfo.bountyStatus < BOUNTY_STATUS.WORKSTARTED) {
      //   return true
      // }
      if (props.bountyContractInfo.role === USER_ROLE.FOUNDER) {
        if (props.bountySection.detail.value?.status >= BOUNTY_STATUS.COMPLETED) {
          return true
        }
        return false
      }
      if (props.bountyContractInfo.status === APPLICANT_STATUS.APPROVED) {
        if (props.bountySection.detail.value?.status >= BOUNTY_STATUS.COMPLETED) {
          return true
        }
        return false
      }
      return true
    })
    const tooltip = computed(() => {
      if (disabled.value) {
        if (props.bountySection.detail.value?.status >= BOUNTY_STATUS.COMPLETED) {
          return 'The update button is unavailable when the bounty completed'
        } else {
          return 'The update button can only be available to be approved applicant.'
        }
      }
      return null
    })
    return {
      visible,
      disabled,
      tooltip
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }
    return (
      <>
        <PostUpdateDialog
          gapValue={this.gapValue}
          postUpdate={this.postUpdate}
          visible={this.visible}
          bountyContractInfo={this.bountyContractInfo}
          onTriggerDialog={flag => {
            triggerDialog()
            this.$emit('updateStatus', flag)
          }}
        />
        {this.tooltip ? (
          // <UButton
          //   type="primary"
          //   size="small"
          //   class="w-35"
          //   onClick={triggerDialog}
          //   disabled={this.disabled}
          //   color={this.disabled ? 'rgba(0,0,0,0.1)' : ''}
          // >
          //   Post update
          // </UButton>
          <UTooltip
            trigger="hover"
            placement="top"
            v-slots={{
              trigger: () => (
                <div>
                  <UButton
                    type="primary"
                    size="small"
                    class="w-35"
                    disabled={this.disabled}
                    color={'rgba(0,0,0,0.1)'}
                  >
                    Post update
                  </UButton>
                </div>
              ),
              default: () => this.tooltip
            }}
          />
        ) : (
          <UButton
            type="primary"
            size="small"
            class="w-35"
            onClick={triggerDialog}
            disabled={this.disabled}
            color={this.disabled ? 'rgba(0,0,0,0.1)' : ''}
          >
            Post update
          </UButton>
        )}
      </>
    )
  }
})
