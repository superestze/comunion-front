import { UCard } from '@comunion/components'
import { ArrowRightOutlined } from '@comunion/icons'
import { defineComponent, watch, ref } from 'vue'
export default defineComponent({
  props: {
    kyc: {
      type: String
    },
    contractAudit: {
      type: String
    }
  },
  setup(props) {
    const kycInfo = ref('')
    const auditInfo = ref('')
    watch(
      () => props.kyc,
      () => {
        kycInfo.value = props.kyc || ''
      },
      {
        immediate: true
      }
    )
    watch(
      () => props.contractAudit,
      () => {
        auditInfo.value = props.contractAudit || ''
      },
      {
        immediate: true
      }
    )

    return {
      kycInfo,
      auditInfo
    }
  },
  render() {
    return (
      <UCard title="Security" class="mb-6">
        <div>
          {this.kycInfo && (
            <div class="font-primary font-medium h-5 mb-2 leading-5">
              <a href={this.kycInfo} target="_blank">
                <div class="flex justify-end items-center">
                  <span class="mr-auto">KYC</span>
                  <p class="font-400 ml-1 max-w-58 text-color3 truncate">{this.kycInfo}</p>
                  <ArrowRightOutlined class="font-medium h-4 text-color3 w-4" />
                </div>
              </a>
            </div>
          )}
          {this.auditInfo && (
            <div class="font-primary font-medium h-5 mb-2 leading-5">
              <a href={this.auditInfo} target="_blank">
                <div class="flex justify-end items-center">
                  <span class="mr-auto">AUDIT</span>
                  <p class="font-400 ml-1 max-w-58 text-color3 truncate">{this.auditInfo}</p>
                  <ArrowRightOutlined class="font-medium h-4 text-color3 w-4" />
                </div>
              </a>
            </div>
          )}
        </div>
      </UCard>
    )
  }
})
