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
        <div class="mt-3">
          {this.kycInfo && (
            <div class="h-5 leading-5 font-primary font-medium mb-2">
              <a href="https://google.com" target="_blank">
                <div class="flex justify-end items-center">
                  <span class="mr-auto">KYC</span>
                  <p class="ml-1 text-color3 font-400 max-w-58 truncate">https://google.com</p>
                  <ArrowRightOutlined class="w-4 h-4 text-color3 font-medium" />
                </div>
              </a>
            </div>
          )}
          {this.auditInfo && (
            <div class="h-5 leading-5 font-primary font-medium mb-2">
              <a href="https://google.com" target="_blank">
                <div class="flex justify-end items-center">
                  <span class="mr-auto">AUDIT</span>
                  <p class="ml-1 text-color3 font-400 max-w-58 truncate">https://google.com</p>
                  <ArrowRightOutlined class="w-4 h-4 text-color3 font-medium" />
                </div>
              </a>
            </div>
          )}
        </div>
      </UCard>
    )
  }
})
