import { UCard, UNoContent } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import BountiesCard from '@/pages/bounty/components/BountyCard'
import { ServiceReturn, services } from '@/services'
import '@/assets/style/last-item-noborder.css'

type BountyType = NonNullable<ServiceReturn<'bounty@startup-bounty-list'>>['rows']

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
      <UCard title="Bounty" class="mb-6 last-item-noborder">
        {Array.isArray(this.bounties) && this.bounties.length > 0 ? (
          this.bounties.map(item => (
            <BountiesCard class="_item" startup={item} key={item.bountyId} miniCard />
          ))
        ) : (
          <UNoContent textTip="TO BE EMPTY">
            <EmptyFilled />
          </UNoContent>
        )}
      </UCard>
    )
  }
})
