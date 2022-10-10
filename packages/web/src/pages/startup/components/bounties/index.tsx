import { UCard, UNoContent } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import BountyCard from '@/pages/bounty/components/BountyCard'
import { services } from '@/services'
import { BountyItem } from '@/types'
type BountyType = BountyItem[]

export default defineComponent({
  props: {
    startupId: {
      type: String,
      default: () => ''
    }
  },
  setup(props) {
    const bounties = ref<BountyType>([])
    const getBounties = async () => {
      const { error, data } = await services['bounty@startup-bounty-list']({
        page: 1,
        limit: 99,
        startupId: props.startupId
      })
      if (!error) {
        bounties.value.push(...(data!.rows ?? []))
      }
    }
    getBounties()
    return {
      bounties,
      getBounties
    }
  },
  render() {
    return (
      <UCard title="Bounty" class="mb-6">
        {Array.isArray(this.bounties) && this.bounties.length > 0 ? (
          this.bounties.map(item => (
            <BountyCard class="-mx-4" info={item} key={item.bountyId} miniCard />
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
