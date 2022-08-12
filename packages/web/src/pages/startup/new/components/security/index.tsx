import { UCard } from '@comunion/components'
import { defineComponent } from 'vue'

export default defineComponent({
  render() {
    return (
      <UCard title="SECURITY" class="mb-6">
        <div class="flex gap-2.5">
          <div class="text-white bg-[#EC53A4] py-1 px-2.5 rounded-2px">
            <a href="https://google.com" target="_blank">
              KYC
            </a>
          </div>
          <div class="text-white bg-primary py-1 px-2.5 rounded-2px">
            <a>AUDIT</a>
          </div>
        </div>
      </UCard>
    )
  }
})
