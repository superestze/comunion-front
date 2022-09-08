import { UCard } from '@comunion/components'
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
      <UCard title="SECURITY" class="mb-6">
        <div class="flex mt-3 gap-2.5">
          {this.kycInfo && (
            <div class="bg-[#EC53A4] rounded-2px h-5 text-white px-2.5 leading-5">
              <a href="https://google.com" target="_blank">
                KYC
              </a>
            </div>
          )}
          {this.auditInfo && (
            <div class="bg-primary rounded-2px h-5  text-white px-2.5 leading-5">
              <a>AUDIT</a>
            </div>
          )}
        </div>
      </UCard>
    )
  }
})
