import { UCard, UNoContent } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import CrowdfundingMiniCard from '@/pages/crowdfunding/components/CrowdfundingMiniCard'
import { services } from '@/services'

import { CrowdfundingItem } from '@/types'

export default defineComponent({
  props: {
    startupId: {
      type: String,
      default: () => ''
    }
  },
  setup(props) {
    const list = ref<CrowdfundingItem[]>([])
    const getBounties = async () => {
      const { error, data } = await services['crowdfunding@crowdfunding-list-of-startup']({
        startupId: props.startupId
      })
      if (!error) {
        list.value = data || []
      }
    }
    getBounties()
    return {
      list,
      getBounties
    }
  },
  render() {
    return (
      <UCard title="dCrowdfunding" class="mb-6 ">
        {Array.isArray(this.list) && this.list.length > 0 ? (
          this.list
            .filter(item => item.status !== 5)
            .map(item => (
              <CrowdfundingMiniCard class="-mx-4" info={item} key={item.crowdfundingId} />
            ))
        ) : (
          <UNoContent textTip="No connect yet">
            <EmptyFilled class="-mb-14" />
          </UNoContent>
        )}
      </UCard>
    )
  }
})
